<script setup lang="ts">
import HomeFooter from 'components/landing/home/HomeFooter.vue'
import HomeForm from 'components/landing/home/HomeForm.vue'
import HomeFunctionalities from 'components/landing/home/HomeFunctionalities.vue'

const scrollTo = (element: string) => {
  setTimeout(() => {
    document.querySelector(element)?.scrollIntoView({ block: 'center' })
  }, 1000)
}
</script>

<template>
  <div>
    <div class="page-container column justify-center items-center">
      <div class="text-center q-pa-md">
        <div class="text-h1 home-text">
          <span class="text-primary">Assessor de Imprensa e Jornalista</span>.
          Nós o ajudamos a fazer seu trabalho
          <span class="text-primary">ainda melhor</span>!
        </div>
        <div class="q-mt-md">
          <q-btn
            color="primary"
            dense
            size="md"
            unelevated
            style="width: 100%; max-width: 250px"
            label="Junte-se a lista de espera"
            @click="scrollTo('.form-content')"
          />
        </div>
      </div>
    </div>

    <HomeFunctionalities />

    <HomeForm />

    <HomeFooter class="footer-area" />
  </div>
</template>
<style lang="scss" scoped>
.home-text {
  font-size: 3rem;
  font-weight: 500;
  line-height: 1;
}

@media all and (min-width: 650px) {
  .home-text {
    font-size: 4.5rem;
    max-width: 48rem;
  }
}

.page-container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: calc(100vh - 83.9px);
}
</style>
