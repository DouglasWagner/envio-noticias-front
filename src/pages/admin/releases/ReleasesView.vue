<script setup lang="ts">
import { ref } from 'vue'
import { Pie } from 'vue-chartjs'
import LabelComponent from 'components/LabelComp.vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import CardItem, { CardItemProps } from 'src/components/admin/CardItemComp.vue'

ChartJS.register(ArcElement, Tooltip, Legend)
const data = {
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
}
const cadItems = ref<CardItemProps[]>([
  { title: 'Nº Releases', color: 'primary', amount: '166' },
  { title: 'Nº Releases', color: 'primary', amount: '166' },
  { title: 'Nº Releases', color: 'primary', amount: '166' },
  { title: 'Nº Releases', color: 'primary', amount: '166' }
])

const options = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="q-pa-md">
    <span class="text-h5 q-mx-md title-pages">Dashboard</span>

    <div class="row items-start justify-start" style="width: 100%; gap: 15px">
      <CardItem
        v-for="(cards, key) in cadItems"
        :title="cards.title"
        :amount="cards.amount"
        :key="key"
      />
    </div>
    <div style="border-radius: 15px; display: inline-block">
      <div>
        <div>
          <LabelComponent label="Gráfico" dense />
        </div>
        <div>
          <Pie style="width: 300px" :options="options" :data="data" />
        </div>
      </div>
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
