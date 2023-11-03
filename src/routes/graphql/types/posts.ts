import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

export const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const PostCreateType = new GraphQLInputObjectType({
  name: 'PostCreateType',
  fields: () => ({
    authorId: { type: UUIDType },
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  }),
});
