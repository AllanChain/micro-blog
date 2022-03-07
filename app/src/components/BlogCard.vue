<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MicroBlog } from '@acbits/utils'

const props = defineProps<{ blog: MicroBlog }>()

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
    overflow-hidden
    prose="~ slate dark:invert"
    border="1 blue-500/50 rounded-md"
    bg="white/80 dark:gray-800/80"
    @click="showDetailsPopup = true"
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
          fixed w-md max-w-full h-8 flex items-center
          bg="white/95 dark:gray-800/95"
        >
          <div flex-1 />
          <button
            i-carbon-close text-2xl mr-2
            @click="showDetailsPopup= false"
          />
        </div>
        <div
          px-4 pb-4 mt-8
          prose="~ slate dark:invert"
          v-html="props.blog.bodyHTML"
        />
      </div>
    </div>
  </Teleport>
</template>
