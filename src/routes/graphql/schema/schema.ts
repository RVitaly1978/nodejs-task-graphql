import { GraphQLSchema } from 'graphql'

import { query } from './query.js'
import { mutation } from './mutation.js'

export const gqlSchema = new GraphQLSchema({
  query,
  mutation,
})
