<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import { ICON_NAME } from '@/enums'

const props = defineProps<{
  name: ICON_NAME
}>()

const icon = defineAsyncComponent(() => import(`../../assets/icons/${props.name}.svg`))
</script>

<template>
  <component :is="icon" class="app-icon" />
</template>
