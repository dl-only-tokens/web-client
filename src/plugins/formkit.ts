import { defaultConfig as formkitDefaultConfig, plugin as formkitPlugin } from '@formkit/vue'

import { isEtherAddress } from '@/helpers'

type FormKitNode<V = unknown> = {
  readonly value: V
}

const etherAddress = (node: FormKitNode): boolean => {
  return isEtherAddress(node.value as string)
}

const formkitConfig = formkitDefaultConfig({
  rules: { etherAddress },
})

export { formkitConfig, formkitPlugin }
