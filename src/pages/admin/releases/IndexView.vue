<template>
  <div class="q-pa-md">
    <div class="card">
      <div class="card-header">Releases</div>

      <hr class="divider" />

      <div style="display: flex">
        <button class="btn-new-release bg-primary" @click="openModal('create')">
          Nova Release
        </button>
        <div class="search-box">
          <input type="text" placeholder="Pesquisa" v-model="searchTerm" />
        </div>
      </div>
      <q-dialog v-model="emailModalOpen" class="modal-dialog">
        <div class="modal-content card email-modal">
          <p class="title">Informe o endereço de e-mail</p>
          <q-form @submit="sendEmail">
            <div class="form-group">
              <label for="email">E-mail</label>
              <q-input
                filled
                v-model="email"
                label="E-mail"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório'
                ]"
              />
            </div>
            <div class="button-group">
              <q-btn class="btn-save bg-primary" type="submit"> Enviar </q-btn>
              <q-btn class="btn-cancel" type="reset" @click="closeEmailModal">
                Cancelar
              </q-btn>
            </div>
          </q-form>
        </div>
      </q-dialog>
      <q-dialog
        v-model="modalOpen"
        @before-hide="resetForm"
        class="modal-dialog"
      >
        <div class="modal-content card">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <p class="title">
              {{ mode === 'create' ? 'Criar Nova Release' : 'Editar Release' }}
            </p>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <q-form
            @submit="mode === 'create' ? saveRelease() : saveEditedRelease()"
          >
            <div class="form-group">
              <label for="title">Título</label>
              <q-input
                ref="inputRef"
                filled
                v-model="formData.title"
                label="Título"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório'
                ]"
              />
            </div>
            <div class="form-group">
              <label for="subtitle">Subtítulo</label>
              <q-input
                ref="inputRef"
                filled
                v-model="formData.subtitle"
                label="Subtítulo"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório'
                ]"
              />
            </div>
            <div class="form-group">
              <label for="sector">Setor</label>
              <q-select
                standout="bg-teal text-white"
                v-model="formData.sector"
                :options="
                  sectorOptions.map((option) => ({
                    label: option.name,
                    value: option.id
                  }))
                "
                label="Selecione o setor"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório'
                ]"
                emit-value
                map-options
              />
            </div>
            <div class="form-group">
              <label for="group">Grupo</label>
              <q-select
                standout="bg-teal text-white"
                v-model="formData.group"
                use-input
                use-chips
                new-value-mode="add"
                :options="
                  groupOptions.map((option) => ({
                    label: option.name,
                    value: option.id
                  }))
                "
                label="Selecione o grupo"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório'
                ]"
                emit-value
                map-options
              />
            </div>
            <div class="form-group">
              <label for="hashtags">Hashtags</label>
              <q-input
                ref="inputRef"
                filled
                v-model="formData.hashtags"
                label="Hashtags"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório'
                ]"
              />
            </div>
            <div class="form-group">
              <label for="call">Chamada</label>
              <q-field
                ref="fieldRefCall"
                v-model="formData.call"
                label-slot
                borderless
                :rules="[
                  (val) => (!!val && val !== '<br>') || 'Campo obrigatório'
                ]"
              >
                <template #control>
                  <q-editor
                    v-model="formData.call"
                    :dense="$q.screen.lt.md"
                    required
                    class="full-width"
                    :style="
                      fieldRefCall && fieldRefCall.hasError
                        ? 'border-color: var(--q-negative)'
                        : ''
                    "
                    :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      [
                        'bold',
                        'italic',
                        'strike',
                        'underline',
                        'subscript',
                        'superscript'
                      ],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        {
                          label: $q.lang.editor.defaultFont,
                          icon: $q.iconSet.editor.font,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'default_font',
                            'arial',
                            'arial_black',
                            'comic_sans',
                            'courier_new',
                            'impact',
                            'lucida_grande',
                            'times_new_roman',
                            'verdana'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]"
                    :fonts="{
                      arial: 'Arial',
                      arial_black: 'Arial Black',
                      comic_sans: 'Comic Sans MS',
                      courier_new: 'Courier New',
                      impact: 'Impact',
                      lucida_grande: 'Lucida Grande',
                      times_new_roman: 'Times New Roman',
                      verdana: 'Verdana'
                    }"
                  />
                </template>
              </q-field>
            </div>
            <div class="form-group">
              <label for="text">Texto</label>
              <q-field
                ref="fieldRefText"
                v-model="formData.text"
                label-slot
                borderless
                :rules="[
                  (val) => (!!val && val !== '<br>') || 'Campo obrigatório'
                ]"
              >
                <template #control>
                  <q-editor
                    v-model="formData.text"
                    :dense="$q.screen.lt.md"
                    required
                    class="full-width"
                    :style="
                      fieldRefText && fieldRefText.hasError
                        ? 'border-color: var(--q-negative)'
                        : ''
                    "
                    :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      [
                        'bold',
                        'italic',
                        'strike',
                        'underline',
                        'subscript',
                        'superscript'
                      ],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        {
                          label: $q.lang.editor.defaultFont,
                          icon: $q.iconSet.editor.font,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'default_font',
                            'arial',
                            'arial_black',
                            'comic_sans',
                            'courier_new',
                            'impact',
                            'lucida_grande',
                            'times_new_roman',
                            'verdana'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]"
                    :fonts="{
                      arial: 'Arial',
                      arial_black: 'Arial Black',
                      comic_sans: 'Comic Sans MS',
                      courier_new: 'Courier New',
                      impact: 'Impact',
                      lucida_grande: 'Lucida Grande',
                      times_new_roman: 'Times New Roman',
                      verdana: 'Verdana'
                    }"
                  />
                </template>
              </q-field>
            </div>
            <div class="form-group">
              <label for="images">Imagem Principal</label>
              <q-file
                outlined
                filled
                @change="handleFileChange"
                v-model="formData.image"
                :label="
                  typeof formData.initialImageName === 'string'
                    ? formData.initialImageName
                    : 'Miniatura - Imagem'
                "
                accept=" image/*"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template #hint>
                  <div>
                    {{ formData.initialImageName }}
                  </div>
                </template>
                <template v-slot:append>
                  <q-btn
                    v-if="typeof formData.initialImageName === 'string'"
                    class="cursor-pointer"
                    :icon="'photo'"
                    @click="dialogView = true"
                    flat
                    :disable="!formData.initialImageName"
                    color="green-6"
                    label="Visualizar"
                  />
                </template>
              </q-file>
              <q-dialog v-model="dialogView">
                <q-card>
                  <q-card-section
                    class="row items-center q-pb-none modal-image-view"
                  >
                    <div class="text-h6">
                      {{ `Visualizando imagem ${imageName}` }}
                    </div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>

                  <q-card-section>
                    <q-img
                      fit="scale-down"
                      class="tam-img"
                      :src="formData.initialImageName"
                    ></q-img>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn
                      class="full-width"
                      label="Fechar"
                      color="primary"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
            <div class="button-group">
              <q-btn class="btn-save bg-primary" type="submit"> Salvar </q-btn>
              <q-btn class="btn-cancel" type="reset" @click="closeModal">
                Cancelar
              </q-btn>
            </div>
          </q-form>
        </div>
      </q-dialog>
      <div class="release-list">
        <p class="title">Título</p>
        <div class="release-column">
          <div
            class="release-item"
            v-for="(release, index) in filteredReleases"
            :key="index"
          >
            <div class="release-name">{{ release.title }}</div>
            <div class="icon-container">
              <q-icon
                name="border_color"
                size="18px"
                style="cursor: pointer"
                @click="openEditModal(release)"
              />
              <q-icon
                name="photo_camera"
                size="18px"
                style="cursor: pointer"
                @click="openImageUploadModal(release)"
              />
              <q-icon
                name="mark_email_unread"
                size="18px"
                style="cursor: pointer"
                @click="handleIconClick(release, 'mark_email_unread')"
              />
              <q-icon
                name="link"
                size="18px"
                style="cursor: pointer"
                @click="handleIconClick(release, 'link')"
              />
              <q-icon
                name="delete"
                size="18px"
                style="cursor: pointer"
                @click="confirmDeleteAction(release)"
              />
            </div>
            <q-dialog v-model="confirmDelete" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="warning" color="red" text-color="white" />
                  <span class="q-ml-sm"
                    >Ao excluir essa release, não será mais possível
                    recupera-la, confirma exclusão?</span
                  >
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="primary" v-close-popup />
                  <q-btn
                    flat
                    label="Excluir"
                    color="primary"
                    v-close-popup
                    @click="deleteRelease()"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <ImageUploadModal
            v-model="imageUploadModalOpen"
            :imageUploadModalOpen="imageUploadModalOpen"
            :release="releaseRef"
            @cancel="handleCancel"
            @reload="fetchReleases"
            @deleteImg="deleteGalleryImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar, QField } from 'quasar'
