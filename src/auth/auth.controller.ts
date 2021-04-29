import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req): { access_token: string } {
        const user = new User();
        user.email = req.body.email;
        user.email = req.body.passwordd;

        return this.authService.login(user as User);
    }
}