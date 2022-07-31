<script setup lang="ts">
import type { BlogEntries } from '@acbits/utils'
import { computed, onMounted, ref, watch } from 'vue'
import NavItems from './components/NavItems.vue'
import ZScrollContainer from './components/ZScroll/ZScrollContainer.vue'
import ZScrollItem from './components/ZScroll/ZScrollItem.vue'
import BlogCard from './components/BlogCard.vue'

const blogs = ref<BlogEntries>([])
const blogIndex = ref<string[]>([])
const dataToFetch = ref<number | null>(null)
const loading = ref(true)
const hasMoreData = computed(() =>
  dataToFetch.value !== null && dataToFetch.value < blogIndex.value.length,
)

onMounted(async () => {
  const resp = await fetch('data/index.json')
  blogIndex.value = await resp.json() as string[]
})

watch(blogIndex, () => {
  if (blogIndex.value) {
    dataToFetch.value = 0
  }
})

watch(dataToFetch, async () => {
  if (dataToFetch.value !== null && hasMoreData.value) {
    loading.value = true
    const jsonUrl = `data/${blogIndex.value[dataToFetch.value]}.json`
    try {
      const resp = await fetch(jsonUrl)
      const data = await resp.json() as BlogEntries
      blogs.value = [...data, ...blogs.value]
    }
    finally {
      loading.value = false
    }
  }
})

const onEndReached = () => {
  if (hasMoreData.value && dataToFetch.value !== null) {
    dataToFetch.value = dataToFetch.value + 1
  }
}
</script>

<template>
  <main text="gray-700 dark:gray-200">
    <div>
      <!--
        Had to use margin trick instead of transform,
        because animate does not respect our transforms
      -->
      <div
        v-if="blogs.length === 0 && loading"
        class="i-carbon-circle-filled animate-ping"
        text="2xl blue-800 dark:blue-500"
        m="t--4 l--4"
        position="fixed left-1/2 top-1/2"
      />
      <div v-else-if="blogs.length !== 0">
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
      <div
        v-else
        text="center red-800 dark:red-500"
        position="fixed left-1/2 top-1/2"
        transform="translate-x--1/2 translate-y--1/2"
      >
        <div class="mx-auto text-xl i-carbon-close-outline" />
        Error loading :(
      </div>
    </div>
    <NavItems />
  </main>
</template>
