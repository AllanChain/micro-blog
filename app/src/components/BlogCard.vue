<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MicroBlog } from '@acbits/utils'
import BlogContent from './BlogContent.vue'

defineProps<{ blog: MicroBlog }>()

const divElement = ref<HTMLDivElement>()
const showReadMore = ref(false)
const showDetailsPopup = ref(false)

watch(divElement, () => {
  if (divElement.value) {
    new ResizeObserver(() => {
      if (divElement.value)
        showReadMore.value = divElement.value.clientHeight < divElement.value.scrollHeight
    }).observe(divElement.value)
  }
})

watch(showDetailsPopup, (show) => {
  if (show)
    document.body.style.overflow = 'hidden'
  else
    document.body.style.overflow = 'auto'
})
</script>

<template>
  <div
    ref="divElement"
    relative
    w-80 max-w-full max-h-70vh p-4
    overflow-hidden select-none
    prose="~ slate dark:invert"
    border="1 blue-500/50 rounded-md"
    bg="white/90 dark:gray-800/90"
    @click="showDetailsPopup = true"
  >
    <BlogContent :blog="blog" />
    <div
      v-if="blog.reactionCount > 1"
      class="top-4 -right-8"
      absolute w-30 text-center
      transform rotate-45
      border-3
      :class="blog.hasMyReaction
        ? 'bg-green-500 dark:bg-green-700 border-green-600 dark:border-green-800'
        : 'bg-blue-500 dark:bg-blue-700 border-blue-600 dark:border-blue-800'"
    >
      +{{ blog.reactionCount - 1 }}
    </div>
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
  <Teleport to="body">
    <div
      v-if="showDetailsPopup"
      fixed top-0 left-0 h-full w-full
      bg="dark-100/40"
      @click.self="showDetailsPopup = false"
    >
      <div
        mx-auto
        w-md max-w-full h-full overflow-y-auto
        bg="white dark:gray-800"
      >
        <div
          px-4 pb-4 mt-8
          prose="~ slate dark:invert"
        >
          <BlogContent :blog="blog" />
        </div>
        <div
          fixed top-0 w-md max-w-full h-8 flex items-center
          bg="white/95 dark:gray-800/95"
        >
          <div flex-1 />
          <button
            i-carbon-close mr-2
            text="2xl gray-800 dark:gray-400"
            @click="showDetailsPopup= false"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
