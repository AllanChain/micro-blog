<script setup lang="ts">
import type { BlogEntries } from '~/types'

const props = defineProps<{ year: string }>()
const router = useRouter()

const { isFetching, error, data } = useFetch(
  `data/year/${props.year}.json`,
).json<BlogEntries>()

const scrollY = ref(0)
const primaryPerspective = ref(100)
const itemZGap = ref(150)
const itemYGap = ref(200)
const currentItemIndex = computed(() => {
  return Math.floor(scrollY.value / itemYGap.value)
})

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
})
</script>

<template>
  <div>
    <div v-if="isFetching">
      Loading...
    </div>
    <div v-else-if="data">
      <div
        :style="{
          height: `calc(${itemYGap * (data.length-1)}px + 100vh)`,
        }"
      >
        <div
          v-for="i in data.length"
          :key="i"
          :style="{
            height: `${itemYGap}px`,
            'scroll-snap-align': 'start'
          }"
        />
      </div>
      <div
        fixed top-0 right-0 w-full h-full
        :style="{
          perspective: `${primaryPerspective}px`,
          'perspective-origin': '50% 50%',
        }"
      >
        <div
          absolute w-full h-screen preserve-3d
          :style="{
            transform: `translateZ(${scrollY / itemYGap * itemZGap}px)`,
          }"
        >
          <template v-for="(blog, i) in data" :key="blog.createdAt">
            <BlogCard
              v-show="i + currentItemIndex < data.length"
              :blog="blog"
              :distance="(data.length - i - 1) * itemZGap"
            />
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      Error: {{ error }}
    </div>

    <div>
      <button
        class="btn m-3 text-sm mt-8"
        @click="router.back()"
      >
        Back
      </button>
    </div>
  </div>
</template>

<style>
html, body {
  scroll-snap-type: y mandatory;
}
</style>
