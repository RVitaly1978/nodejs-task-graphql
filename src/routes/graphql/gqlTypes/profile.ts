import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { gqlUUIDType } from './uuid.js'
import { gqlMemberType, gqlMemberTypeIdEnum } from './memberType.js'
import { gqlUserType } from './user.js'

import { userByIdDataLoader, memberTypeByIdDataLoader } from '../dataLoaders.js'
import { Context, Args, Profile } from '../types.js'

export const gqlProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(gqlUUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: gqlMemberType,
      resolve: async (source: Profile, _: Args, context: Context) => {
        const dl = await memberTypeByIdDataLoader(context)
        return (await dl.load(source.memberTypeId))
      },
    },
    user: {
      type: gqlUserType,
      resolve: async (source: Profile, _: Args, context: Context) => {
        const dl = await userByIdDataLoader(context)
        return (await dl.load(source.userId))
      },
    },
  }),
})

export const gqlCreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(gqlUUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(gqlMemberTypeIdEnum) },
  },
})

export const gqlChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: gqlMemberTypeIdEnum },
  },
})
