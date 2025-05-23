import { Injectable } from '@nestjs/common';
import { Logtail } from '@logtail/node';

@Injectable()
export class LogtailService {
  private readonly logtail: Logtail;

  constructor() {
this.logtail = new Logtail(process.env.LOGTAIL_TOKEN ?? " ", {
  endpoint: process.env.LOGTAIL_ENDPIONT ?? " ",
});

  }

  info(message: string, context: any = {}) {
    return this.logtail.info(message, context);
  }

  error(message: string, context: any = {}) {
    return this.logtail.error(message, context);
  }

  warn(message: string, context: any = {}) {
    return this.logtail.warn(message, context);
  }
}
