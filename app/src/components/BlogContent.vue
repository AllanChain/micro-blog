<script setup lang="ts">
import type { MicroBlog } from '@acbits/utils'
import { format as lightDateFormat } from 'light-date'

defineProps<{ blog: MicroBlog }>()

const formatDate = (date: string) => lightDateFormat(
  new Date(date), '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}',
)

</script>

<template>
  <div class="flex items-center">
    <img src="/avatar.jpg" width="55" class="m-2 rounded-full">
    <div>
      <div>Allan Chain</div>
      <div text="xs gray:500 dark:gray-400">
        <div flex>
          <div i-carbon-calendar mr-1 />
          <div>{{ formatDate(blog.createdAt) }}</div>
        </div>
        <div flex>
          <div i-carbon-recently-viewed mr-1 />
          <div>{{ formatDate(blog.updatedAt) }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="blog-content" block v-html="blog.bodyHTML" />
  <div flex items-center>
    <div dash-divider />
    <div>
      Comment on
    </div>
    <a
      :href="blog.url" target="_blank" rel="noreferrer noopener"
      mx-1 icon-btn i-carbon-logo-github
    />
    <div dash-divider />
  </div>
  <div
    v-for="reply in blog.replies"
    :key="reply.createdAt"
    my-1 py-1 px-2
  >
    <div flex text="gray-500 sm">
      <div font-bold mr-2>
        {{ reply.authorName }}
      </div>
      <div>{{ formatDate(reply.createdAt) }}</div>
    </div>
    <div class="blog-comment" text-sm v-html="reply.bodyHTML" />
  </div>
</template>

<style>
.blog-content p, .blog-comment p {
  margin: 0.5em 0 !important;
}
</style>
