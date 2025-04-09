import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { ConfigModule } from '@nestjs/config';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [ConfigModule.forRoot(), WhatsappModule, QuestionsModule],
  controllers: [AppController, WhatsappController],
  providers: [AppService, WhatsappService],
})
export class AppModule {}
