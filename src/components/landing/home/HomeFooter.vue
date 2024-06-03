<script lang="ts" setup>
const date = new Date()
</script>
<template>
  <div
    class="row justify-center q-mt-md q-gutter-md items-center q-pa-md text-center"
  >
    <div class="col">
      <q-img
        class="q-mt-lg"
        src="~/assets/logo-black.png"
        style="max-width: 150px; margin: auto"
      />

      <div
        class="row justify-between items-center text-white text-center"
        style="max-width: 90%; margin: auto; margin-top: 80px"
      >
        <span>
          {{
            `© ${date.getFullYear()} Ticker Press. Todos os direitos reservados.`
          }}
        </span>
        <span>Privacidade</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer-area {
  background-color: #000;
}
</style>
