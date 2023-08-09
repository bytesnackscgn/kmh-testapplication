<template>
  <q-page class="flex flex-center">
      <PasswordResetForm/>
  </q-page>
</template>

<script>
import PasswordResetForm from 'components/Forms/PasswordResetForm.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PasswordResetRequest',
  components : {PasswordResetForm}
});
</script>
