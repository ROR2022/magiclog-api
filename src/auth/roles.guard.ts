import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    // eslint-disable-next-line prettier/prettier
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    //console.log('RolesGuard roles: ', roles);
    if (!roles) {
      //throw new Error('RolesGuard roles not found');
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.roles);
  }

  matchRoles(roles: string[], userRoles: string[]): boolean {
    //console.log('RolesGuard userRoles: ', userRoles);
    return userRoles.some((role) => roles.includes(role));
  }
}