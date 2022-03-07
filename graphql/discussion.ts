import { mkdir, writeFile } from 'fs/promises'
import { join as pathJoin } from 'path'
import { GraphQLClient } from 'graphql-request'
import * as yargs from 'yargs'
import { config as dotenvConfig } from 'dotenv'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import type { Discussion } from '@acbits/utils'
import { getSdk } from './sdk'

const parse = (markdown: string): string => sanitizeHtml(
  marked.parse(markdown),
  {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  },
)

export async function getDiscussions(): Promise<Discussion[]> {
  const client = new GraphQLClient(
    'https://api.github.com/graphql',
    {
      headers: {
        authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  )
  const sdk = getSdk(client)
  const data = await sdk.microBlogs()
  return data.repository?.discussions.nodes
    ?.flatMap((node) => {
      return (node !== null && node?.title?.startsWith('Micro Blogs of Year'))
        ? {
          title: node.title,
          year: node.title.split(' ')[4],
          blogs: node.comments.nodes
            ?.filter(node => node?.author?.login === 'AllanChain')
            ?.flatMap(node => node
              ? [{
                bodyHTML: parse(node.body),
                createdAt: node.createdAt,
                updatedAt: node.updatedAt,
                reactionCount: node.reactions.totalCount + node.upvoteCount,
                replies: node.replies.nodes?.flatMap(node => node
                  ? [{
                    authorId: node.author!.login ?? '',
                    authorName: 'name' in node.author! ? node.author!.name ?? '' : '',
                    createdAt: node.createdAt,
                    updatedAt: node.updatedAt,
                    bodyHTML: parse(node.body),
                  }]
                  : [],
                ) ?? [],
              }]
              : [],
            ) ?? [],
        }
        : []
    }) ?? []
}

async function main() {
  dotenvConfig({ path: pathJoin(__dirname, '.env') })
  const argv = await yargs.options({
    dist: {
      choices: ['public', 'dist'],
      demandOption: true,
    },
  }).argv
  const discussions = await getDiscussions()
  const years: string[] = []
  const dist = pathJoin(__dirname, '../app', argv.dist, 'data/year')
  await mkdir(dist, { recursive: true })
  for (const discussion of discussions) {
    years.push(discussion.year)
    const filePath = pathJoin(dist, `${discussion.year}.json`)
    await writeFile(filePath, JSON.stringify(discussion.blogs, null, 2))
  }
  await writeFile(
    pathJoin(dist, '..', 'years.json'), JSON.stringify(years, null, 2),
  )
}

main()
