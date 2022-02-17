<script setup lang="ts">
const router = useRouter()

const { data } = useFetch(
  'data/years.json',
).json<string[]>()
</script>

<template>
  <div v-if="data">
    <button
      v-for="year in data"
      :key="year"
      bg="green-600 hover:green-700 active:green-800"
      border="rounded-lg"
      text="white"
      p="x-2 y-1"
      @click="router.push(`/year/${year}`)"
    >
      {{ year }}
    </button>
  </div>
</template>
