<template>
  <q-dialog class="modal-dialog">
    <div class="modal-content card">
      <div class="divCloseButton">
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="closeButton"

          @click="closeModal"
        />
      </div>
      <div>
        <q-carousel
          v-model="slide"
          animated
          control-color="primary"
          class="rounded-borders"
          navigation-icon="radio_button_unchecked"
          ref="carousel"
          padding
          v-if="galleries.length >= 1"
        >
          <q-carousel-slide
            class="column no-wrap flex-center"
            v-for="(galleryImg, index) in galleries"
            :key="index"
            :name="index"
            :img-src="galleryImg.img"
          >
              <q-carousel-control
                position="top-right"
                :offset="[18, 18]"
                class="q-gutter-xs"
              >
                <q-btn
                  push dense color="red" text-color="black" icon="delete"
                  @click="handleDelete(galleryImg.gallery)"
                />
              </q-carousel-control>
              <q-carousel-control
                position="bottom-right"
                :offset="[18, 18]"
                class="q-gutter-xs"
              >
                <q-btn
                  push round dense color="orange" text-color="black" icon="arrow_left"
                  @click="$refs.carousel.previous()"
                />
                <q-btn
                  push round dense color="orange" text-color="black" icon="arrow_right"
                  @click="$refs.carousel.next()"
                />
              </q-carousel-control>
          </q-carousel-slide>
        </q-carousel>
        <hr>
        <p class="title">Adicionar Imagens</p>
      </div>
      <div>
        <div v-for="(image, index) in images" :key="index" class="image-item">
          <q-input v-model="image.title" label="Título" />
          <q-input v-model="image.description" label="Descrição" />
          <q-file
            @change="handleFileChange(index)"
            v-model="image.file"
            accept="image/*"
            outlined
            filled
            label="clique aqui para escolher a imagem"
          />
          <q-btn
            class="btn-remove"
            label="Remover"
            @click="removeImage(index)"
          />
        </div>
      </div>
      <div class="button-group">
        <q-btn
          class="btn-save bg-primary"
          label="Adicionar Imagem"
          @click="addImage"
        />
        <div class="actionsButtons">
          <q-btn class="btn-save bg-primary" @click="saveImages">Salvar</q-btn>
          <q-btn class="btn-cancel" type="reset" @click="cancelAndCloseModal"
            >Cancelar</q-btn
          >
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { IRelease } from 'src/pages/admin/releases/IndexView.vue'
import { computed } from 'vue'

interface IImage {
  title: string
  description: string
  file: File | null
}

const $q = useQuasar()
let timer: string | number | NodeJS.Timeout | undefined

const images = ref<IImage[]>([])
const slide = ref<number>(0)
const props = defineProps<{
  release: IRelease
  imageUploadModalOpen: boolean
}>()

const emit = defineEmits(['cancel', 'reload', 'deleteImg'])

const modalOpen = ref(false)

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

watch(
  () => props.imageUploadModalOpen,
  (newValue) => {
    slide.value = 0
    modalOpen.value = newValue
    if (newValue) {
      resetForm()
    } else {
      closeModal()
    }
  }
)

const handleDelete = async (img: any) => {

    $q.loading.show({
      message: 'Deletando a imagem da galeria, aguarde...',
      boxClass: 'bg-grey-2 text-grey-9',
      spinnerColor: 'primary'
    })

    try {
      const { data } = await api.delete(`/gallery-release/${img}`)
      $q.loading.hide()
      if (data.success) {
      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Imagem deletada com sucesso da galeria!'
      })
    } else {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: `Erro ao deletar imagem: ${data.message}`
      })
    }
    } catch (error) {
      console.error('Erro ao deletar imagem', error)
    } finally {
      emit('reload')
      emit('cancel')
    }
}

const resetForm = () => {
  images.value = []
}

const closeModal = () => {
  resetForm()
  modalOpen.value = false
}

const cancelAndCloseModal = () => {
  resetForm()
  modalOpen.value = false
  emit('cancel')
}

onMounted(() => {
  modalOpen.value = true
})

onBeforeUnmount(() => {
  closeModal()
})

const addImage = () => {
  images.value.push({ title: '', description: '', file: null })
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const handleFileChange = (index: number) => (files: FileList) => {
  const selectedFile = files[0]
  if (selectedFile) {
    images.value[index].file = selectedFile
  }
}

const saveImages = async () => {
  $q.loading.show({
    message: 'Salvando imagens na galeria da release, aguarde...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })

  const formDataImages = new FormData()
  formDataImages.append('releaseId', props.release.id)

  images.value.forEach((image, index) => {
    if (image.file) {
      formDataImages.append(`files[${index}]`, image.file)
      formDataImages.append(`title_${index}`, image.title)
      formDataImages.append(`description_${index}`, image.description)
    }
  })

  try {
    const { data } = await api.post('/release/upload', formDataImages, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    clearTimeout(timer)

    $q.loading.hide()

    if (data.success) {
      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Imagens salvas com sucesso na galeria da release!'
      })
    }

    emit('reload')
    emit('cancel')

    return data
  } catch (error) {
    clearTimeout(timer)
    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Erro no envio das imagens na galeria da release'
    })

    console.error('Erro no envio de imagens:', error)
    throw error
  }
}

type IImageGallery = {
  id: string
  img: string
  gallery: string
}

const galleries = computed<IImageGallery[]>(() => {
  const tempArray: IImageGallery[] = []
  props.release.gallery.map((gallery) => {
    gallery.images.map((img) => {
      const objTemp = {
        id: img.id,
        img: img.img,
        gallery: img.gallery
      }
      tempArray.push(objTemp)
    })
  })
  return tempArray
})

</script>

<style scoped>
.image-item {
  margin-bottom: 20px;
}

.divCloseButton {
  display: flex;
  justify-content: flex-end;
}

.closeButton {
  margin-bottom: 10px;
}

.modal-content {
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
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

.btn-remove {
  margin-top: 10px;
  background-color: #dc3545;
  color: #fff;
}

.btn-cancel {
  background-color: #dc3545;
  color: #fff;
}

.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
