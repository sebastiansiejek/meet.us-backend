import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]),  UsersModule],
  providers: [CompaniesService, CompaniesResolver]
})
export class CompaniesModule {}
