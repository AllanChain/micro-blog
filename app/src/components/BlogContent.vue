<script setup lang="ts">
import type { MicroBlog } from '@acbits/utils'
import { format as formatDate } from 'light-date'
import { computed } from 'vue'

const props = defineProps<{ blog: MicroBlog }>()

const dateFormat = '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}'

const createdAtDate = computed(() => formatDate(
  new Date(props.blog.createdAt), dateFormat,
))
const updatedAtDate = computed(() => formatDate(
  new Date(props.blog.updatedAt), dateFormat,
))

</script>

<template>
  <div class="flex items-center">
    <img src="/avatar.jpg" width="55" class="m-2 rounded-full">
    <div>
      <div>Allan Chain</div>
      <div text="xs gray:500 dark:gray-400">
        <div flex>
          <div i-carbon-calendar mr-1 />
          <div>{{ createdAtDate }}</div>
        </div>
        <div flex>
          <div i-carbon-recently-viewed mr-1 />
          <div>{{ updatedAtDate }}</div>
        </div>
      </div>
    </div>
  </div>
  <div block v-html="blog.bodyHTML" />
</template>
