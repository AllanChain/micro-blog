export interface MicroBlog {
  bodyHTML: string
  createdAt: string
  updatedAt: string
}

export interface Discussion {
  title: string
  year: string
  blogs: MicroBlog[]
}

export type BlogEntries = MicroBlog[]
