<script setup lang="ts">
import type { BlogEntries } from '~/types'

const props = defineProps<{
  blogs: BlogEntries
  scrollY: number
}>()

// const holder = ref<HTMLDivElement>()

const itemZGap = ref(500)
const itemYGap = ref(100)

</script>

<template>
  <div
    ref="holder"
    absolute preserve-3d
    :style="{
      height: `${itemYGap * (blogs.length-1)}px`,
      transform: `translateZ(${scrollY}px)`,
    }"
  >
    <BlogCard
      v-for="(blog, i) in blogs"
      :key="blog.datetime"
      :blog="blog"
      :distance="(blogs.length - i) * itemZGap"
    />
  </div>
</template>
