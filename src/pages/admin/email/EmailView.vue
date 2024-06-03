<template>
  <div class="q-pa-md">
    <span
      class="text-h5 q--md title-pages"
      v-if="route.meta.title"
      v-text="$t(route.meta.title as string)"
    ></span>
    <q-form submit class="q-mt-sm q-gutter-sm">
      <q-input
        ref="emailInputRef"
        filled
        v-model="formData.emailAddress"
        label="Cole ou digite os endereços de e-mail aqui"
        type="textarea"
        lazy-rules = "ondemand"
        :rules="[
          (val) => (val && val.length > 0) || 'Por favor preencha com os emails'
        ]"
      />
      <div v-if="updateButton">
        <q-btn
          label="Alterar"
          :loading="isLoading"
          type="submit"
          color="primary"
          @click="onSubmitUpdate()"
        />
      </div>
      <div v-else>
        <q-btn
          label="Adicionar"
          :loading="isLoading"
          type="submit"
          color="primary"
          @click="onSubmit()"
        />
      </div>
    </q-form>
    <div class="q-mt-md">
      <div class="emailList-list">
        <p class="title">E-mails Cadastrados:</p>
        <div class="emailList-column">
          <div
            class="emailList-item"
            v-for="(email, index) in emailList"
            :key="index"
          >
            <div class="emailList-name">{{ email.emailAddress }}</div>
            <div class="icon-container">
              <q-icon
                name="border_color"
                size="18px"
                style="cursor: pointer"
                @click="openEditModal(email)"
              />
              <q-icon
                name="delete"
                size="18px"
                style="cursor: pointer"
                @click="deleteEmailList(email)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Notify, useQuasar } from 'quasar'
import { UseAPI } from 'src/composables'
import { useFocus } from '@vueuse/core'

const api = new UseAPI()
const route = useRoute()
const isLoading = ref(false)
const updateButton = ref(false)
const emailList = ref<IEmailList[]>([])
const $q = useQuasar()
const formData = ref<IEmailList>({})
const selectedEmail = ref<IEmailList>({})
const emailInputRef = ref<HTMLElement>()
const { focused } = useFocus(emailInputRef)

interface IEmailList {
  id?: string
  emailAddress?: string
}

onMounted(() => {
  fetchEmailList()
})

const deleteEmailList = async (email: IEmailList) => {
  $q.loading.show({
    message: 'Deletando email, aguarde...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })
    try {
      await api.remove({endpoint: `/emailList/${email.id}`})
    } catch (error) {
      console.error('Erro ao excluir Email', error)
    } finally {
      setTimeout(async () => {
        await fetchEmailList()
        $q.loading.hide()
      }, 1000)
    }
}

const fetchEmailList = async () => {
  try {
    const response = await api.get<any>({endpoint: '/emailList'})
    response.data.sort((a, b) => {
      const emailA = a.emailAddress.toUpperCase();
      const emailB = b.emailAddress.toUpperCase();
      if (emailA < emailB) {
        return -1;
      }
      if (emailA > emailB) {
        return 1;
      }
      return 0;
    });
    emailList.value = response.data
  } catch (error) {
    console.error('Erro ao buscar Email:', error)
  }
}

const onSubmit = async () => {
  try {
    isLoading.value = true
    const requestData = {
      emailAddress: formData.value.emailAddress,
    }
    await api.post<any>({
      endpoint: '/emailList',
      data: requestData,
    })
    Notify.create({
      color: 'green',
      position: 'top-right',
      message: "Email criado com sucesso!",
      timeout: 3000
    })
  } catch (error:any) {
    console.error('Erro ao adicionar os emails:', error)
    if(error.response.data.details.includes("Emails cadastrados, porém existem algum(s) já cadastrado(s)")){
      Notify.create({
      color: 'green',
      position: 'top-right',
      message: error.response.data.details,
      timeout: 6000
    })
    }else{
      Notify.create({
        color: 'red',
        position: 'top-right',
        message: error.response.data.details,
        timeout: 6000
      })
    }
  } finally {
    setTimeout(async () => {
      isLoading.value = false
      await fetchEmailList()
    }, 1000)
    formData.value.emailAddress = ''
    updateButton.value = false
  }
}

const onSubmitUpdate = async () => {
  try {
    isLoading.value = true
    const request = {
      emailAddress: formData.value.emailAddress
    }

    if(formData.value.emailAddress === selectedEmail.value.emailAddress){
      return
    }

    await api.put<any>({
      endpoint: `/emailList/${selectedEmail.value.id}`, // Endpoint correto para a rota do backend
      data: request,
     })

     Notify.create({
        color: 'green',
        position: 'top-right',
        message: 'Email adicionado com sucesso!',
        timeout: 1000
      })
    } catch (error:any) {
    console.error('Erro ao adicionar os emails:', error)
    if(error.response.data.details.includes("Emails cadastrados, porém existem algum(s) já cadastrado(s)")){
      Notify.create({
      color: 'green',
      position: 'top-right',
      message: error.response.data.details,
      timeout: 4000
    })
    }else{
      Notify.create({
        color: 'red',
        position: 'top-right',
        message: error.response.data.details,
        timeout: 4000
      })
    }
  } finally {
    setTimeout(async () => {
      isLoading.value = false
      await fetchEmailList()
    }, 1000)
    formData.value.emailAddress = ''
    updateButton.value = false
  }
}

const openEditModal = async (email: IEmailList) => {
  selectedEmail.value = { ...email }
  const formRef = formData.value.emailAddress
  formData.value.emailAddress = selectedEmail.value.emailAddress
  updateButton.value = true
  if(formRef === email.emailAddress){
    updateButton.value = false
    formData.value.emailAddress = ''
  }
  if(formData.value.emailAddress !== email.emailAddress){
    updateButton.value === true
  }
  focused.value = true
}
</script>

<style lang="scss" scoped>
.emailList-list {
  margin-top: 20px;
}
.title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
}
.emailList-column {
  display: flex;
  flex-direction: column;
}
.emailList-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.emailList-item {
  padding: 10px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

.emailList-item:hover {
  background-color: #f0f0f0;
}

.emailList-item:nth-child(even) {
  background-color: #e8e8e8;
}
.emailList-name {
  font-weight: bold;
  margin-bottom: 5px;
}
.icon-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
