import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, Length, Matches, Max, Min } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({
    nullable: true,
  })
  id: string;
  @Field({
    nullable: true,
  })
  @IsEmail()
  @Length(4, 50)
  email: string;
  @Field({
    nullable: true,
  })
  firstName: string;
  @Field({
    nullable: true,
  })
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password should contains a capital letter and a number',
  })
  password: string;
  @Field({
    nullable: true,
  })
  lastname: string;
  @Field({
    nullable: true,
  })
  nickname: string;
  @Field({
    nullable: true,
  })
  @Min(0)
  @Max(1)
  sex: number;
  @Field({
    nullable: true,
  })
  description: string;
}
