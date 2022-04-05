<script setup lang="ts">
import type { BlogEntries } from '@acbits/utils'
import { computed, onMounted, ref, watch } from 'vue'
import NavItems from './components/NavItems.vue'
import ZScrollContainer from './components/ZScroll/ZScrollContainer.vue'
import ZScrollItem from './components/ZScroll/ZScrollItem.vue'
import BlogCard from './components/BlogCard.vue'

const blogs = ref<BlogEntries>([])
const blogIndex = ref<string[]>([])
const dataToFetch = ref<number|null>(null)
const loading = ref(true)
const hasMoreData = computed(() =>
  dataToFetch.value !== null && dataToFetch.value < blogIndex.value.length,
)

onMounted(async() => {
  const resp = await fetch('data/index.json')
  blogIndex.value = await resp.json() as string[]
})

watch(blogIndex, () => {
  if (blogIndex.value) dataToFetch.value = 0
})

watch(dataToFetch, async() => {
  if (dataToFetch.value !== null && hasMoreData.value) {
    loading.value = true
    const jsonUrl = `data/${blogIndex.value[dataToFetch.value]}.json`
    const resp = await fetch(jsonUrl)
    const data = await resp.json() as BlogEntries
    blogs.value = [...data, ...blogs.value]
    loading.value = false
  }
})

const onEndReached = () => {
  if (hasMoreData.value && dataToFetch.value !== null)
    dataToFetch.value = dataToFetch.value + 1
}
</script>

<template>
  <main text="gray-700 dark:gray-200">
    <div>
      <div v-if="blogs.length === 0 && loading">
        Loading...
      </div>
      <div v-else-if="blogs">
        <ZScrollContainer @end-reached="onEndReached">
          <ZScrollItem v-if="!hasMoreData" :index="blogs.length" center-y center-x>
            <div>End</div>
          </ZScrollItem>
          <ZScrollItem
            v-for="(blog, i) in blogs"
            :key="blog.createdAt"
            :index="blogs.length - 1 - i"
            center-y even-odd safe-geometry
          >
            <BlogCard :blog="blog" />
          </ZScrollItem>
        </ZScrollContainer>
      </div>
      <div v-else>
        Error loading
      </div>
    </div>
    <NavItems />
  </main>
</template>
