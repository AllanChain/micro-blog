<script setup lang="ts">
const router = useRouter()

const { data } = useFetch(
  'data/years.json',
).json<string[]>()
</script>

<template>
  <div v-if="data" max-w-md mx-auto mt-6 text-center>
    <h1 text-2xl font-bold my-4>
      All Micro Blogs
    </h1>
    <button
      v-for="year in data"
      :key="year"
      bg="green-600 active:green-700 dark:green-700 dark:active:green-600"
      border="rounded-lg"
      text="white"
      p="x-2 y-1"
      @click="router.push(`/year/${year}`)"
    >
      {{ year }}
    </button>
  </div>
</template>
