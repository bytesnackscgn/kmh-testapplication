<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-drawer
        id="main-menu"
        v-model="leftDrawerOpen"
        show-if-above
        :mini="miniState"
        :width="200"
        :breakpoint="768"
        bordered
        class="bg-white"
      >
          <q-scroll-area class="fit">
            <q-list>
              <q-item-label v-show="!miniState" header class="text-grey-8">
                <q-img
                  src="/mitarbeiter/logo.png"
                  loading="lazy"
                  spinner-color="white"
                  style="max-width: 150px"
                />
              </q-item-label>
              <q-item-label
                v-show="miniState"
                header
                class="flex-center"
                :class="[miniState ? 'flex' : '']"
                style="height: 84px"
              >
                <q-img
                  src="https://kmh-gmbh.com/wp-content/uploads/2022/04/kmh-logo-blau.png"
                  loading="lazy"
                  spinner-color="white"
                  style="max-width: 32px"
                />
              </q-item-label>

              <div
                id="username"
                class="q-my-md q-px-sm text-center text-weight-bold"
              >
                {{ user.cu.first_name }} {{ user.cu.last_name }}
              </div>

              <div
                v-for="(item, index) in routes"
                v-bind:key="`mainroute-${index}`"
              >
                <RouterLink
                  :title="item.title"
                  :icon="item.icon"
                  :route="item.path"
                />
              </div>

              <q-item class="q-pa-none flex justify-end items-center">
                <q-btn
                  id="open-main-slidemenu"
                  class="q-ml-auto w-75 float-right bg-brand-grey brr-top-0 brr-bottom-0 brl-top-50 brl-bottom-50 text-left"
                  :class="!miniState ? 'q-pl-sm' : ''"
                  flat
                  dense
                  text-color="white"
                  :icon="miniState ? 'arrow_forward_ios' : 'arrow_back_ios'"
                  aria-label="Menu"
                  @click="miniState = !miniState"
                />
              </q-item>
              <Logout
                class=""
                title="Abmelden"
                icon="logout"
                route="/auth/login"
              />
            </q-list>
          </q-scroll-area>
      </q-drawer>
      <div class="">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import Logout from 'components/Logout.vue';
import RouterLink from 'components/RouterLink.vue';

export default defineComponent({
  name: 'CMSLayout',
  components: {
    RouterLink,
    Logout,
  },
  data() {
    return {
      routes: [],
      miniState: false,
    };
  },
  methods: {},
  async created() {
    try{
      const token = localStorage.getItem('auth_token');
      if (token != null && typeof token != 'undefined') {
        await this.$cms.auth.static(token);
      }
    }catch(e){
      this.$router.push({ path: '/auth/login',query : { removeToken : true } });
    }

    this.routes = this.$constants.routes.mainMenu.filter((el) =>
      this.$userdata.isPermittedView(el.path, this.user.cu.permitted_views)
    );
    
    let editors = await this.$cms.users.readByQuery({ 
      fields: ['id', 'first_name', 'last_name', 'role'],
      limit: -1,
    });

    if (Array.isArray(editors.data)) {
      this.$store.commit('options/users', editors.data);
    }

    const roles = await this.$cms.roles.getAll();
	
    if (Array.isArray(roles.data)) {
      this.$store.commit('options/roles', roles.data);
    }

  },
  setup() {
    const leftDrawerOpen = ref(false);
    const $store = useStore();
    return {
      user: $store.state.user,
      leftDrawerOpen,
    };
  },
});
</script>
