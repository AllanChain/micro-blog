<script setup lang="ts">
import type { BlogEntries } from '~/types'

const props = defineProps<{ year: string }>()

const { isFetching, error, data } = useFetch(
  `data/year/${props.year}.json`,
).json<BlogEntries>()
</script>

<template>
  <div>
    <div v-if="isFetching">
      Loading...
    </div>
    <div v-else-if="data">
      <ZScrollContainer>
        <ZScrollItem
          v-for="(blog, i) in data"
          :key="blog.createdAt"
          :index="data.length - 1 - i"
          center-y even-odd safe-geometry
        >
          <BlogCard :blog="blog" />
        </ZScrollItem>
        <ZScrollItem :index="data.length" center-y center-x>
          <div>End</div>
        </ZScrollItem>
      </ZScrollContainer>
    </div>
    <div v-else>
      Error: {{ error }}
    </div>
  </div>
</template>
