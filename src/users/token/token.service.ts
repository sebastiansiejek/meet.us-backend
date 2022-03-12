import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { createDecipheriv, createCipheriv } from 'crypto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  readonly encryptionKey = process.env.ENCRYPTION_KEY;
  readonly encryptionIV = process.env.ENCRYPTION_IV;

  encrypt(userId: string) {
    const dataToEncrypt = this.prepareData(userId);
    const cipher = createCipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      this.encryptionIV,
    );
    let encrypted = '';
    try {
      encrypted = cipher.update(dataToEncrypt, 'utf8', 'base64');
      encrypted += cipher.final('base64');
    } catch (error) {
      throw new BadRequestException('Token is incorrect');
    }

    return encrypted;
  }

  decrypt(token) {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      this.encryptionIV,
    );
    let decryptedToken = '';
    try {
      const decrypted = decipher.update(token, 'base64', 'utf8');
      decryptedToken = decrypted + decipher.final('utf8');
    } catch (error) {
      throw new BadRequestException('Token is incorrect');
    }

    return JSON.parse(decryptedToken);
  }

  prepareData(userId: string) {
    const activationDate = new Date();
    activationDate.setHours(activationDate.getHours() + 24);

    return JSON.stringify({
      userId: userId,
      validityDate: activationDate,
    });
  }

  validateDate(date) {
    if (date < Date.now()) {
      return false;
    } else {
      return true;
    }
  }

  createToken(user: User) {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: '20m' },
    );
  }
}
