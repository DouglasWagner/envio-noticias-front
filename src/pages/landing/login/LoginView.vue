<script setup lang="ts">
import { useQuasar } from 'quasar'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LoginInput, LoginOutput } from 'src/models'
import { useAuth } from 'src/stores/data/auth'
import { appSession } from 'src/utils'

const $q = useQuasar()
const auth = useAuth()
const darkMode = ref(false)
const isLoading = ref(false)
const form = ref<LoginInput>({})
const isPwd = ref(false)
const router = useRouter()
const invalidCredentials = ref(false)
const navigate = async (name: string) => {
  await router.push({ name })
}
const login = async () => {
  invalidCredentials.value = false
  isLoading.value = true
  try {
    const data = await auth.login(form.value.email, form.value.password)
    if (typeof data.data?.sector === 'object' && data.data.sector.id) {
      data.data.sector = data.data.sector?.id
    }
    appSession().set('auth', data)
    appSession().set('user_id', { id: data.data?.id })
    auth.user = data as LoginOutput
    await navigate('landing-admin')
  } catch (e) {
    invalidCredentials.value = true
    console.log(e)
  } finally {
    isLoading.value = false
  }
}
onBeforeMount(async () => {
  if (appSession().get('auth')) {
    auth.user = appSession<LoginOutput>().get('auth')
    await navigate('landing-admin')
  }
})

const setDarkMode = () => {
  darkMode.value = !darkMode.value
  $q.dark.set(darkMode.value)
  window.localStorage.setItem(
    'settings',
    JSON.stringify({ dark: darkMode.value })
  )
}
</script>

<template>
  <q-page
    padding
    class="page-content full-height full-width"
    :class="$q.dark.isActive ? undefined : 'page-color'"
    :style="$q.dark.isActive ? undefined : 'background-color: #f3f6fc'"
  >
    <!-- page content -->

    <q-card v-motion-slide-bottom class="card-content">
      <q-card-section class="row justify-center">
        <q-img
          v-if="$q.dark.isActive"
          src="~/assets/logo-black.png"
          class="logo"
          alt="Ticker Press Logo"
        />
        <q-img
          v-else
          src="~/assets/logo-white.png"
          class="logo"
          alt="Ticker Press Logo"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="login" class="q-gutter-md">
          <q-input
            dense
            v-model="form.email"
            name="email"
            :placeholder="$t('mail')"
            :disable="isLoading"
            type="email"
            autocomplete="on"
            outlined
            required
          >
            <template v-slot:append>
              <q-icon name="mail" color="primary" />
            </template>
          </q-input>
          <q-input
            dense
            v-model="form.password"
            :disable="isLoading"
            name="current-password"
            :type="isPwd ? 'text' : 'password'"
            :placeholder="$t('password')"
            autocomplete="on"
            outlined
            required
            :error="invalidCredentials"
            error-message="Email ou senha incorretos"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="primary"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              type="submit"
              :label="$t('sign_in')"
              class="full-width"
              :loading="isLoading"
              padding="10px"
              size="sm"
              color="primary"
            />
            <q-btn
              flat
              type="button"
              class="q-mt-sm full-width"
              color="primary"
              size="sm"
              label="Esqueci minha senha"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />
      <q-card-section>
        <div>
          <q-btn size="sm" class="full-width" color="secondary" disable>
            <template v-slot:default>
              <div
                class="bg-white row items-center"
                style="border-radius: 50%; padding: 2px"
              >
                <q-img width="14px" src="~/assets/others/google-icon-5.png" />
              </div>
              <span class="q-mx-sm"> {{ $t('sign_in_with_google') }}</span>
            </template>
          </q-btn>
        </div>
        <div class="row justify-center q-mt-md">
          <q-btn
            flat
            @click="navigate('landing')"
            icon="arrow_back_ios"
            label="Voltar"
            color="primary"
            size="sm"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        @click="setDarkMode()"
        flat
        dense
        round
        :icon="$q.dark.isActive ? 'sym_r_wb_sunny' : 'sym_r_dark_mode'"
        aria-label="Dark Mode"
      />
    </q-page-sticky>
  </q-page>
</template>
<style lang="scss" scoped>
.logo {
  width: 100%;
  max-width: 180px;
}
.page-content {
  justify-content: center;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: #e5e5f7;
  // opacity: 0.8;
}
.page-color {
  background-image: radial-gradient(#058181 0.5px, #e5e5f7 0.5px);
  background-size: 10px 10px;
}
.card-content {
  width: 100%;
  max-width: 350px;
}
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
