import DataLoader from 'dataloader'

import {
  Context, MemberTypeId, Post, Profile,
  MemberTypeDataLoader, UserDataLoader, PostsDataLoader, ProfilesDataLoader, ProfileDataLoader,
} from './types.js'

export const profilesByMemberTypeIdDataLoader = async (context: Context) => {
  const key = 'profilesByMemberTypeIdDataLoader'

  const { dataLoaders, prisma } = context

  let dl = dataLoaders.get(key) as unknown as ProfilesDataLoader

  if (!dl) {
    const batcher = async (ids: readonly MemberTypeId[]) => {
      const rows = await prisma.profile.findMany({
        where: { memberTypeId: { in: ids as MemberTypeId[] } },
      })
      const groupedByMemberTypeId = rows.reduce((acc, profile) => {
        acc[profile.memberTypeId]
          ? acc[profile.memberTypeId].push(profile as Profile)
          : acc[profile.memberTypeId] = [profile as Profile]
        return acc
      }, {} as Record<string, Profile[]>)
      return ids.map(id => groupedByMemberTypeId[id])
    }
    dl = new DataLoader(batcher) as unknown as ProfilesDataLoader
    dataLoaders.set(key, dl)
  }

  return dl
}

export const profileByUserIdDataLoader = async (context: Context) => {
  const key = 'profileByUserIdDataLoader'

  const { dataLoaders, prisma } = context

  let dl = dataLoaders.get(key) as unknown as ProfileDataLoader

  if (!dl) {
    const batcher = async (ids: readonly string[]) => {
      const rows = await prisma.profile.findMany({
        where: { userId: { in: ids as string[] } },
      })
      return ids.map(id => rows.find(({ userId }) => userId === id))
    }
    dl = new DataLoader(batcher) as unknown as ProfileDataLoader
    dataLoaders.set(key, dl)
  }

  return dl
}

export const userByIdDataLoader = async (context: Context) => {
  const key = 'userByIdDataLoader'

  const { dataLoaders, prisma } = context

  let dl = dataLoaders.get(key) as unknown as UserDataLoader

  if (!dl) {
    const batcher = async (ids: readonly string[]) => {
      const rows = await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
        include: {
          userSubscribedTo: true,
          subscribedToUser: true,
        },
      })
      return ids.map(id => rows.find(row => row.id === id))
    }
    dl = new DataLoader(batcher) as unknown as UserDataLoader
    dataLoaders.set(key, dl)
  }

  return dl
}

export const memberTypeByIdDataLoader = async (context: Context) => {
  const key = 'memberTypeByIdDataLoader'

  const { dataLoaders, prisma } = context

  let dl = dataLoaders.get(key) as unknown as MemberTypeDataLoader

  if (!dl) {
    const batcher = async (ids: readonly string[]) => {
      const rows = await prisma.memberType.findMany({
        where: { id: { in: ids as MemberTypeId[] }}
      })
      return ids.map(id => rows.find(row => row.id === id))
    }
    dl = new DataLoader(batcher) as unknown as MemberTypeDataLoader
    dataLoaders.set(key, dl)
  }

  return dl
}

export const postsByAuthorIdLoader = async (context: Context) => {
  const key = 'postsByAuthorIdLoader'

  const { dataLoaders, prisma } = context

  let dl = dataLoaders.get(key) as unknown as PostsDataLoader

  if (!dl) {
    const batcher = async (ids: readonly string[]) => {
      const rows = await prisma.post.findMany({
        where: { authorId: { in: ids as string[] } },
      })
      const groupedByAuthorId = rows.reduce((acc, post) => {
        acc[post.authorId]
          ? acc[post.authorId].push(post)
          : acc[post.authorId] = [post]
        return acc
      }, {} as Record<string, Post[]>)
      return ids.map(id => groupedByAuthorId[id])
    }
    dl = new DataLoader(batcher) as unknown as PostsDataLoader
    dataLoaders.set(key, dl)
  }

  return dl
}
