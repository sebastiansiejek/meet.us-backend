import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { createWriteStream } from 'node:fs';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver()
export class ImagesResolver {


    @Mutation(() => Image)
    uploadFile(@Args({name: 'file', type: () => GraphQLUpload})
    {
        createReadStream,
        filename
    }): Promise<boolean> {
        return new Promise(async (resolve, reject) => 
            createReadStream()
                .pipe(createWriteStream(`./uploads/${filename}`))
                .on('finish', () => resolve(true))
                .on('error', () => reject(false))
        );
    }
    
    @Mutation(() => Image)
    uploadAvatarImage( ) {
      return 'test';
    }

    @Mutation(() => Image)
    deleteCoverImage( ) {
      return 'test';
    }

    @Mutation(() => Image)
    deleteAvatarImage( ) {
      return 'test';
    }

}
