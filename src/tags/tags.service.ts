import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { eventType, Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRespository: Repository<Tag>,
  ) {}

  async getTypes(type: eventType) {
    return await this.tagsRespository.find({ where: { type: type } });
  }
}
