import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CompaniesService } from './companies.service';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { Company } from './entities/company.entity';

@Resolver()
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Mutation(() => Company)
  @UseGuards(GqlAuthGuard)
  createCompany(
    @CurrentUser() user: User,
    @Args({ name: 'createCompanyInput' })
    createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(createCompanyInput, user);
  }

  @Mutation(() => Company)
  @UseGuards(GqlAuthGuard)
  updateCompany(
    @CurrentUser() user: User,
    @Args({ name: 'updateCompanyInput' })
    updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companiesService.update(updateCompanyInput, user);
  }

  @Query(() => Company)
  @UseGuards(GqlAuthGuard)
  findCompany(@CurrentUser() user: User) {
    return this.companiesService.findOne(user);
  }
}
