import { mkdir, writeFile } from 'fs/promises'
import { join as pathJoin } from 'path'
import { GraphQLClient } from 'graphql-request'
import * as yargs from 'yargs'
import { config as dotenvConfig } from 'dotenv'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import type { Discussion } from '@acbits/utils'
import GitHubSlugger from 'github-slugger'
import { getSdk } from './sdk'

const parse = (markdown: string): string => sanitizeHtml(
  marked.parse(markdown),
  {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'details', 'summary',
    ]),
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
  const slugger = new GitHubSlugger()
  const data = await sdk.microBlogs()
  return data.repository?.discussions.nodes
    ?.flatMap((node) => {
      return node !== null
        ? {
            title: node.title,
            createdAt: node.createdAt,
            updatedAt: node.updatedAt,
            slug: slugger.slug(node.title),
            blogs: node.comments.nodes
              ?.filter(node => node?.author?.login === 'AllanChain')
              ?.flatMap(node => node
                ? [{
                    url: node.url,
                    bodyHTML: parse(node.body),
                    createdAt: node.createdAt,
                    updatedAt: node.updatedAt,
                    reactionCount: node.reactions.totalCount + node.upvoteCount,
                    hasMyReaction: node.reactions.nodes?.some(
                      node => node?.user?.login === 'AllanChain',
                    ) || false,
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
    })
    ?.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    ?? []
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
  const seasons: string[] = []
  const dist = pathJoin(__dirname, '../app', argv.dist, 'data')
  await mkdir(dist, { recursive: true })
  for (const discussion of discussions) {
    seasons.push(discussion.slug)
    const filePath = pathJoin(dist, `${discussion.slug}.json`)
    await writeFile(filePath, JSON.stringify(discussion.blogs, null, 2))
  }
  await writeFile(
    pathJoin(dist, 'index.json'), JSON.stringify(seasons, null, 2),
  )
}

main()
