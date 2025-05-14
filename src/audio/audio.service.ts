import { createClient, DeepgramClient } from '@deepgram/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioService {
  private deepgram: DeepgramClient;
  private readonly logger = new Logger(AudioService.name);

  constructor(private configService: ConfigService) {
    const deepgramApiKey = this.configService.get<string>('DEEPGRAM_API_KEY');
    this.deepgram = createClient(deepgramApiKey);
  }

  async transcribe(url: string): Promise<string> {
    const { result, error } =
      await this.deepgram.listen.prerecorded.transcribeUrl(
        {
          url,
        },
        {
          model: 'nova-3',
          smart_format: true,
        },
      );
    if (error) throw error;

    return result.results.channels[0].alternatives[0].transcript;
  }

  async transcribeBuffer(audioBuffer: Buffer): Promise<string> {
    const { result, error } =
      await this.deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
        model: 'nova-3',
        smart_format: true,
      });

    if (error) throw error;

    this.logger.log('Transcription result:', result);

    return result.results.channels[0].alternatives[0].transcript;
  }
}
