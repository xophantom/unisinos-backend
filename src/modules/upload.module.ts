import { Module } from '@nestjs/common';
import { UploadController } from 'src/controllers/upload.controller';
import { EmailService } from 'src/services/email.service';
import { UploadService } from 'src/services/upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, EmailService],
})
export class UploadModule {}
