import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType,  MemberTypeId } from './member-types.js';
import { Context } from './common.js';
import { MemberTypeId as MemberIdType } from '../../member-types/schemas.js';

interface ISource {
  memberTypeId: MemberIdType;
}

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: MemberType,
      resolve: (source: ISource, _args, { prisma }: Context) =>
        prisma.memberType.findUnique({ where: { id: source.memberTypeId } }),
    },
  }),
});

export const ProfileCreateType = new GraphQLInputObjectType({
  name: 'ProfileCreateType',
  fields: () => ({
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt }
  }),
});