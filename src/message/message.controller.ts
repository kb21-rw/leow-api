import {
  Controller,
  Get,
  Req,
  HttpCode,
  Post,
  Body,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { WebhookPayload } from './types';
import { QuestionsService } from '../questions/questions.service';

@Controller('message')
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Get('webhook')
  verifyWebhook(@Req() request: Request): string {
    const mode = request.query['hub.mode'] as string;
    const challenge = request.query['hub.challenge'] as string;
    const token = request.query['hub.verify_token'] as string;

    const verificationToken =
      process.env.Message_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

    if (!mode && !token) {
      return 'Error verifying token';
    }

    if (mode === 'subscribe' && token === verificationToken) {
      return challenge;
    }
    return 'Verification failed';
  }

  @Post('webhook')
  @HttpCode(200)
  async incomingText(@Body() request: WebhookPayload): Promise<void> {
    const { messages } = request?.entry?.[0]?.changes?.[0]?.value ?? {};
    if (!messages) return;

    const message = messages[0];
    const messageSender = message.from;
    const messageId = message.id;

    this.logger.log(`Received message ${messageId} from ${messageSender}`);

    switch (message.type) {
      case 'text': {
        const text = message.text?.body;
        if (!text) {
          this.logger.warn('Received text message without body');
          return;
        }

        // Send welcome message for first-time users
        await this.messageService.sendText(
          messageSender,
          '*Muraho!* 👋\nIkaze kuri *Learn English*! Hano uziga Icyongereza mu buryo bworoshye kandi bushimishije.',
        );

        await this.questionsService.getNext(messageSender);
        break;
      }

      case 'interactive': {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const buttonTitle = message.interactive?.button_reply?.title;

        const currentQuestion = this.questionsService.findById(
          this.questionsService.getCurrentQuestionId(messageSender),
        );

        let responseMessage = '';

        if (currentQuestion) {
          if (buttonTitle === currentQuestion.answer) {
            responseMessage = 'Correct!';
          } else {
            responseMessage = 'Incorrect!';
          }

          await this.messageService.sendText(messageSender, responseMessage);

          setTimeout(() => {
            this.questionsService
              .getNext(messageSender)
              .catch((error) =>
                this.logger.error('Error sending next question', error),
              );
          }, 1000);
        }
        break;
      }
      default:
        this.logger.warn(`Unhandled message type: ${message.type}`);
    }
  }
}
