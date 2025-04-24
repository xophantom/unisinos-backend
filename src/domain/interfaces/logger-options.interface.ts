import { Format } from 'logform';
import { ILoggerLevel } from './logger-level.interface';

export interface ILoggerOptions {
  label?: string;
  level?: ILoggerLevel;
  simple?: boolean;
  timestamp?: boolean;
  prettyPrint?: boolean;
  where?: boolean;
  colorize?: boolean;
  http?: string;
  bearer?: string;
  customFormat?: Format;
}
