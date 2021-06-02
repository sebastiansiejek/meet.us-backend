
import { InputType, Field } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import { Upload } from "./Upload.scalar";

@InputType()
export class UploadUserProfilePicInput {
    @Field()
    @Exclude()
    file : Upload
}