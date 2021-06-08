import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

@Injectable()
export class QueryResolver implements I18nResolver {
  resolve(context: ExecutionContext) {
    let req: any;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    return req.headers['accept-language'] || 'en';
  }
}
