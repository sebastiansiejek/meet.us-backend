
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateCompanyInput } from './create-company.input';

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @Field()
  id: string;
}
