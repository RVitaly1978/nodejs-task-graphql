import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'

import { gqlUUIDType } from '../gqlTypes/uuid.js'
import { gqlUserType, gqlCreateUserInputType, gqlChangeUserInputType } from '../gqlTypes/user.js'
import { gqlPostType, gqlCreatePostInputType, gqlChangePostInputType } from '../gqlTypes/post.js'
import { gqlProfileType, gqlCreateProfileInputType, gqlChangeProfileInputType } from '../gqlTypes/profile.js'

import { createUser, changeUser, deleteUser, subscribeTo, unsubscribeFrom } from '../resolvers/user.js'
import { createPost, changePost, deletePost } from '../resolvers/post.js'
import { createProfile, changeProfile, deleteProfile } from '../resolvers/profile.js'

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: gqlUserType,
      args: {
        dto: { type: gqlCreateUserInputType }
      },
      resolve: createUser,
    },
    changeUser: {
      type: gqlUserType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
        dto: { type: gqlChangeUserInputType }
      },
      resolve: changeUser,
    },
    deleteUser: {
      type: gqlUUIDType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: deleteUser,
    },
    createPost: {
      type: gqlPostType,
      args: {
        dto: { type: gqlCreatePostInputType }
      },
      resolve: createPost,
    },
    changePost: {
      type: gqlPostType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
        dto: { type: gqlChangePostInputType }
      },
      resolve: changePost,
    },
    deletePost: {
      type: gqlUUIDType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: deletePost,
    },
    createProfile: {
      type: gqlProfileType,
      args: {
        dto: { type: gqlCreateProfileInputType }
      },
      resolve: createProfile,
    },
    changeProfile: {
      type: gqlProfileType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
        dto: { type: gqlChangeProfileInputType }
      },
      resolve: changeProfile,
    },
    deleteProfile: {
      type: gqlUUIDType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: deleteProfile,
    },
    subscribeTo: {
      type: gqlUserType,
      args: {
        userId: { type: new GraphQLNonNull(gqlUUIDType) },
        authorId: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: subscribeTo,
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(gqlUUIDType) },
        authorId: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: unsubscribeFrom,
    },
  },
})
