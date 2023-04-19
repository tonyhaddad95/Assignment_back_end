import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
import * as dotenv from 'dotenv';
dotenv.config()

interface CustomHeaders extends Headers {
    authorization?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector, private readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        const jwtSecret = process.env.JWT_SECRET;
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtSecret,
            });
            request['user'] = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const { authorization } = request.headers as CustomHeaders;
        const [type, token] = authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
