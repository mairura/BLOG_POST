import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRequest } from 'types/expressRequest.interface';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (request.user.id) {
      return true;
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
