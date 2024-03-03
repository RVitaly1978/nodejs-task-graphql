import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { graphql, validate, parse } from 'graphql'
import depthLimit from 'graphql-depth-limit'

import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js'
import { gqlSchema } from './schema/schema.js'
import { DataLoaders } from './types.js'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify

  const dataLoaders = new Map<string, DataLoaders>()

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: { 200: gqlResponseSchema },
    },
    async handler(req) {
      const { query, variables } = req.body

      const validation = validate(gqlSchema, parse(query), [depthLimit(5)])

      if (validation?.length) {
        return { data: null, errors: validation }
      }

      const response = await graphql({
        schema: gqlSchema,
        source: query,
        contextValue: { prisma, dataLoaders },
        variableValues: variables,
      })

      return response
    },
  })
}

export default plugin
