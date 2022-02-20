<script setup lang="ts">
import type { MicroBlog } from '~/types'

const props = defineProps<{ blog: MicroBlog }>()

const divElement = ref<HTMLDivElement>()

const showReadMore = computed(() => {
  if (!divElement.value)
    return false
  return divElement.value.clientHeight < divElement.value.scrollHeight
})
</script>

<template>
  <div
    ref="divElement"
    relative
    w-80 max-w-full max-h-70vh p-4
    overflow-hidden
    prose="~ slate dark:invert"
    border="1 blue-500/50 rounded-md"
    bg="white/80 dark:gray-800/80"
  >
    <div v-html="props.blog.bodyHTML" />
    <div
      v-if="showReadMore"
      absolute bottom-0 left-0
      pb-2 pt-8 w-full text-center
      bg-gradient="to-b from-green-50/0 via-blue-50/80 to-blue-50/100"
      dark:bg-gradient="from-gray-800/0 via-blue-gray-900/80 to-warm-gray-900/100"
      text="bluegray-500 dark:gray-400"
    >
      Click to Read More
    </div>
  </div>
</template>
