<script setup lang="ts">
import { ref } from 'vue'
import CardItem, { CardItemProps } from 'src/components/admin/CardItemComp.vue'
import { useRoute } from 'vue-router'

const cadItems = ref<CardItemProps[]>([
  { title: 'Nº Releases', color: 'primary', amount: '45' },
  { title: 'Disparos', color: 'primary', amount: '166' },
  { title: 'Lista de e-mails', color: 'primary', amount: '166' },
  { title: 'Visualizações', color: 'primary', amount: '120' }
])
const route = useRoute()
</script>

<template>
  <div class="q-pa-md">
    <span
      class="text-h5 q-mx-md title-pages"
      v-if="route.meta.title"
      v-text="$t(route.meta.title as string)"
    ></span>

    <div class="row items-start justify-start" style="width: 100%; gap: 15px">
      <CardItem
        v-motion-slide-bottom
        v-for="(cards, key) in cadItems"
        :delay="300"
        :title="cards.title"
        :amount="cards.amount"
        :label="$t('see_details')"
        :key="key"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.title-pages {
  padding: 0;
  margin: 0;
}

.body--light {
  /* ... */
}

.body--dark {
  /* ... */
}
</style>
