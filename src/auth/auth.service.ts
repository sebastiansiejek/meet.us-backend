import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

    async validate(email: string, password: string): Promise<any> {
        const user = await this.userService.findByMail(email);

        if (user === undefined) {
            throw new BadRequestException('Invalid email');
        }
        
        if(!await bcrypt.compare(password, user.password)){
            throw new BadRequestException('Invalid password');
        }

        if (user && await bcrypt.compare(password, user.password)){
            const { password, ...result } = user;
            return result;
        }

    if (user && bcrypt.compare(password, user.password)) {
      const { ...result } = user;
      return result;
    }
  }

  login(usersRepository: User): { access_token: string } {
    const payload = {
      email: usersRepository.email,
      sub: usersRepository.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

<<<<<<< HEAD
    async verify(token: string) : Promise<User> {
        
        const decoded = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET
        });
=======
  async verify(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token, {
      secret: 'supersecretkey',
    });
>>>>>>> 5b13b95970de97a8f5f6142941a431a9c80362f3

    const user = this.userService.findByMail(decoded.email);

    return user;
  }
}
