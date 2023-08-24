import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

export const useBreakpoints = () => {
  const { width: windowWidth } = useWindowSize()

  const isMobile = computed(() => windowWidth.value < 480)
  const isMedium = computed(() => windowWidth.value < 768)

  return {
    isMobile,
    isMedium,
  }
}
