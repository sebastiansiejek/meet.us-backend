import { Args, Query, Resolver } from '@nestjs/graphql';
import { eventType, Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

@Resolver()
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [Tag], { name: 'tags' })
  async tags(
    @Args('type', { nullable: true }) type: eventType,
  ): Promise<Tag[]> {
    return await this.tagsService.getTypes(type);
  }
}
