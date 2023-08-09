<template>
  <q-page class="flex flex-center">
      <FormSignIn/>
  </q-page>
</template>

<script>
import FormSignIn from 'components/Forms/SignIn.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignIn',
  components : {FormSignIn},
  created(){
    if(this.$route.query.removeToken == 'true'){
      localStorage.removeItem('auth_token');
      this.$router.push({ path: '/auth/login' });
    }
  },
});
</script>