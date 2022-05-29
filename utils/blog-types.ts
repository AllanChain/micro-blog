export interface MicroBlog {
  url: string
  bodyHTML: string
  createdAt: string
  updatedAt: string
  reactionCount: number
  hasMyReaction: boolean
  replies: BlogReply[]
}

export interface BlogReply {
  authorId: string
  authorName: string
  bodyHTML: string
  createdAt: string
  updatedAt: string
}

export interface Discussion {
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  blogs: MicroBlog[]
}

export type BlogEntries = MicroBlog[]
