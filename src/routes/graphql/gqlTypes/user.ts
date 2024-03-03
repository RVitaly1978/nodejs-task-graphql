import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { gqlUUIDType } from './uuid.js'
import { gqlProfileType } from './profile.js'
import { gqlPostType } from './post.js'

import { userByIdDataLoader, profileByUserIdDataLoader, postsByAuthorIdLoader } from '../dataLoaders.js'
import { Context, Args, User } from '../types.js'

export const gqlUserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(gqlUUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: gqlProfileType,
      resolve: async (source: User, _: Args, context: Context) => {
        const dl = await profileByUserIdDataLoader(context)
        return (await dl.load(source.id))
      },
    },
    posts: {
      type: new GraphQLList(gqlPostType),
      resolve: async (source: User, _: Args, context: Context) => {
        const dl = await postsByAuthorIdLoader(context)
        return (await dl.load(source.id))
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(gqlUserType),
      resolve: async (source: User, _: Args, context: Context) => {
        const dl = await userByIdDataLoader(context)
        return source.userSubscribedTo
          ? (await dl.loadMany(source.userSubscribedTo.map(({ authorId }) => authorId)))
          : null
      },
    },
    subscribedToUser: {
      type: new GraphQLList(gqlUserType),
      resolve: async (source: User, _: Args, context: Context) => {
        const dl = await userByIdDataLoader(context)
        return source.subscribedToUser
          ? (await dl.loadMany(source.subscribedToUser.map(({ subscriberId }) => subscriberId)))
          : null
      },
    },
  }),
})

export const gqlCreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
})

export const gqlChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
})
