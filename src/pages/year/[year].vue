<script setup lang="ts">
import type { BlogEntries } from '~/types'

const props = defineProps<{ year: string }>()
const router = useRouter()

const { isFetching, error, data } = useFetch(
  `/data/year/${props.year}.json`,
).json<BlogEntries>()

const scrollY = ref(0)
const itemZGap = ref(300)
const itemYGap = ref(500)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
})
</script>

<template>
  <div>
    <!-- <h1 text-center>
      {{ year }}
    </h1> -->
    <div v-if="isFetching">
      Loading...
    </div>
    <div v-else-if="data">
      <div
        :style="{
          height: `calc(${itemYGap * (data.length-1)}px + 100vh)`,
          // 'scroll-snap-type': 'y mandatory'
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
          perspective: '100px',
          'perspective-origin': '50% 50%',
          // transform: `translateZ(${scrollY/itemYGap*itemZGap}px)`,
        }"
      >
        <div
          absolute w-full h-screen preserve-3d
          :style="{
            transform: `translateZ(${scrollY / itemYGap * itemZGap}px)`,
          }"
        >
          <BlogCard
            v-for="(blog, i) in data"
            :key="blog.datetime"
            :blog="blog"
            :distance="(data.length - i - 1) * itemZGap"
          />
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
html, body{
  scroll-snap-type: y mandatory;
}
</style>
