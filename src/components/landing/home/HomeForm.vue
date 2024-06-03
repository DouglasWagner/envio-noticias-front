<script lang="ts" setup>
import { ref } from 'vue'
import { UseAPI } from 'src/composables'
import { alertErrors, alertUpdated } from 'src/helpers'

export interface JoinUsModel {
  name?: string
  company?: string
  email?: string
  whatsapp?: string
  role?: Array<string>
  comments?: string
}

const data = ref<JoinUsModel>({ role: [] })
const options = ['Jornalista', 'Assessor de Imprensa ', 'Gestor']
const api = new UseAPI()
const loading = ref(false)

const sendRequest = async () => {
  // Verificando se todos os campos obrigatórios estão preenchidos
  if (!data.value.name || !data.value.company || !data.value.email || !data.value.whatsapp) {
    alertErrors('Todos os campos obrigatórios devem ser preenchidos: nome, empresa, email e whatsapp.')
    return
  }

  loading.value = true

  try {
    await api.post({
      endpoint: 'https://www.boxti.com.br/api-email-ticker-press/apiEnviaEmail.php',
      data: {
        name: data.value.name,
        company: data.value.company,
        email: data.value.email,
        whatsapp: data.value.whatsapp,
        comments: data.value.comments,
        role: data.value.role || []
      },
      multipart: false // Não é necessário multipart para dados JSON
    })

    await alertUpdated('E-mail enviado com sucesso! Entraremos em contato em breve.')
  } catch (error) {
    console.error(error)
    await alertErrors('Erro ao enviar e-mail')
  }

  loading.value = false
}
</script>

<template>
  <div class="form-content q-pa-md">
    <q-form @submit.prevent="sendRequest">
      <div class="text-h5 form-content__title text-bold text-center q-py-md">
        JUNTE-SE A NÓS (lista de espera)
      </div>
      <div class="q-gutter-md q-mt-lg justify-center width-full">
        <q-input
          outlined
          bg-color="white"
          v-model="data.name"
          required
          label="Nome*"
        />

        <q-input
          outlined
          bg-color="white"
          v-model="data.company"
          required
          label="Empresa*"
        />
        <q-input
          outlined
          type="email"
          v-model="data.email"
          bg-color="white"
          required
          label="Email*"
        />

        <q-input
          outlined
          v-model="data.whatsapp"
          bg-color="white"
          label="Whatsapp"
          mask="(##) # ####-####"
          fill-mask
        />
        <div class="q-gutter-sm justify-center">
          <p>Qual seu papel?</p>
          <q-checkbox
            class="q-ma-none q-pa-none"
            v-for="(roles, key) in options"
            :key="key"
            v-model="data.role"
            :val="roles"
            :label="roles"
          />
          <q-input
            outlined
            v-model="data.comments"
            bg-color="white"
            type="textarea"
            label="Alguma dúvida ou sugestão?"
          />
        </div>
        <div class="row justify-center width-full">
          <q-btn
            style="margin: auto"
            size="md"
            type="submit"
            label="ENVIAR"
            color="primary"
            :loading="loading"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>
<style lang="scss" scoped>
.form-content {
  max-width: 600px;
  margin: auto;
}

.footer-area {
  background-color: $primary;
  min-height: 300px;
}

@media all and (min-width: 650px) {
  .footer-area {
    height: calc(100vh - 83.9px);
  }
}
</style>
