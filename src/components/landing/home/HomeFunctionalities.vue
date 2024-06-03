<script lang="ts" setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import image01 from 'assets/images-home/image-01.png'

const active = ref(0)
const tab = ref(0)
const $q = useQuasar()
const items = [
  { title: 'Gerencie seus releases' },
  { title: 'Tenha a análise de sentimento do release por IA' },
  {
    title:
      'Gere automaticamente hashtags e sugestão de manchetes para os releases'
  },
  { title: 'Envie e-mails para sua lista' },
  { title: 'Saiba quem abriu o e-mail e quem acessou o release' },
  {
    title:
      'Em um futuro não muito distante, tenha sua página personalizada, e seus releases na rede social Ticker.press, se quiser'
  }
]

const itemsTabs = [
  { title: 'Gerencie releases' },
  { title: 'Sentimento de releases' },
  { title: 'Automatize hashtags' },
  { title: 'Envie e-mails' },
  { title: 'Aberturas de e-mai' },
  { title: 'Futuro: Página personalizada' }
]

const imageWrapper = (index: number) => {
  active.value = index
  changeImage()
}

const changeImage = (index?: number) => {
  const images = [image01, image01, image01, image01, image01, image01]
  return images[index ?? active.value]
}
</script>

<template>
  <div class="functionalities text-white q-pa-xl">
    <div style="max-width: 1900px; margin: auto 0">
      <div class="text-title" v-if="$q.screen.width > 1024">
        <p>Funcionalidade, engajamento e</p>
        <p>assertividade para sua equipe</p>
      </div>
      <div class="text-title q-px-md" v-else>
        <p>Funcionalidade, engajamento e assertividade para sua equipe</p>
      </div>

      <div
        class="full-width row justify-center items-center q-mt-xl"
        v-if="$q.screen.width > 1024"
      >
        <div class="col-5">
          <q-list>
            <q-item
              clickable
              v-ripple
              v-for="(item, index) in items"
              :key="index"
              class="items"
              @click="imageWrapper(index)"
              :active="active === index"
              active-class="background-active"
            >
              <q-item-section class="q-py-md">
                <span class="title">{{ item.title }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-7 container-image">
          <q-img :src="changeImage()" fit="contain" class="image" />
        </div>
      </div>

      <div class="q-gutter-y-md" style="width: 100vw; margin: auto 0" v-else>
        <q-tabs
          v-model="tab"
          inline-label
          outside-arrows
          mobile-arrows
          class="bg-primary text-white shadow-2"
        >
          <q-tab
            v-for="(item, index) in itemsTabs"
            :key="index"
            :name="index"
            :label="item.title"
          />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
          class="full-width full-height text-white bg-transparent"
        >
          <q-tab-panel
            v-for="(item, index) in items"
            :key="index"
            :name="index"
            class="column"
          >
            <span class="title">{{ item.title }}</span>
            <q-img
              :src="changeImage(index)"
              fit="contain"
              class="full-width q-mt-md"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-title {
  @media (min-width: 1024px) {
    line-height: 0.6;
    text-align: center;
    font-size: 2.2rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.7rem;
    line-height: 2rem;
    margin-bottom: 30px;

    p {
      margin-bottom: 0;
    }
  }
}

.functionalities {
  background-color: $primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 115vh;
}

.items {
  border-radius: 15px;
}

.title {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.background-active {
  background: #1c8888;
  color: #fff;
}

.container-image {
  overflow: hidden;
  border-radius: 15px;

  .image {
    @media (min-width: 1024px) {
      width: 62.8125rem;
    }

    height: 665px;
    display: block;
    vertical-align: middle;
  }
}
</style>
