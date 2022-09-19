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
    <section class="sectio">
      <div class="container">
        <transition name="fade">
          <div class="successfully width-60vw" v-if="cookie">
            <p class="title-3 text-centered">Этот сайт использует файлы cookie для хранения данных. Продолжая использовать сайт, вы даете свое согласие на работу с этими файлами</p>
            <img src="/allImage/Icons/cross.svg" class="header-link-icon pointer" @click="closeCookiePopUp">
          </div>
        </transition>
      </div>
    </section>
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
      cookie: false
    };
  },
  computed: {
    ...mapGetters(['CART']),
  },
  mounted() {
    this.cookieMessage()
  },
  methods: {
    closeCookiePopUp() {
      this.cookie = false
    },
    cookieMessage () {
      if (this.$cookies.get('cookies') == null) {
        this.cookieSucsess()
        this.$cookies.set('cookies', '1', '3y')
      } else if (!this.$cookies.get('fio') ) {
        this.cookie = false
      } else if (this.$cookies.get('cookies') == 1) {
        this.cookie = false
      }
    },
    cookieSucsess() {
      this.cookie = true
    },
    adminMenu() {
      this.adminLogin = !this.adminLogin;
    },
    ...mapActions(['ADD_TO-CART']),
  },
};
</script>
