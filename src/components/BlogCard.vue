<script setup lang="ts">
import type { MicroBlog } from '~/types'

const props = defineProps<{ blog: MicroBlog; distance: number }>()
</script>

<template>
  <div
    w-80 m-4 p-4
    bg-white bg-opacity-80 preserve-3d
    class="absolute top-1/3 odd:left-0 even:right-0"
    border="1 blue-500/50 rounded-md"
    :style="{
      transform: `translateZ(${-props.distance}px)`,
    }"
    v-html="props.blog.bodyHTML"
  />
</template>
