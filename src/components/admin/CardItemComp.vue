<script lang="ts" setup>
import { useQuasar } from 'quasar'

export interface CardItemProps {
  title?: string
  color?: string
  amount?: string
  label?: string
}
const props = defineProps<CardItemProps>()
const $q = useQuasar()
</script>
<template>
  <q-card
    style="margin: 10px 0; flex: 1"
    :class="`bg-${props.color || 'primary'} text-white dashboard-items`"
  >
    <q-card-section>
      <div class="row justify-between items-center">
        <div class="card-title">{{ props.title ?? '' }}</div>
        <div v-if="$q.screen.width > 500">
          <q-btn icon="sym_r_dashboard" round flat />
        </div>
      </div>
      <div class="text-h3">{{ props.amount ?? '--' }}</div>
    </q-card-section>

    <q-separator dark />

    <q-card-actions class="row justify-center">
      <q-btn :icon="$q.screen.width > 500 ? 'sym_r_add' : undefined" flat>{{
        props.label
      }}</q-btn>
    </q-card-actions>
  </q-card>
</template>
<style lang="scss" scoped>
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
