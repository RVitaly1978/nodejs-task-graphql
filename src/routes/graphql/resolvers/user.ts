import { GraphQLResolveInfo } from 'graphql'
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info'

import { Context, ID, Args, SubscriptionMutationInput, UserInput } from '../types.js'
import { userByIdDataLoader } from '../dataLoaders.js'

export const userResolver = async (
  root: any,
  { id }: ID,
  context: Context,
) => {
  const dl = await userByIdDataLoader(context)
  return (await dl.load(id))
}

export const usersResolver = async (
  root: any,
  _: Args,
  context: Context,
  info: GraphQLResolveInfo
) => {
  const parsedResolveInfoFragment = parseResolveInfo(info)

  const { fields }: { fields: { [key in string]: ResolveTree } } = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment as ResolveTree,
    info.returnType
  )

  const users = await context.prisma.user.findMany({
    include: {
      userSubscribedTo: !!fields.userSubscribedTo,
      subscribedToUser: !!fields.subscribedToUser,
    },
  })

  const dl = await userByIdDataLoader(context)

  users.forEach(user => {
    dl.prime(user.id, user)
  })

  return users
}

export const createUser = async (
  root: any,
  { dto: data }: { dto: UserInput },
  { prisma }: Context
) => (await prisma.user.create({ data }))

export const changeUser = async (
  root: any,
  { id, dto: data }: ID & { dto: Partial<UserInput> },
  { prisma }: Context
) => {
  try {
    return (await prisma.user.update({ where: { id }, data }))
  } catch {
    return null
  }
}

export const deleteUser = async (
  root: any,
  { id }: ID,
  { prisma }: Context
) => {
  try {
    await prisma.user.delete({ where: { id } })
    return id
  } catch {
    return null
  }
}

export const subscribeTo = async (
  root: any,
  { userId: id, authorId }: SubscriptionMutationInput,
  { prisma }: Context
) => {
  try {
    return (await prisma.user.update({
      where: { id },
      data: { userSubscribedTo: { create: { authorId } } },
    }))
  } catch {
    return null
  }
}

export const unsubscribeFrom = async (
  root: any,
  { userId: subscriberId, authorId }: SubscriptionMutationInput,
  { prisma }: Context
) => {
  try {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId, authorId } },
    })
  } catch {
    return null
  }
}
