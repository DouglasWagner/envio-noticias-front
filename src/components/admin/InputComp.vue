<!-- <script setup lang="ts">
import { QInput, QInputProps, QInputType } from 'quasar';
import { computed } from 'vue'

const props = defineProps<{ modelValue?: string | number,type:QInputType,mask:string}>()
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
props.type = ''
</script>
<template>
  <q-input v-model="model" type=""></q-input>
</template>
<style lang="scss" scoped></style> -->
