import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappController } from './whatsapp/whatsapp/whatsapp.controller';
import { ConfigModule } from '@nestjs/config';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { WhatsappService } from './whatsapp/whatsapp/whatsapp.service';

@Module({
  imports: [ConfigModule.forRoot(), WhatsappModule],
  controllers: [AppController, WhatsappController],
  providers: [AppService, WhatsappService],
})
export class AppModule {}
