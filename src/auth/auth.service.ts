import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validate(email: string, password: string): Promise<any> {
        
        const user = await this.userService.findByMail(email);

        if (user && bcrypt.compare(password, user.password)){
            const { password, ...result } = user;
            return result;
        }

    }

    login(usersRepository: User): { access_token: string } {
        const payload = {
            email: usersRepository.email,
            sub: usersRepository.id
        }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async verify(token: string) : Promise<User> {
        
        const decoded = this.jwtService.verify(token, {
            secret: "supersecretkey"
        });

        const user = this.userService.findByMail(decoded.email);

        return user;
    }
} 
