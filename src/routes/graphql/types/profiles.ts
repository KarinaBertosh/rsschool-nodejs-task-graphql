import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './member-types.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context } from './common.js';

interface ISource {
  memberTypeId: MemberTypeId;
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