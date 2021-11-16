import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-event.input';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
    constructor(
      @InjectRepository(Company)
      private readonly companyRepository: Repository<Company>,
      private readonly userService: UsersService,
    ) {}

    
    async create(createCompanyInput: CreateCompanyInput, user: User) {
        const company = await this.companyRepository.save({
          ...createCompanyInput,
        });

        this.userService.updateCompany(company, user);

        return company;
    }
    
    async findOne(user: User){
        const userData = await this.userService.findOneWithCompany(user);

        if(userData.company == null){
            throw new BadRequestException('Company not found');
        }
        const company = await this.companyRepository.findOne(userData.company.id);
        
        return company;
    }

    async update(updateCompanyInput: UpdateCompanyInput, user: User) {

        const company = await this.findOne(user);

        return this.companyRepository.save({ ...company, ...updateCompanyInput });
    }
}
