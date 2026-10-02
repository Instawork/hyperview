import { HvBaseError } from './hv-base-error';

export class HvParserError extends HvBaseError {
  name = 'HvParserError';

  content: string;

  contentType?: string | null;

  error: string;

  headers: Headers;

  status: number;

  url?: string;

  constructor(
    message: string,
    headers: Headers,
    content: string,
    error: string,
    status: number,
    contentType?: string | null,
    url?: string,
  ) {
    super(message);
    this.headers = headers;
    this.content = content;
    this.error = error;
    this.status = status;
    this.contentType = contentType;
    this.url = url;
    if (this.constructor === HvParserError) {
      throw new Error('Do not instantiate `HvParserError` directly');
    }
  }
}
