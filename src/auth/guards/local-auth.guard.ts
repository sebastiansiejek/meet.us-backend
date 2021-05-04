import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {
    getRequest(context: ExecutionContext): Request {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      req.body = ctx.getArgs().loginUserInput;    
      return req;
    }
}
