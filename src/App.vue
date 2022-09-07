<template>
  <div class="app">
    <ElementHeader />
    <div class="wrap">
      <SucsessMessage />
      <div class="section">
        <div class="searching-wrap">
          <h1 name="title" class="title-2 text-centered border-wrap">
            Скидка для сотрудников АПХ «Зелёная Долина» 10%
          </h1>
        </div>
      </div>
      <router-view :cart_data="CART"/>
    </div>
    <ElementFooter />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import ElementHeader from './components/Page/ElementHeader.vue';
import ElementFooter from './components/Page/ElementFooter.vue';

export default {
  name: 'App',
  components: {
    ElementHeader,
    ElementFooter,
  },
  data() {
    return {
      sucsessMessage: true,
      adminLogin: false,
    };
  },
  computed: {
    ...mapGetters(['CART']),
  },
  methods: {
    adminMenu() {
      this.adminLogin = !this.adminLogin;
    },
    ...mapActions(['ADD_TO-CART']),
  },
};
</script>
