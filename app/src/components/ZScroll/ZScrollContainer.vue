<script setup lang="ts">
import { computed, onMounted, provide, ref, watchEffect } from 'vue'

// We need default props here, so we are using runtime declaration
const { primaryPerspective, itemYGap, itemZGap } = defineProps({
  primaryPerspective: { type: Number, default: 100 },
  itemYGap: { type: Number, default: 200 },
  itemZGap: { type: Number, default: 150 },
})
const emit = defineEmits<{
  (e: 'endReached'): void
}>()

provide('item-z-gap', itemZGap)

const allItemIndices = ref<number[]>([])
const itemsCount = computed(() => {
  if (allItemIndices.value.length === 0)
    return 0
  return Math.max(...allItemIndices.value) + 1
})

provide('add-item-index', (index: number) => {
  allItemIndices.value.push(index)
})
provide('remove-item-index', (index: number) => {
  allItemIndices.value.splice(allItemIndices.value.indexOf(index), 1)
})

const scrollY = ref(0)
const currentItemIndex = computed(() => {
  const floatIndex = scrollY.value / itemYGap
  const roundedIndex = Math.round(floatIndex)
  // We stick to previous index if not close enough to the next one
  if (Math.abs(roundedIndex - floatIndex) < 0.01)
    return roundedIndex
  return Math.floor(floatIndex)
})
provide('current-item-index', currentItemIndex)
watchEffect(() => {
  if (currentItemIndex.value === itemsCount.value - 1)
    emit('endReached')
})

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
})
</script>

<template>
  <div
    :style="{
      height: `calc(${itemYGap * (itemsCount - 1)}px + 100vh)`,
    }"
  >
    <div
      v-for="i in itemsCount"
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
      <slot />
    </div>
  </div>
</template>

<style>
html, body {
  scroll-snap-type: y mandatory;
}
</style>
