import { Context, ID, Args, ProfileInput } from '../types.js'

export const profileResolver = async (
  root: any,
  { id }: ID,
  { prisma }: Context,
) => (await prisma.profile.findUnique({ where: { id } }))

export const profilesResolver = async (
  root: any,
  _: Args,
  { prisma }: Context,
) => (await prisma.profile.findMany())

export const createProfile = async (
  root: any,
  { dto }: { dto: ProfileInput },
  { prisma }: Context,
) => {
  try {
    return (await prisma.profile.create({ data: dto }))
  } catch {
    return null
  }
}

export const changeProfile = async (
  root: any,
  { id, dto }: ID & { dto: Partial<ProfileInput> },
  { prisma }: Context,
) => {
  try {
    return (await prisma.profile.update({ where: { id }, data: dto }))
  } catch {
    return null
  }
}

export const deleteProfile = async (
  root: any,
  { id }: ID,
  { prisma }: Context,
) => {
  try {
    await prisma.profile.delete({ where: { id } })
    return id
  } catch {
    return null
  }
}
