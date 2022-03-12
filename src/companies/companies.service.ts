import { UpdateCompanyInput } from './dto/update-company.input';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateCompanyInput } from './dto/create-company.input';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UsersService,
  ) {}

  async create(createCompanyInput: CreateCompanyInput, user: User) {
    const newCompany = new Company();
    newCompany.user = user;
    newCompany.name = createCompanyInput.name;
    newCompany.address = createCompanyInput.address;
    newCompany.zipCode = createCompanyInput.zipCode;
    newCompany.city = createCompanyInput.city;
    newCompany.nip = createCompanyInput.nip;

    return await this.companyRepository.save({ ...newCompany });
  }

  async findOne(user: User) {
    const company = await this.companyRepository.findOne({
      where: { user: user.id },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }
    return company;
  }

  async update(updateCompanyInput: UpdateCompanyInput, user: User) {
    const company = await this.findOne(user);

    return this.companyRepository.save({ ...company, ...updateCompanyInput });
  }
}
