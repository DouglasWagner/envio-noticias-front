<script>
import { toRefs, withDefaults  } from 'vue'


const props = defineProps(['imageSrc', 'imageUploadModalOpen'])

</script>

<template>
  <div>
    <q-file
      outlined
      filled
      @change="handleFileChange"
      v-model="formData.image"
      :label="typeof formData.initialImageName === 'string' ? formData.initialImageName : 'Miniatura - Imagem'"
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
  </div>
</template>