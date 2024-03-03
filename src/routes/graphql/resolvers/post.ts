import { Context, ID, Args, PostInput } from '../types.js'

export const postResolver = async (
  root: any,
  { id }: ID,
  { prisma }: Context
) => (await prisma.post.findUnique({ where: { id } }))

export const postsResolver = async (
  root: any,
  _: Args,
  { prisma }: Context
) => (await prisma.post.findMany())

export const createPost = async (
  root: any,
  { dto: data }: { dto: PostInput },
  { prisma }: Context
) => (await prisma.post.create({ data }))

export const changePost = async (
  root: any,
  { id, dto: data }: ID & { dto: Partial<PostInput> },
  { prisma }: Context
) => {
  try {
    return (await prisma.post.update({ where: { id }, data }))
  } catch {
    return null
  }
}

export const deletePost = async (
  root: any,
  { id }: ID,
  { prisma }: Context
) => {
  try {
    await prisma.post.delete({ where: { id } })
    return id
  } catch {
    return null
  }
}
