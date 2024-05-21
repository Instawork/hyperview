/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Logger } from 'hyperview/src/types';

class LoggerProvider {
  logger: Logger = console;
}

const instance: LoggerProvider = new LoggerProvider();

export function initialize(logger: Logger | undefined): void {
  if (logger) {
    instance.logger = logger;
  }
}

export function log(message?: any, ...optionalParams: any[]): void {
  instance.logger.log(message, optionalParams);
}

export function info(message?: any, ...optionalParams: any[]): void {
  instance.logger.info(message, optionalParams);
}

export function warn(message?: any, ...optionalParams: any[]): void {
  instance.logger.warn(message, optionalParams);
}

export function error(message?: any, ...optionalParams: any[]): void {
  instance.logger.error(message, optionalParams);
}
