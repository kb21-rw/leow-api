import { lastValueFrom, map } from 'rxjs';
import { WHATSAPP_CLOUD_API_ACCESS_TOKEN } from 'src/message/constants/cloud-api';

import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';

export async function getMediaUrl(
  mediaId: string,
  httpService: HttpService,
): Promise<string> {
  const url = `https://graph.facebook.com/v16.0/${mediaId}?field=link&access_token=${WHATSAPP_CLOUD_API_ACCESS_TOKEN}`;

  try {
    const response = await lastValueFrom(
      httpService
        .get<{ url: string }>(url)
        .pipe(map((res) => res.data as { url: string })),
    );
    return response.url;
  } catch (error) {
    throw new BadRequestException(`Error fetching media URL: ${error}`);
  }
}

export async function downloadMedia(
  mediaId: string,
  httpService: HttpService,
): Promise<Buffer> {
  const mediaUrl = await getMediaUrl(mediaId, httpService);

  try {
    const response = await lastValueFrom(
      httpService
        .get(mediaUrl, {
          headers: {
            Authorization: `Bearer ${WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
          },
          responseType: 'arraybuffer',
        })
        .pipe(map((res: { data: ArrayBuffer }) => res.data)),
    );

    return Buffer.from(response);
  } catch (error) {
    throw new BadRequestException(`Error downloading media: ${error}`);
  }
}
