import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from 'src/types/token-payload';
import { AdminTokenPayload } from 'src/types/token-payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonUserJwtStrategy extends PassportStrategy(Strategy, 'common-user-jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secretJwt'),
    });
  }

  async validate(payload: TokenPayload) {
    return {
      user_id: payload.user_id,
      email: payload.user_email,
    };
  }
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secretJwt'),
    });
  }

  async validate(payload: AdminTokenPayload) {
    return {
      id_admin: payload.id_admin,
      role: payload.role,
    };
  }
}

@Injectable()
export class CombinedJwtStrategy extends PassportStrategy(Strategy, 'combined-jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secretJwt'),
    });
  }

  async validate(payload: TokenPayload | AdminTokenPayload) {
    if ('user_id' in payload) {
      return {
        user_id: payload.user_id,
        email: payload.user_email,
        userType: 'common',
      };
    } else if ('id_admin' in payload) {
      return {
        id_admin: payload.id_admin,
        role: payload.role,
        userType: 'admin',
      };
    } else {
      throw new UnauthorizedException('Invalid user type');
    }
  }
}