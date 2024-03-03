import { Context, ID, Args } from '../types.js'

export const memberTypeResolver = async (
  root: any,
  { id }: ID,
  { prisma }: Context
) => (await prisma.memberType.findUnique({ where: { id } }))

export const memberTypesResolver = async (
  root: any,
  args: Args,
  { prisma }: Context
) => (await prisma.memberType.findMany())
