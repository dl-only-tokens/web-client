<script setup lang="ts">
import { FormKit } from '@formkit/vue'

import { FORM_ERROR_MESSAGE } from '@/enums'

import FormKitStyledContainer from './FormKitStyledContainer.vue'

const props = withDefaults(
  defineProps<{
    type?: string
    name: string
    label: string
    placeholder?: string
    help?: string
    validation?: string
    disabled?: boolean
  }>(),
  {
    type: 'text',
    name: '',
    label: '',
    placeholder: undefined,
    help: undefined,
    validation: undefined,
  },
)

const emit = defineEmits(['change', 'blur'])

const onChange = (v: string) => {
  if (props.validation?.includes('number')) {
    if (!v || isNaN(Number(v))) {
      return
    }
  }

  emit('change', v)
}

const onBlur = (e: FocusEvent) => {
  const v = (e?.target as HTMLInputElement).value
  if (props.validation?.includes('number')) {
    if (!v || isNaN(Number(v))) {
      return
    }
  }

  emit('blur', v)
}
</script>

<template>
  <div :class="{ 'app-input': true, 'app-input_disabled': disabled }">
    <form-kit-styled-container :disabled="disabled">
      <form-kit
        :type="type"
        :name="name"
        :label="label"
        :placeholder="placeholder"
        :help="help"
        :validation="validation"
        :validation-messages="FORM_ERROR_MESSAGE"
        :disabled="disabled"
        @input="onChange"
        @blur="onBlur"
      />
    </form-kit-styled-container>
  </div>
</template>

<style lang="scss">
.app-input {
  &.app-input_disabled input {
    color: var(--disable-primary);
    border: 1px solid var(--disable-primary);
  }

  input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid var(--border-tertiary);

    font-family: var(--font-family-primary);
    font-size: 14px;
    line-height: 20px;
    color: var(--text-secondary);

    background: transparent;

    width: 100%;

    &:focus-visible {
      border: 1px solid var(--text-secondary);
      color: var(--text-primary);
      outline: none;
    }
  }
}
</style>
