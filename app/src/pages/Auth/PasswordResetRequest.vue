<template>
  <q-page class="flex flex-center">
      <PasswordResetRequestForm/>
  </q-page>
</template>

<script>
import PasswordResetRequestForm from 'components/Forms/PasswordResetRequestForm.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PasswordResetRequest',
  components : {PasswordResetRequestForm}
});
</script>
