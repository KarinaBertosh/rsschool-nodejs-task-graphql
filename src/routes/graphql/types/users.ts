import { GraphQLObjectType, GraphQLFloat, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profiles.js';
import { PostType } from './posts.js';
import { Context } from './common.js';


interface ISource {
  id: string;
}

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: (source: ISource, _args, { prisma }: Context) =>
        prisma.profile.findUnique({ where: { userId: source.id } }),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (source: ISource, _args, { prisma }: Context) =>
        prisma.post.findMany({ where: { authorId: source.id } }),
    },
  }),
});

export const UserCreateType = new GraphQLInputObjectType({
  name: 'UserCreateType',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat  },
  }),
});
