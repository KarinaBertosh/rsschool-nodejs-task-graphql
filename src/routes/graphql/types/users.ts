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
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (source: ISource, _args, { prisma }: Context) =>
        prisma.user.findMany({ where: { subscribedToUser: { some: { subscriberId: source.id } } } }),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (source: ISource, _args, { prisma }: Context) =>
        prisma.user.findMany({ where: { userSubscribedTo: { some: { authorId: source.id } } } }),
    }
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: UUIDType },
    balance: { type: GraphQLFloat  },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: UUIDType },
    balance: { type: GraphQLFloat  },
  }),
});
