<script setup lang="ts">
import type { Ref } from 'vue'

const props = defineProps<{
  index: number
  centerY?: boolean
  centerX?: boolean
  evenOdd?: boolean
}>()

const addItemIndex = inject<(index: number) => void>('add-item-index')
const removeItemIndex = inject<(index: number) => void>('remove-item-index')

onBeforeMount(() => {
  addItemIndex!(props.index)
})
onBeforeUnmount(() => {
  removeItemIndex!(props.index)
})
watch(() => props.index, (index, oldIndex) => {
  removeItemIndex!(oldIndex)
  addItemIndex!(index)
})

const currentItemIndex = inject<Ref<number>>('current-item-index')
const itemZGap = inject<Ref<number>>('item-z-gap')

const classes = computed(() => {
  const c: string[] = []
  if (props.centerY) c.push('-translate-y-1/2', 'top-1/2')
  if (props.centerX) c.push('-translate-x-1/2', 'left-1/2')
  if (props.evenOdd) c.push('odd:left-0', 'even:right-0')
  return c
})
</script>

<template>
  <div
    v-show="currentItemIndex! <= index"
    absolute preserve-3d transform
    :class="classes"
    :style="{ '--un-translate-z': `${-index * itemZGap!}px` }"
  >
    <slot />
  </div>
</template>
