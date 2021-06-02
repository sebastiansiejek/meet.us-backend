import { UserUploadProfilePicType } from './dto/user.type';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UploadUserProfilePicInput } from './dto/user.input';

@Resolver()
export class ImagesResolver {

    // @Mutation(returns => UserUploadProfilePicType)
    @Mutation()
    public async uploadProfilePic(@Args('UploadUserProfilePicInput') {file} : UploadUserProfilePicInput){
        const fileData = await file;
        console.log(fileData);
        ///Do something with the fileData

        return true;
    }
}