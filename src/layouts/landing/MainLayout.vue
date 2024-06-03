<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(false)
const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value.name ?? '')
const navigate = async (name: string) => await router.push({ name })
const scrollTo = (element: string) => {
  if (leftDrawerOpen.value === true) leftDrawerOpen.value = false
  setTimeout(() => {
    document.querySelector(element)?.scrollIntoView({ block: 'center' })
  }, 1000)
}
</script>

<template>
  <q-layout
    class="main_content"
    view="lHh Lpr lFf"
    :style="$q.dark.isActive ? undefined : 'background-color: #f3f6fc'"
  >
    <q-header
      v-if="!['login'].includes(currentRoute as string)"
      class="bg-white"
    >
      <q-toolbar class="text-black">
        <q-btn
          flat
          dense
          round
          v-if="$q.screen.width < 600"
          color="primary"
          :icon="leftDrawerOpen ? 'sym_r_menu_open' : 'sym_r_menu'"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title
          :class="
            $q.screen.width > 600
              ? 'row justify-start items-center q-gutter-lg'
              : 'row justify-center items-center q-gutter-lg'
          "
        >
          <q-img src="~/assets/logo-white.png" class="logo-toolbar" />
        </q-toolbar-title>
        <div class="q-gutter-sm" v-if="$q.screen.width > 600">
          <q-btn
            v-if="$q.screen.width > 600"
            flat
            dense
            padding="xs"
            @click="scrollTo('.functionalities')"
            class="menu-text"
          >
            Funcionalidades
          </q-btn>
          <q-btn
            v-if="$q.screen.width > 600"
            flat
            dense
            padding="xs"
            @click="scrollTo('.form-content')"
            class="menu-text"
          >
            Junte-se
          </q-btn>
          <q-btn
            @click="navigate('login')"
            v-if="$q.screen.width > 600"
            color="primary"
            size="md"
            dense
            unelevated
            class="menu-text q-px-md"
          >
            Login
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      class="menu_content"
      :style="!$q.dark.isActive ? 'background-color: #f3f6fc' : undefined"
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item class="row justify-end">
          <q-btn
            outline
            style="width: 50px"
            icon="sym_r_close"
            color="primary"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </q-item>
        <q-separator class="q-mt-md" inset />
        <q-item clickable @click="scrollTo('.functionalities')">
          <q-item-section>Funcionalidades</q-item-section>
        </q-item>
        <q-separator inset />
        <q-item clickable @click="scrollTo('.form-content')">
          <q-item-section>Junte-se</q-item-section>
        </q-item>
        <q-separator inset />
        <q-item>
          <q-btn
            @click="navigate('login')"
            color="primary"
            size="md"
            dense
            unelevated
            class="menu-text q-px-md"
          >
            Login
          </q-btn>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <RouterView v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <KeepAlive>
            <component :is="Component"></component>
          </KeepAlive>
        </transition>
      </RouterView>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.logo-toolbar {
  max-width: 120px;
}

.scale-enter-active {
  transition: all 0.5s cubic-bezier(0.2, 0, 0, 1);
}

.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
