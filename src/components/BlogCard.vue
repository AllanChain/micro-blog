<script setup lang="ts">
import type { MicroBlog } from '~/types'

const props = defineProps<{ blog: MicroBlog }>()
</script>

<template>
  <div
    w-80 max-w-full max-h-90vh p-4
    overflow-y-auto
    prose prose-slate dark:prose-invert
    border="1 blue-500/50 rounded-md"
    bg="white/80 dark:gray-800/80"
    v-html="props.blog.bodyHTML"
  />
</template>
