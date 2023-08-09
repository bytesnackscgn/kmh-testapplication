<template>
  <q-item
    clickable
    tag="span"
    @click="push(route)"
  >
    <q-item-section
      v-if="icon"
      class="q-pr-sm"
      avatar
    >
      <q-icon :name="icon" :class="( !isCurrent ? 'text-grey-inactive' : 'text-primary')"  />
    </q-item-section>

    <q-item-section>
      <q-item-label v-if="caption!=''">{{ title }}</q-item-label>
      <q-item-label v-if="caption!=''" caption>
        {{ caption }}
      </q-item-label>
      <span v-if="caption==''">{{ title }}</span>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

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
  watch : {
    '$route.path' (){
      this.isCurrent = this.$route.path == this.route ? true : false;
    }
  },
  data() {
    return {
      isCurrent: false,
    };
  },
  methods : {
    push : function(route){
      this.$router.push(route);
    }
  },
  created () {
    if(this.$route.path == this.route){
      this.isCurrent = true;
    }
  }
})
</script>