import { api } from 'src/boot/axios'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ImageUploadModal from 'components/image/ImageUploadModal.vue'
import { computed } from 'vue'

const $q = useQuasar()
const confirmDelete = ref(false)
let timer: string | number | NodeJS.Timeout | undefined
const dialogView = ref(false)

export interface IRelease {
  id: string
  title: string
  subtitle: string
  id_sector: string
  id_group_customer: string
  hashtags: string
  call: string
  text: string
  image: string
  status: string
  date_time_creation: Date
  date_time_last_update: Date
  user_id_creation: string
  user_id_last_update: string
  gallery: [
    {
      images: [
        {
          id: string
          img: string
          gallery: string
        }
      ]
    }
  ]
}

interface ISector {
  id: string
  name: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

interface IGroup {
  id: string
  name: string
}

const formData = ref({
  title: '',
  subtitle: '',
  sector: '',
  hashtags: '',
  call: '',
  text: '',
  group: null as string | null,
  image: '',
  initialImageName: ''
})

const fieldRefText = ref<QField | null>(null)
const fieldRefCall = ref<QField | null>(null)

const modalOpen = ref(false)
const mode = ref('create')

const emailModalOpen = ref(false)
const email = ref('')
const releaseRef = ref<IRelease>()
const imageUploadModalOpen = ref(false)

const deleteGalleryImg = (id: string) => {
  console.log('Chegou o Emit! ID: ' + id)
}

const handleCancel = () => {
  imageUploadModalOpen.value = false
}

const openImageUploadModal = (release: IRelease) => {
  releaseRef.value = release
  imageUploadModalOpen.value = true
}

const openEmailModal = () => {
  emailModalOpen.value = true
}

const confirmDeleteAction = (release: IRelease) => {
  releaseToDelete = release
  confirmDelete.value = true
}

const closeEmailModal = () => {
  emailModalOpen.value = false
}

const sendEmail = () => {
  closeEmailModal()
}

const resetForm = () => {
  formData.value = {
    title: '',
    subtitle: '',
    sector: '',
    hashtags: '',
    call: '',
    text: '',
    group: null,
    image: '',
    initialImageName: ''
  }
}

const handleFileChange = (files: any) => {
  const selectedFile = files[0]

  if (selectedFile) {
    formData.value.image = selectedFile
  }
}

const openModal = (action: string) => {
  mode.value = action
  modalOpen.value = true
}
const closeModal = () => {
  resetForm()
  modalOpen.value = false
}

const releases = ref<IRelease[]>([])
const sectorOptions = ref<ISector[]>([])
const groupOptions = ref<IGroup[]>([])
let releaseToDelete: IRelease | null = null as unknown as IRelease

const deleteRelease = async () => {
  $q.loading.show({
    message: 'Deletando release, aguarde...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })

  if (releaseToDelete) {
    try {
      await api.delete(`/release/${releaseToDelete.id}`)
    } catch (error) {
      console.error('Erro ao excluir a release', error)
    } finally {
      timer = setTimeout(async () => {
        $q.loading.hide()
        timer = void 0
        const response = await api.get('/release')
        releases.value = response.data.data
      }, 3000)
      releaseToDelete = null
      confirmDelete.value = false
    }
  }
}

const fetchReleases = async () => {
  try {
    const response = await api.get('/release')
    releases.value = response.data.data
  } catch (error) {
    console.error('Erro ao buscar releases:', error)
  }
}

const fetchSectors = async () => {
  try {
    const response = await api.get('/sectors/get_all_sectors')
    sectorOptions.value = response.data.data
  } catch (error) {
    console.error('Erro ao buscar setores:', error)
  }
}

const fetchGroups = async () => {
  try {
    const response = await api.get('/group')
    groupOptions.value = response.data.data
  } catch (error) {
    console.log('Erro ao buscar grupos:', error)
  }
}

onMounted(() => {
  fetchSectors()
  fetchReleases()
  fetchGroups()
})

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

const saveRelease = async () => {
  $q.loading.show({
    message: 'Salvando release, aguarde...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })

  const existGroup = groupOptions.value.find(
    (option) => option.id === formData.value.group
  )

  if (!existGroup) {
    const createGroup = await api.post('/group', formData.value, {
      headers: { 'Content-Type': 'application/json' }
    })
    formData.value.group = createGroup.data.data.id as string
    fetchGroups()
  }

  const formDataForUpload = new FormData()
  formDataForUpload.append('title', formData.value.title)
  formDataForUpload.append('subtitle', formData.value.subtitle)
  formDataForUpload.append('sector', formData.value.sector)
  formDataForUpload.append('hashtags', formData.value.hashtags)
  formDataForUpload.append('call', formData.value.call)
  formDataForUpload.append('text', formData.value.text)
  formDataForUpload.append('group', formData.value.group as string)

  if (formData.value.image !== null) {
    formDataForUpload.append('image', formData.value.image)
  }

  try {
    await api.post('/release', formDataForUpload, {
      headers: {
        'Content-Type': 'multipart/formData'
      }
    })
  } catch (error) {
    console.error('Erro ao excluir a release', error)
  } finally {
    timer = setTimeout(async () => {
      $q.loading.hide()
      timer = void 0
      const response = await api.get('/release')
      releases.value = response.data.data
      modalOpen.value = false
      resetForm()
    }, 3000)
  }
}

let selectedRelease: IRelease | null = null

const openEditModal = (release: IRelease) => {
  selectedRelease = { ...release }
  fillFormWithReleaseData(selectedRelease)
  openModal('edit')
}

const fillFormWithReleaseData = (release: IRelease) => {
  formData.value.title = release.title
  formData.value.subtitle = release.subtitle
  formData.value.sector = release.id_sector
  formData.value.group = release.id_group_customer
  formData.value.hashtags = release.hashtags
  formData.value.call = release.call
  formData.value.text = release.text
  formData.value.initialImageName = release.image
}

const closeEditModal = () => {
  selectedRelease = null
  modalOpen.value = false
}

const saveEditedRelease = async () => {
  $q.loading.show({
    message: 'Atualizando release, aguarde...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })
  if (selectedRelease) {
    const updateFormData = new FormData()
    updateFormData.append('title', formData.value.title)
    updateFormData.append('subtitle', formData.value.subtitle)
    updateFormData.append('sector', formData.value.sector)
    updateFormData.append('id_group_customer', formData.value.group)
    updateFormData.append('hashtags', formData.value.hashtags)
    updateFormData.append('call', formData.value.call)
    updateFormData.append('text', formData.value.text)
    updateFormData.append('image', formData.value.image)
    try {
      await api.put(`/release/${selectedRelease.id}`, updateFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      timer = setTimeout(async () => {
        $q.loading.hide()
        timer = void 0
        const response = await api.get('/release')
        releases.value = response.data.data
        modalOpen.value = false
        resetForm()
      }, 3000)
    } catch (err: any) {
      alert(err.message)
    }
    closeEditModal()
  }
}

const openDeleteConfirmationModal = (release: IRelease) => {
  releaseToDelete = release
  confirmDelete.value = true
}

const handleIconClick = (release: IRelease, iconName: unknown) => {
  if (iconName === 'delete') {
    openDeleteConfirmationModal(release)
  }
  if (iconName === 'mark_email_unread') {
    openEmailModal()
  } else {
    console.log(release, iconName)
  }
}

const imageName = computed(() => {
  return formData.value.initialImageName
    ? formData.value.initialImageName.split('/').slice(-1)[0]
    : ''
})

const searchTerm = ref('')

const filteredReleases = computed(() => {
  if (!searchTerm.value.trim()) {
    return releases.value
  } else {
    return releases.value.filter((release) =>
      release.title
        .toLowerCase()
        .includes(searchTerm.value.trim().toLowerCase())
    )
  }
})
</script>

<style lang="scss" scoped>
label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-save,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border: none;
  border-radius: 50px;
  cursor: pointer;
}

.btn-save {
  color: #fff;
  margin-right: 10px;
}

.btn-cancel {
  background-color: #dc3545;
  color: #fff;
}

.btn-save:hover,
.btn-cancel:hover {
  filter: brightness(0.9);
}
.modal-content form .form-group {
  margin-bottom: 20px;
}

.modal-content form .form-group label {
  margin-bottom: 5px;
}

.modal-content form .form-group input[type='text'],
.modal-content form .form-group textarea {
  width: calc(100% - 20px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.email-modal {
  width: 50%;
}

.q-dialog__inner--minimized > div {
  max-width: none !important;
}

.modal-content form .form-group input[type='text']:hover,
.modal-content form .form-group input[type='text']:focus,
.modal-content form .form-group textarea:hover,
.modal-content form .form-group textarea:focus {
  border-color: #888;
}

.modal-content {
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  overflow-y: auto;
}

.release-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.release-column {
  display: flex;
  flex-direction: column;
}

.release-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.release-list {
  margin-top: 20px;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
}

.release-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.release-item {
  padding: 10px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

.release-item:hover {
  background-color: #f0f0f0;
}

.release-item:nth-child(even) {
  background-color: #e8e8e8;
}
.title-pages {
  padding: 0;
  margin: 0;
}
.icon-button {
  padding: 5px;
  margin-right: 5px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.divider {
  margin: 15px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.btn-new-release {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-right: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
}

.search-box input[type='text'] {
  border: none;
  outline: none;
  width: 100%;
}

.modal-image-view {
  width: 700px !important;
  max-width: 80vw;
}
</style>
