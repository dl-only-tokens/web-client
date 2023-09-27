<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import { onMounted, ref } from 'vue'

import CircleLoaderDarkJson from '@/assets/animations/loader-dark.json'
import CircleLoaderLightJson from '@/assets/animations/loader-light.json'

withDefaults(
  defineProps<{
    type?: 'light' | 'dark'
  }>(),
  {
    type: 'light',
  },
)

const anim = ref()

onMounted(() => {
  setTimeout(() => {
    anim.value
  }, 500)
})
</script>
<template>
  <lottie-animation
    ref="anim"
    :animation-data="type === 'light' ? CircleLoaderLightJson : CircleLoaderDarkJson"
    :auto-play="true"
    :loop="true"
    :speed="1"
  />
</template>
