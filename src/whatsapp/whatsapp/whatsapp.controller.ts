// import { Controller, Get, Req, HttpCode, Post, Body } from '@nestjs/common';
// import { Request } from 'express';
// import { WhatsappService } from './whatsapp.service';

// @Controller('whatsapp')
// export class WhatsappController {
//   constructor(private readonly whatsAppService: WhatsappService) {}
//   @Get('webhook')
//   whatsappVerificationChallenge(@Req() request: Request) {
//     const mode = request.query['hub.mode'];
//     const challenge = request.query['hub.challenge'];
//     const token = request.query['hub.verify_token'];

//     const verificationToken =
//       process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

//     if (!mode && !token) {
//       return 'Error verifying token';
//     }

//     if (mode === 'subscribe' && token === verificationToken) {
//       return challenge?.toString();
//     }
//     return 'Verification failed';
//   }

//   @Post('webhook')
//   @HttpCode(200)
//   async handleIncomingWhatsappMessage(@Body() request: any) {
//     const { messages } = request?.entry?.[0]?.changes?.[0].value ?? {};
//     if (!messages) return;

//     const message = messages[0];
//     const messageSender = message.from;
//     const messageID = message.id;

//     switch (message.type) {
//       case 'text':
//         const text = message.text.body;

//         await this.whatsAppService.sendWhatsAppMessage(messageSender);
//         break;
//     }
//   }
// }
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
import { WhatsappService } from './whatsapp.service';
import { WhatsAppWebhookPayload } from './types';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsAppService: WhatsappService) {}

  @Get('webhook')
  whatsappVerificationChallenge(@Req() request: Request): string {
    const mode = request.query['hub.mode'] as string;
    const challenge = request.query['hub.challenge'] as string;
    const token = request.query['hub.verify_token'] as string;

    const verificationToken =
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

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
  async handleIncomingWhatsappMessage(
    @Body() request: WhatsAppWebhookPayload,
  ): Promise<void> {
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

        await this.whatsAppService.sendWhatsAppMessage(messageSender);
        break;
      }
      default:
        this.logger.warn(`Unhandled message type: ${message.type}`);
    }
  }
}
