<script setup lang="ts">
const props = defineProps<{ label?: string }>()
</script>
<template>
  <q-list>
    <q-item
      clickable
      style="border-radius: 50px"
      v-ripple
      active
      tag="a"
      active-class="bg-secondary label-active text-white"
    >
      <q-item-section avatar>
        <q-icon name="sym_r_dashboard" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <span v-text="props.label"> </span>
        </q-item-label>
        <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
      </q-item-section>
    </q-item>
  </q-list>
</template>
<style lang="scss" scoped></style>
