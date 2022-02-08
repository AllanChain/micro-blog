import { mkdir, writeFile } from 'fs/promises'
import { join as pathJoin } from 'path'
import { GraphQLClient } from 'graphql-request'
import * as yargs from 'yargs'
import { config as dotenvConfig } from 'dotenv'
import type { Discussion } from '../src/types'
import { getSdk } from './sdk'

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
                bodyHTML: node.bodyHTML,
                createdAt: node.createdAt,
                updatedAt: node.updatedAt || node.createdAt,
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
  const dist = pathJoin(__dirname, '..', argv.dist, 'data/year')
  await mkdir(dist, { recursive: true })
  for (const discussion of discussions) {
    const filePath = pathJoin(dist, `${discussion.year}.json`)
    await writeFile(filePath, JSON.stringify(discussion.blogs, null, 2))
  }
}

main()
