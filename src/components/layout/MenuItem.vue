<script setup lang="ts">
export interface MenuItemProps {
  title: string
  caption?: string
  link?: string
  icon?: string
  notify?: number
}
withDefaults(defineProps<MenuItemProps>(), {
  caption: '',
  link: '#',
  icon: ''
})
</script>
<template>
  <q-item
    clickable
    style="border-radius: 50px; margin: 5px 20px"
    v-ripple
    tag="a"
    exact
    exact-active-class="bg-primary label-active"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="label-menu row justify-between"
        ><span v-if="title" v-text="$t(title)"></span>
        <span v-if="notify"> {{ notify }} </span>
      </q-item-label>
      <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
    </q-item-section>
  </q-item>
</template>
<style lang="scss" scoped>
.label-menu {
  //font-weight: 400;
  //font-size: 14px;
}
.label-active {
  color: white;
}
</style>
