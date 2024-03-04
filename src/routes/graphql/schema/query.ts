import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql'

import { gqlUUIDType } from '../gqlTypes/uuid.js'
import { gqlUserType } from '../gqlTypes/user.js'
import { gqlMemberType, gqlMemberTypeIdEnum } from '../gqlTypes/memberType.js'
import { gqlPostType } from '../gqlTypes/post.js'
import { gqlProfileType } from '../gqlTypes/profile.js'

import { userResolver, usersResolver } from '../resolvers/user.js'
import { memberTypeResolver, memberTypesResolver } from '../resolvers/memberType.js'
import { postResolver, postsResolver } from '../resolvers/post.js'
import { profileResolver, profilesResolver } from '../resolvers/profile.js'

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: gqlUserType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: userResolver,
    },
    users: {
      type: new GraphQLList(gqlUserType),
      resolve: usersResolver,
    },
    memberType: {
      type: gqlMemberType,
      args: {
        id: { type: new GraphQLNonNull(gqlMemberTypeIdEnum) },
      },
      resolve: memberTypeResolver,
    },
    memberTypes: {
      type: new GraphQLList(gqlMemberType),
      resolve: memberTypesResolver,
    },
    post: {
      type: gqlPostType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: postResolver,
    },
    posts: {
      type: new GraphQLList(gqlPostType),
      resolve: postsResolver,
    },
    profile: {
      type: gqlProfileType,
      args: {
        id: { type: new GraphQLNonNull(gqlUUIDType) },
      },
      resolve: profileResolver,
    },
    profiles: {
      type: new GraphQLList(gqlProfileType),
      resolve: profilesResolver,
    },
  },
})
