<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import MenuItem, { MenuItemProps } from 'components/layout/MenuItem.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { localeOptions } from './../../i18n/locales'
import { useRouter } from 'vue-router'
import { appSession } from 'src/utils'
import { LoginOutput } from 'src/models'
import { useAuth } from 'src/stores/data'

const $q = useQuasar()
const { locale } = useI18n({ useScope: 'global' })
const darkMode = ref(false)

const leftDrawerOpen = ref(false)
const auth = useAuth()
const searchInput = ref('')
const icon_colors = computed(() => ($q.dark.isActive ? 'white' : 'black'))
const router = useRouter()

onBeforeMount(async () => {
  if (typeof appSession().get('auth') === 'object') {
    auth.user = appSession<LoginOutput>().get('auth')
  } else {
    await router.push({ name: 'landing' })
  }
})

const essentialLinks = computed(() =>
  menuItems.value.filter((v) =>
    v.title.toLowerCase().startsWith(searchInput.value.toLowerCase())
  )
)
const currentLocale = computed(
  () => localeOptions.find((v) => v.value === locale.value)?.label ?? 'PT'
)

const menuItems = ref<MenuItemProps[]>([
  {
    title: 'dashboard',
    caption: 'quasar.dev',
    icon: 'sym_r_dashboard',
    link: '/admin'
  },
  {
    title: 'Suas Releases',
    caption: 'github.com/quasarframework',
    icon: 'sym_r_new_releases',
    link: '/admin/releases'
  },
  {
    title: 'Disparo de Release',
    caption: 'github.com/quasarframework',
    icon: 'send',
    link: '/admin/send-release'
  },
  {
    title: 'Lista de E-mails',
    caption: 'github.com/quasarframework',
    icon: 'email',
    link: '/admin/email'
  },
  {
    title: 'profile',
    caption: 'github.com/quasarframework',
    icon: 'account_circle',
    link: '/admin/perfil'
  }
])
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const setDarkMode = () => {
  darkMode.value = !darkMode.value
  $q.dark.set(darkMode.value)
  window.localStorage.setItem(
    'settings',
    JSON.stringify({ dark: darkMode.value })
  )
}

onBeforeMount(() => {
  if (window.sessionStorage) {
  }
  if (window.localStorage) {
    if (localStorage.getItem('settings')) {
      const localSettings = JSON.parse(
        localStorage.getItem('settings') as string
      ) as { dark: boolean }
      darkMode.value = localSettings.dark

      $q.dark.set(localSettings.dark)
    }
  }
})

const logOut = async () => {
  window.sessionStorage.removeItem('auth')
  auth.user = {}
  await router.push({ name: 'login' })
}
</script>

<template>
  <q-layout class="main_content" view="lHh Lpr lFf">
    <q-header
      elevated
      style="box-shadow: none"
      :class="darkMode ? 'bg-primary' : 'bg-white text-black'"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="leftDrawerOpen ? 'sym_r_menu_open' : 'sym_r_menu'"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Painel </q-toolbar-title>

        <div>
          <q-btn-dropdown
            flat
            dense
            :color="icon_colors"
            dropdown-icon="sym_r_public"
            rounded
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <div class="text-center">{{ currentLocale }}</div>
              </div>
            </template>
            <q-list>
              <q-item
                v-for="(lang, key) in localeOptions"
                :key="key"
                @click="locale = lang.value"
                clickable
                v-close-popup
              >
                <q-item-section>
                  <q-item-label>{{ lang.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn
            flat
            @click="setDarkMode()"
            dense
            round
            :color="icon_colors"
            :icon="darkMode ? 'sym_r_wb_sunny' : 'sym_r_dark_mode'"
            aria-label="Dark Mode"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="menu_content"
      :style="!$q.dark.isActive ? 'background-color: #f3f6fc' : undefined"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          :class="!$q.dark.isActive ? 'bg-white' : undefined"
          header
        >
          <q-img
            v-if="$q.dark.isActive"
            width="50%"
            class="cursor-pointer"
            src="~/assets/logo-black.png"
            alt="Ticker Press Logo"
          />
          <q-img
            v-else
            width="50%"
            class="cursor-pointer"
            src="~/assets/logo-white.png"
            alt="Ticker Press Logo"
          />
        </q-item-label>

        <q-separator />

        <q-item clickable>
          <q-item-section avatar>
            <q-avatar>
              <img src="~/assets/generic-user-icon.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label
              ><span>{{ auth.user.data?.name ?? 'invalid user' }}</span>
            </q-item-label>
            <q-item-label caption> Gerente </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-mb-md" />
        <div class="row no-wrap justify-end q-gutter-sm q-px-md">
          <q-btn
            color="primary"
            icon="sym_r_manage_accounts"
            class="col"
            outline
            style="height: 30px"
          />
          <q-btn
            color="primary"
            icon="sym_r_mail"
            class="col"
            outline
            style="height: 30px"
          >
            <q-badge color="red" floating>4</q-badge>
          </q-btn>
          <q-btn
            color="primary"
            icon="sym_r_settings"
            class="col"
            outline
            style="height: 30px"
          />
          <q-btn
            color="red"
            icon="sym_r_exit_to_app"
            class="col"
            @click="logOut"
            outline
            style="height: 30px"
          />
        </div>
        <q-separator class="q-mt-md" />
        <q-item class="q-my-md" clickable tag="a">
          <q-item-section>
            <q-input
              color="primary"
              dense
              outlined
              v-model="searchInput"
              :label="$t('search')"
            >
              <template v-slot:append>
                <q-icon color="primary" name="sym_r_search" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- <q-item-label header>Menu</q-item-label> -->
        <MenuItem
          v-for="link in essentialLinks"
          :to="link.link"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <RouterView v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </RouterView>
    </q-page-container>
  </q-layout>
</template>
<style lang="scss" scoped>
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
