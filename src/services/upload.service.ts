import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { FileItem } from 'src/domain/interfaces/file.interface';
import { UploadFileItem } from 'src/domain/interfaces/uploadFile.interface';
import { FileNotFoundError } from 'src/errors';
import { ProductInventoryLog } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { extractAndFormatDate } from 'src/tools/extract-date';

@Injectable()
export class UploadService {
  private s3: AWS.S3;

  constructor(
    @InjectRepository(ProductInventoryLog)
    private readonly productInventoryLogRepository: Repository<ProductInventoryLog>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    clientId: string,
    inventoryUpdateId: number,
    fileType: 'consolidated' | 'conciliation',
  ): Promise<UploadFileItem> {
    const folder = clientId || 'default';
    const now = new Date();
    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(now, timeZone);
    const formattedDate = format(zonedDate, 'yyyy-MM-dd_HH-mm-ss');

    const fileName = `${folder}/${fileType}/${formattedDate}.pdf`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await this.s3.upload(params).promise();

    const s3Url = uploadResult.Location;
    const fileUrl = s3Url.replace(
      `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`,
      `${process.env.CLOUDFRONT_DOMAIN}`,
    );

    const logEntry = await this.productInventoryLogRepository.findOne({
      where: { id: inventoryUpdateId },
    });

    if (!logEntry) {
      throw new BadRequestException(`Log de inventário não encontrado para o ID: ${inventoryUpdateId}`);
    }

    if (fileType === 'conciliation') {
      logEntry.conciliationURL = fileUrl;
    } else {
      logEntry.URL = fileUrl;
    }

    await this.productInventoryLogRepository.save(logEntry);

    return {
      message: `PDF ${fileType} enviado com sucesso!`,
      url: fileUrl,
    };
  }

  async listFiles(clientId: string): Promise<FileItem[]> {
    const logs = await this.productInventoryLogRepository.find({
      where: { storeId: Number(clientId) },
      order: { createdAt: 'DESC' },
    });

    if (logs.length === 0) {
      throw new FileNotFoundError();
    }

    const files = logs.map((log) => {
      if (!log.URL) {
        return null;
      }

      return {
        url: log.URL,
        conciliationUrl: log.conciliationURL,
        name: log.URL.split('/').pop(),
        date: format(toZonedTime(log.createdAt, 'America/Sao_Paulo'), 'yyyy-MM-dd HH:mm:ss'),
        email: log.userName,
      };
    });

    return files.filter((file) => file !== null);
  }

  async listFilesByS3(clientId: string): Promise<FileItem[]> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${clientId}/`,
    };

    const data = await this.s3.listObjectsV2(params).promise();

    const files =
      data.Contents?.map((item) => {
        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
        const fileUrl = s3Url.replace(
          `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`,
          `${process.env.CLOUDFRONT_DOMAIN}`,
        );
        const fileName = item.Key?.split('/').pop();

        if (!fileName) {
          throw new Error(`Nome do arquivo não encontrado para o item: ${item.Key}`);
        }

        return {
          url: fileUrl,
          name: fileName,
          date: extractAndFormatDate(fileName),
        };
      }) || [];

    if (files.length === 0) {
      throw new FileNotFoundError();
    }

    return files;
  }
}
