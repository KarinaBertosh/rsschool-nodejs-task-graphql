import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  graphql,
} from 'graphql';
import { MemberType, MemberTypeId } from './types/member-types.js';
import { CreatePostInput, PostType } from './types/posts.js';
import { CreateUserInput, UserType } from './types/users.js';
import { CreateProfileInput, ProfileType } from './types/profiles.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId as MemberIdType} from '../member-types/schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const prisma = new PrismaClient();

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        memberTypes: {
          type: new GraphQLList(MemberType),
          resolve() {
            return prisma.memberType.findMany();
          }
        },
        posts: {
          type: new GraphQLList(PostType),
          resolve() {
            return prisma.post.findMany();
          }
        },
        users: {
          type: new GraphQLList(UserType),
          resolve() {
            return prisma.user.findMany();
          }
        },
        profiles: {
          type: new GraphQLList(ProfileType),
          resolve() {
            return prisma.profile.findMany();
          }
        },


        memberType: {
          type: MemberType,
          args: {
            id: {
              type: new GraphQLNonNull(MemberTypeId),
            },
          },
          resolve: (prevState, { id }: { id: string; }) => {
            return prisma.memberType.findUnique({ where: { id } });
          },
        },
        post: {
          type: PostType,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: (prevState, { id }: { id: string; }) => {
            return prisma.post.findUnique({ where: { id } });
          },
        },
        user: {
          type: UserType,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: (prevState, { id }: { id: string; }) => {
            return prisma.user.findUnique({
              where: { id },
            });
          },
        },
        profile: {
          type: ProfileType,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: (prevState, { id }: { id: string; }) => {
            return prisma.profile.findUnique({
              where: { id },
              include: { memberType: true },
            });
          },
        },
      }
    }),

    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: {
        createPost: {
          type: PostType,
          args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
          resolve: (
            prevState,
            { dto }: { dto: { authorId: string; title: string; content: string; }; },
            _context,
          ) => {
            return prisma.post.create({ data: dto });
          },
        },
        createUser: {
          type: UserType,
          args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
          resolve: (
            prevState,
            { dto }: { dto: { name: string; balance: number; }; },
            _context,
          ) => {
            return prisma.user.create({ data: dto });
          },
        },
        createProfile: {
          type: ProfileType,
          args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
          resolve: (
            prevState,
            { dto }: {
              dto: {
                userId: string;
                memberTypeId: MemberIdType;
                isMale: boolean;
                yearOfBirth: number;
              };
            },
            _context,
          ) => {
            return prisma.profile.create({ data: dto });
          },
        },
      },
    }),
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      
      const result = await graphql({
        schema,
        contextValue: {
          prisma,
        },
        source: query,
        variableValues: variables,
      });

      return result;
    },
  });
};

export default plugin;
