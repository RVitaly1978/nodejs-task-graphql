import { PrismaClient } from '@prisma/client'
import DataLoader from 'dataloader'

export type Args = Record<string | number | symbol, never>

export type ID = {
  id: string
}

// memberType
export enum MemberTypeId {
  BASIC = 'basic',
  BUSINESS = 'business',
}

export type MemberType = {
  id: MemberTypeId
  discount: number
  postsLimitPerMonth: number
}

// subscription
export type Subscription = {
  subscriberId: string
  authorId: string
}

export type SubscriptionInput = {
  userId: string
  authorId: string
}

// user
export type UserInput = {
  name: string
  balance: number
}

export type User = ID & UserInput & {
  userSubscribedTo?: Subscription[]
  subscribedToUser?: Subscription[]
}

// post
export type PostInput = {
  title: string
  content: string
  authorId: string
}

export type Post = ID & PostInput

// profile
export type ProfileInput = {
  isMale: boolean
  yearOfBirth: number
  memberTypeId: MemberTypeId
  userId: string
}

export type Profile = ID & ProfileInput

// dataLoader
export type MemberTypeDataLoader = DataLoader<MemberTypeId, MemberType>
export type UserDataLoader = DataLoader<string, User>
export type ProfileDataLoader = DataLoader<string, Profile>
export type ProfilesDataLoader = DataLoader<string, Profile[]>
export type PostsDataLoader = DataLoader<string, Post[]>

export type DataLoaders =
  MemberTypeDataLoader |
  UserDataLoader |
  ProfileDataLoader |
  ProfilesDataLoader |
  PostsDataLoader

// context
export type Context = {
  prisma: PrismaClient
  dataLoaders: Map<string, DataLoaders>
}
