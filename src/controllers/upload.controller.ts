import { Controller, Post, UseInterceptors, Param, Get, Body, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmailService } from 'src/services/email.service';
import { UploadService } from 'src/services/upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly emailService: EmailService,
  ) {}

  @Post('pdf/:clientId/:inventoryUpdateId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'consolidated', maxCount: 1 },
      { name: 'conciliation', maxCount: 1 },
    ]),
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      consolidated?: Express.Multer.File[];
      conciliation?: Express.Multer.File[];
    },
    @Param('clientId') clientId: string,
    @Param('inventoryUpdateId') inventoryUpdateId: number,
  ) {
    if (
      (!files.consolidated || files.consolidated.length === 0) &&
      (!files.conciliation || files.conciliation.length === 0)
    ) {
      throw new Error('É necessário enviar pelo menos um arquivo.');
    }

    const results = [];

    if (files.consolidated && files.consolidated.length > 0) {
      const consolidatedFile = files.consolidated[0];
      const result = await this.uploadService.uploadFile(consolidatedFile, clientId, inventoryUpdateId, 'consolidated');
      results.push(result);
    }

    if (files.conciliation && files.conciliation.length > 0) {
      const conciliationFile = files.conciliation[0];
      const result = await this.uploadService.uploadFile(conciliationFile, clientId, inventoryUpdateId, 'conciliation');
      results.push(result);
    }

    return results;
  }

  @Get('pdf/:clientId')
  async listFiles(@Param('clientId') clientId: string) {
    return this.uploadService.listFiles(clientId);
  }

  @Post('email/send-latest')
  async sendLatestFile(@Body() body: { clientId: string; clientCnpj: string; clientName: string; emails: string[] }) {
    const { clientId, clientCnpj, clientName, emails } = body;

    await this.emailService.sendLatestFile(clientId, clientCnpj, clientName, emails);

    return {
      message: `Arquivo mais recente enviado com sucesso para os e-mails: ${emails.join(', ')}`,
    };
  }

  @Post('email/send-pdf')
  async sendPdfFile(
    @Body() body: { clientId: string; clientCnpj: string; clientName: string; url: string; emails: string[] },
  ) {
    const { clientId, clientCnpj, clientName, url, emails } = body;

    await this.emailService.sendPdfFile(clientId, clientCnpj, clientName, url, emails);

    return {
      message: `Arquivo especificado enviado com sucesso para os e-mails: ${emails.join(', ')}`,
    };
  }
}
