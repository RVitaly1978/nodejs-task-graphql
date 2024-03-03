import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { gqlUUIDType } from './uuid.js'
import { gqlUserType } from './user.js'

import { userByIdDataLoader } from '../dataLoaders.js'
import { Context, Args, Post } from '../types.js'

export const gqlPostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(gqlUUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: gqlUserType,
      resolve: async (source: Post, _: Args, context: Context) => {
        const dl = await userByIdDataLoader(context)
        return (await dl.load(source.authorId))
      },
    },
  }),
})

export const gqlCreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(gqlUUIDType) },
  },
})

export const gqlChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
})
