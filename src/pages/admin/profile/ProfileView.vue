<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { sectorsComposables } from 'src/composables/sectors'
import { LoginOutput, Profile } from 'src/models'
import { Notify } from 'quasar'
import { useAuth } from 'src/stores/data'
import { UseAPI } from 'src/composables'
import { appSession } from 'src/utils'

const api = new UseAPI()
const { sectors } = sectorsComposables()
const route = useRoute()
const auth = useAuth()
const form = ref<Profile>({})
const checkUpload = ref(false)
const check = computed(() => checkUpload.value)
const isLoading = ref(false)
const MAX_FILE = ref(1 * 1024 * 1024)

onMounted(() => {
  auth.user = appSession<LoginOutput>().get('auth')
  form.value = { ...form.value, ...auth.user.data } as Profile
  if (typeof form.value.sector === 'object' && form.value.sector?.id) {
    form.value.sector = form.value.sector.id
  }
})
async function checkImageSize() {
  if (form.value.image instanceof File) {
    if (form.value.image.size > MAX_FILE.value) {
      Notify.create({
        color: 'yellow',
        position: 'top-right',
        message: 'Tamanho maximo atingido',
        timeout: 1000
      })
      return
    }
    form.value.image = (await readFile(form.value.image)) as string
  }
}

async function readFile(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((res) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e: ProgressEvent<FileReader>) =>
      e.target ? res(e.target.result) : null
  })
}

const onSubmit = async () => {
  try {
    isLoading.value = true
    const data = await api.put<LoginOutput>({
      endpoint: `/user/${appSession<LoginOutput>().get('auth').data?.id}`,
      data: form.value
    })
    auth.user = { ...auth.user, ...{ data: form.value } } as LoginOutput
    appSession().set('auth', auth.user)
    if (typeof data.data?.sector === 'object' && data.data.sector.id) {
      data.data.sector = data.data.sector?.id
    }
    Notify.create({
      color: 'green',
      position: 'top-right',
      message: 'Perfil atualizado com sucesso!',
      timeout: 1000
    })
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="q-pa-md">
    <span
      class="text-h5 q--md title-pages"
      v-if="route.meta.title"
      v-text="$t(route.meta.title as string)"
    ></span>
    <q-form @submit="onSubmit" class="q-mt-sm q-gutter-sm">
      <q-input
        filled
        v-model="form.name"
        label="Nome*"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Por favor preencha o campo nome'
        ]"
      />

      <q-input
        type="email"
        filled
        v-model="form.email"
        label="E-mail*"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Por favor preencha o campo email'
        ]"
      />

      <q-input
        filled
        v-model="form.bio"
        label="Sobre*"
        type="textarea"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Por favor preencha o campo sobre'
        ]"
      />

      <q-file
        outlined
        filled
        v-model="form.image"
        :max-files="1"
        disable
        @update:model-value="checkImageSize"
        accept=" image/*"
        :max-file-size="MAX_FILE"
        lazy-rules
        :error="check"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template #hint>
          <div>{{ $t('image_upload') }}</div>
        </template>
      </q-file>
      <q-select
        v-model="form.sector"
        :options="sectors"
        label="Escolha um setor"
        option-label="name"
        option-value="id"
        outlined
        emit-value
        map-options
        lazy-rules
        required
      />

      <div>
        <q-btn
          label="Salvar"
          :loading="isLoading"
          type="submit"
          color="primary"
        />
        <q-btn
          label="Resetar"
          outline
          type="reset"
          disable
          color="primary"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<style lang="scss" scoped></style>
