<script setup lang="ts">
import type { MicroBlog } from '~/types'

const props = defineProps<{ blog: MicroBlog; distance: number }>()
</script>

<template>
  <div
    w-80 mx-4 p-4
    bg-white bg-opacity-80 preserve-3d absolute
    overflow-y-auto
    class="top-1/2 odd:left-0 even:right-0"
    border="1 blue-500/50 rounded-md"
    :style="{
      'max-width': 'calc(100% - 2rem)',
      'max-height': 'calc(100% - 2rem)',
      transform: `translateY(-50%) translateZ(${-props.distance}px)`,
    }"
    v-html="props.blog.bodyHTML"
  />
</template>
