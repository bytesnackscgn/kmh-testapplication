<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center q-px-lg q-py-lg">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AuthLayout',
  components: {},
  data(){
    return {}
  },
  setup () {
    return {}
  }
})
</script>