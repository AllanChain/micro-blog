<script setup lang="ts">
/* eslint-disable vue/no-setup-props-destructure */

const {
  primaryPerspective = 100,
  itemYGap = 200,
  itemZGap = 150,
} = defineProps<{
  primaryPerspective?: number
  itemYGap?: number
  itemZGap?: number
}>()

provide('item-z-gap', itemZGap)

const allItemIndices = ref<number[]>([])
const itemsCount = computed(() => {
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
  return Math.floor(scrollY.value / itemYGap)
})
provide('current-item-index', currentItemIndex)

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
