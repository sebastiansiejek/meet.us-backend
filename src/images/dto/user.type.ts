import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType('UserUploadProfilePicType')
export class UserUploadProfilePicType {
    @Field()
    success : boolean;
}