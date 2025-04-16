import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { InteractiveMessageResponse, MessageResponse } from './types';
import {
  WHATSAPP_CLOUD_API_ACCESS_TOKEN,
  WHATSAPP_CLOUD_API_MESSAGES_URL,
} from './constants/cloud-api';

interface ApiResponse {
  messages: Array<{
    id: string;
    message_status: string;
  }>;
}

@Injectable()
export class MessageService {
  private readonly httpService = new HttpService();
  private readonly logger = new Logger(MessageService.name);
  private userSessions = new Map<
    string,
    {
      currentQuestionId: number;
    }
  >();

  getUserSession(messageSender: string) {
    if (!this.userSessions.has(messageSender)) {
      this.userSessions.set(messageSender, {
        currentQuestionId: 1,
      });
    }
    return this.userSessions.get(messageSender);
  }

  incrementCurrentQuestion(messageSender: string) {
    const userSession = this.getUserSession(messageSender);
    if (userSession) {
      userSession.currentQuestionId++;
    }
  }

  async parseText(
    messageSender: string,
    message: InteractiveMessageResponse,
  ): Promise<void> {
    const text = message.text?.body;
    if (!text) {
      this.logger.warn('Received text message without body');
      return;
    }

    const userSession = this.getUserSession(messageSender);

    if (userSession?.currentQuestionId === 1) {
      await this.sendText(
        messageSender,
        '*Muraho!* 👋\nIkaze kuri *Learn English*! Hano uziga Icyongereza mu buryo bworoshye kandi bushimishije.',
      );
    }
  }

  async sendRequest(data: any): Promise<string> {
    const url = WHATSAPP_CLOUD_API_MESSAGES_URL;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = this.httpService
        .post<ApiResponse>(url, data, config)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((error) => {
            this.logger.error(error);
            throw new BadRequestException('Error Posting to Cloud API');
          }),
        );
      const messageSendingStatus = await lastValueFrom(response);
      this.logger.log('Message Sent. Status:', messageSendingStatus);
      return 'Message sent successfully';
    } catch (error) {
      this.logger.error(error);
      return 'There was an error sending the message';
    }
  }

  async sendText(recipient: string, text: string): Promise<string> {
    const data: MessageResponse = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        body: text,
      },
    };

    return this.sendRequest(data);
  }

  async sendMediaAndText(
    recipient: string,
    mediaUrl: string,
    text: string,
  ): Promise<string> {
    const mediaData = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'image',
      image: {
        link: mediaUrl,
        caption: text,
      },
    };

    return this.sendRequest(mediaData);
  }

  async sendWithOptions(
    recipient: string,
    question: string,
    options: string[],
  ): Promise<string> {
    const buttons = options.map((option, index) => ({
      type: 'reply',
      reply: {
        id: `option_${index}`,
        title: option,
      },
    }));

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: question,
        },
        action: {
          buttons,
        },
      },
    };

    return this.sendRequest(data);
  }

  sendNext(
    recipient: string,
    message: { question: string; options: string[] },
  ): Promise<string> {
    // Send question with options
    if (message.options && message.options.length > 0) {
      return this.sendWithOptions(recipient, message.question, message.options);
    }
    // Handle other cases or return a default value
    return Promise.resolve('Loading questions..');
  }

  async sendFeedback(
    recipient: string,
    feedback: { message: string; gif: string },
  ): Promise<void> {
    await this.sendMediaAndText(recipient, feedback.gif, feedback.message);
    this.incrementCurrentQuestion(recipient)!;
  }
}
