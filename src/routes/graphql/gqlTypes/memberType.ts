import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { gqlProfileType } from './profile.js'

import { profilesByMemberTypeIdDataLoader } from '../dataLoaders.js'
import { Context, Args, MemberType, MemberTypeId } from '../types.js'

export const gqlMemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
  },
})

export const gqlMemberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: gqlMemberTypeIdEnum },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(gqlProfileType),
      resolve: async (source: MemberType, _: Args, context: Context) => {
        const dl = await profilesByMemberTypeIdDataLoader(context)
        return (await dl.load(source.id))
      },
    },
  }),
})
