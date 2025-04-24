import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import { UploadService } from './upload.service';
import { extractAndFormatDateToEmailV2 } from 'src/tools/extract-date';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly uploadService: UploadService) {
    this.transporter = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: '2010-12-01',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendLatestFile(clientId: string, clientCnpj: string, clientName: string, emails: string[]): Promise<void> {
    const files = await this.uploadService.listFiles(clientId);

    if (files.length === 0) {
      throw new BadRequestException(`Nenhum arquivo encontrado para o clientId: ${clientId}`);
    }

    const latestFile = files[0];
    const fileKey = latestFile.url.split(`${process.env.CLOUDFRONT_DOMAIN}/`)[1];

    if (!fileKey) {
      throw new BadRequestException(`Chave do arquivo inválida extraída da URL: ${latestFile.url}`);
    }

    const s3 = new AWS.S3();

    const fileData = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      })
      .promise();

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: emails,
      subject: `Consolidado do inventário - ${clientCnpj} - ${clientName} - Data ${latestFile.date} - Elfa`,
      text: `Segue anexo o arquivo mais recente para o cliente: ${clientCnpj} - ${clientName}`,
      attachments: [
        {
          filename: fileKey.split('/').pop(),
          content: fileData.Body as Buffer,
        },
      ],
    });
  }

  async sendPdfFile(
    clientId: string,
    clientCnpj: string,
    clientName: string,
    url: string,
    emails: string[],
  ): Promise<void> {
    const s3 = new AWS.S3();

    const fileKey = url.split(`${process.env.CLOUDFRONT_DOMAIN}/`)[1];

    if (!fileKey) {
      throw new BadRequestException(`Chave do arquivo inválida extraída da URL: ${url}`);
    }

    if (!fileKey.startsWith(`${clientId}/`)) {
      throw new BadRequestException(`O arquivo fornecido não pertence ao clientId especificado: ${clientId}`);
    }

    let fileData;

    try {
      fileData = await s3
        .getObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
        })
        .promise();
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new BadRequestException(`O arquivo especificado não foi encontrado no bucket S3: ${fileKey}`);
      }
      throw error;
    }

    const fileDate = extractAndFormatDateToEmailV2(fileKey);

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: emails,
      subject: `PDF especificado - ${clientCnpj} - ${clientName} - Data ${fileDate} - Elfa`,
      text: `Segue anexo o arquivo especificado para o cliente: ${clientCnpj} - ${clientName}`,
      attachments: [
        {
          filename: fileKey.split('/').pop(),
          content: fileData.Body as Buffer,
        },
      ],
    });
  }
}
