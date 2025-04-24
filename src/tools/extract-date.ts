import { BadRequestException } from '@nestjs/common';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function extractAndFormatDate(fileName: string, timeZone: string = 'America/Sao_Paulo'): string {
  const datePart = fileName.split('/').pop()?.split('##')[0];

  if (!datePart) {
    throw new BadRequestException(`Data não encontrada no arquivo: ${fileName}`);
  }

  const formattedDate = datePart.replace('_', 'T').replace(/-/g, ':');
  const parsedDate = new Date(formattedDate);

  if (isNaN(parsedDate.getTime())) {
    throw new BadRequestException(`Data inválida encontrada no arquivo: ${fileName}`);
  }

  return format(toZonedTime(parsedDate, timeZone), 'yyyy-MM-dd HH:mm:ss');
}

export function extractAndFormatDateToEmail(fileName: string, timeZone: string = 'America/Sao_Paulo'): string {
  const datePart = fileName.split('##')[0];

  if (!datePart) {
    throw new BadRequestException(`Data não encontrada no arquivo: ${fileName}`);
  }

  const formattedDate = datePart.replace('_', 'T').replace(/-/g, ':');
  const parsedDate = new Date(formattedDate);

  if (isNaN(parsedDate.getTime())) {
    throw new BadRequestException(`Data inválida encontrada no arquivo: ${fileName}`);
  }

  return format(toZonedTime(parsedDate, timeZone), 'dd-MM-yyyy HH:mm');
}

export function extractAndFormatDateToEmailV2(fileKey: string, timeZone: string = 'America/Sao_Paulo'): string {
  const parts = fileKey.split('/');
  const fileName = parts[parts.length - 1];

  const datePart = fileName.split('.')[0];

  if (!datePart) {
    throw new BadRequestException(`Data não encontrada no arquivo: ${fileKey}`);
  }

  const formattedDate = datePart.replace('_', 'T').replace(/-/g, ':');
  console.log('formattedDate', formattedDate);
  const isoDateString = formattedDate.substring(0, 10).replace(/:/g, '-') + formattedDate.substring(10);
  console.log('isoDateString', isoDateString);
  const parsedDate = new Date(isoDateString);
  console.log('parsedDate', parsedDate);

  if (isNaN(parsedDate.getTime())) {
    throw new BadRequestException(`Data inválida encontrada no arquivo: ${fileKey}`);
  }

  const zonedDate = toZonedTime(parsedDate, timeZone);
  return format(zonedDate, 'dd-MM-yyyy HH:mm');
}
