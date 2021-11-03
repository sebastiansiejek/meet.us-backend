import {
  ConnectionArguments,
  ConnectionCursor,
  fromGlobalId,
} from 'graphql-relay';
import { Field, ArgsType } from '@nestjs/graphql';

type PagingMeta =
  | { pagingType: 'forward'; after?: string; first: number }
  | { pagingType: 'backward'; before?: string; last: number }
  | { pagingType: 'none' };

function checkPagingSanity(args: ConnectionArgs): PagingMeta {
  const { first = 0, last = 0, after, before } = args;

  const isForwardPaging = !!first || !!after;
  const isBackwardPaging = !!last || !!before;
  if (isForwardPaging && isBackwardPaging) {
    throw new Error('Relay pagination cannot be forwards AND backwards!');
  }
  if ((isForwardPaging && before) || (isBackwardPaging && after)) {
    throw new Error('Paging must use either first/after or last/before!');
  }
  if ((isForwardPaging && first < 0) || (isBackwardPaging && last < 0)) {
    throw new Error('Paging limit must be positive!');
  }
  if (last && !before) {
    throw new Error("When paging backwards, a 'before' argument is required!");
  }
  return isForwardPaging
    ? { pagingType: 'forward', after, first }
    : isBackwardPaging
    ? { pagingType: 'backward', before, last }
    : { pagingType: 'none' };
}

const getId = (cursor: ConnectionCursor) =>
  parseInt(fromGlobalId(cursor).id, 10);
const nextId = (cursor: ConnectionCursor) => getId(cursor) + 1;

function getDistanceParameters(args: ConnectionArgs) {
  let distance = args.distance;
  let latitude = args.latitude;
  let longitude = args.longitude;
  return { distance, latitude, longitude };
}


function getOrderParameters(args: ConnectionArgs) {
  let field: string;
  let sort: string;
  if (args.orderField != null || args.orderField != undefined) {
    field = args.orderField;
  } else {
    field = 'id';
  }
  if (args.orderSort === 'ASC' || args.orderSort === 'DESC') {
    sort = args.orderSort;
  } else {
    sort = 'ASC';
  }
  return { field, sort };
}

function getPagingParameters(args: ConnectionArgs) {
  const meta = checkPagingSanity(args);

  switch (meta.pagingType) {
    case 'forward': {
      return {
        limit: meta.first,
        offset: meta.after ? nextId(meta.after) : 0,
      };
    }
    case 'backward': {
      const { last, before } = meta;
      let limit = last;
      let offset = getId(before!) - last;

      if (offset < 0) {
        limit = Math.max(last + offset, 0);
        offset = 0;
      }

      return { offset, limit };
    }
    default:
      return {};
  }
}

@ArgsType()
export default class ConnectionArgs implements ConnectionArguments {
  @Field({ nullable: true, description: 'Paginate before opaque cursor' })
  public before?: ConnectionCursor;

  @Field({ nullable: true, description: 'Paginate after opaque cursor' })
  public after?: ConnectionCursor;

  @Field({ nullable: true, description: 'Paginate first' })
  public first?: number;

  @Field({ nullable: true, description: 'Paginate last' })
  public last?: number;

  @Field({ nullable: true, description: 'Orderby field' })
  public orderField?: string;

  @Field({ nullable: true, description: 'Orderby sort' })
  public orderSort?: string;

  @Field({ nullable: true, description: 'Distance' })
  public distance?: number;

  @Field({ nullable: true, description: 'User latitude' })
  public latitude?: number;

  @Field({ nullable: true, description: 'User longitude' })
  public longitude?: number;

  pagingParams() {
    return getPagingParameters(this);
  }
  orderParams() {
    return getOrderParameters(this);
  }
  distanceParams() {
    return getDistanceParameters(this);
  }
}

