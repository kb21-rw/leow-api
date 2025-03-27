import {
  Controller,
  Get,
  Req,
  // HttpCode,
  // Post,
  // Body,
  // BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
// import { catchError, map } from 'rxjs';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private httpService: HttpService) {}
  private readonly logger = new Logger(WhatsappController.name);
  @Get('webhook')
  whatsappVerificationChallenge(@Req() request: Request) {
    const mode = request.query['hub.mode'];
    const challenge = request.query['hub.challenge'];
    const token = request.query['hub.verify_token'];

    const verificationToken =
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

    if (!mode && !token) {
      return 'Error verifying token';
    }

    if (mode === 'subscribe' && token === verificationToken) {
      return challenge;
      // ?.toString();
    }
    return 'Verification failed';
  }

  // @Post('webhook')
  // @HttpCode(200)
  // async handleIncomingWhatsappMessage(@Body() request: any) {
  //   const { messages } = request?.entry?.[0]?.changes?.[0].value ?? {};
  //   if (!messages) return;

  //   const message = messages[0];
  //   const messageSender = message.from;
  //   const messageID = message.id;

  //   switch (message.type) {
  //     case 'text':
  //       const text = message.text.body;
  //       const url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID}/message`;
  //       const config = {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
  //         },
  //       };

  //       const data = JSON.stringify({
  //         messaging_product: 'whatsapp',
  //         recipient_type: 'individual',
  //         to: messageSender,
  //         type: 'text',
  //         text: {
  //           preview_url: false,
  //           body: 'Response Message from Our Leow Bot!!!',
  //         },
  //       });

  //       try {
  //         const response = this.httpService
  //           .post(url, data, config)
  //           .pipe(
  //             map((res) => {
  //               return res.data;
  //             }),
  //           )
  //           .pipe(
  //             catchError((error) => {
  //               this.logger.error(error);
  //               throw new BadRequestException(
  //                 'Error Posting to Whatsapp Cloud API',
  //               );
  //             }),
  //           );
  //       } catch (error) {
  //         this.logger.error(error);
  //         return 'Axle broke. Abort Mission';
  //       }
  //       break;
  //   }
  // }
}
