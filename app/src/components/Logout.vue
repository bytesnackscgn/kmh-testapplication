<template>
	<q-item clickable tag="span" @click="signOut(route)" class="">
		<q-item-section v-show="icon" class="q-pr-sm" avatar>
			<q-icon :name="icon" class="text-grey-inactive" />
		</q-item-section>

		<q-item-section>
			<q-item-label v-show="caption!=''">{{ title }}</q-item-label>
			<q-item-label v-show="caption!=''" caption>
				{{ caption }}
			</q-item-label>
			<span v-show="caption==''">{{ title }}</span>
		</q-item-section>
	</q-item>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'RouterLink',
  props: {
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    route: {
      type: String,
      default: '#'
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods : {
    resetUser(){
      this.$store.commit('user/cu', {
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        status: '',
      });
    },
    signOut(route){
        this.resetUser();
        localStorage.removeItem('usrlogin');
        localStorage.removeItem('usrpass');
        localStorage.removeItem('rememberme');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        this.$cms.auth.logout();
        this.$router.push(route);
        this.$q.notify({
          type: 'positive',
          message: 'Abgemeldet',
          caption: 'Sie wurden erfolgreich abgemeldet',
          // color: 'secondary'
        });
      },
  },
  setup(){
    const $store = useStore();
    return {
      user: $store.state.user,
    }
  }
});
</script>
