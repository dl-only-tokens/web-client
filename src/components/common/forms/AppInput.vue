<script setup lang="ts">
import { FormKit } from '@formkit/vue'

const props = withDefaults(
  defineProps<{
    type?: string
    name: string
    label: string
    placeholder?: string
    help?: string
    validation?: string
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

const emit = defineEmits(['change'])

const onChange = (v: string) => {
  if (props.validation?.includes('number')) {
    if (!v || isNaN(Number(v))) {
      return
    }
  }

  emit('change', v)
}
</script>

<template>
  <div class="app-input">
    <form-kit
      :type="type"
      :name="name"
      :label="label"
      :placeholder="placeholder"
      :help="help"
      :validation="validation"
      :validation-messages="{
        required: 'This field is required',
        number: 'Must be a number',
        etherAddress: 'Must be an ethereum address',
      }"
      @input="onChange"
    />
  </div>
</template>

<style lang="scss">
.app-input {
  label {
    color: var(--text-primary);
    font-family: var(--font-family-inter);
    font-size: 14px;
    line-height: 20px;

    display: block;
    margin-bottom: 8px;
  }

  input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid var(--border-tertiary);

    font-family: var(--font-family-inter);
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

  .formkit-help {
    color: var(--text-primary);
    font-family: var(--font-family-inter);
    font-size: 12px;
    line-height: 20px;

    display: block;
    margin-top: 8px;
  }

  .formkit-messages {
    margin-top: 8px;

    .formkit-message {
      color: var(--state-error-primary);
      font-family: var(--font-family-inter);
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
