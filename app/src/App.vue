<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import type { BlogEntries } from '@acbits/utils'
import NavItems from './components/NavItems.vue'
import ZScrollContainer from './components/ZScroll/ZScrollContainer.vue'
import ZScrollItem from './components/ZScroll/ZScrollItem.vue'
import BlogCard from './components/BlogCard.vue'

// The plan is to fetch more years as the user scrolls down.

const { isFetching, error, data } = useFetch(
  'data/micro-blogs-of-year-2022.json',
).json<BlogEntries>()
</script>

<template>
  <main text="gray-700 dark:gray-200">
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
    <NavItems />
  </main>
</template>
