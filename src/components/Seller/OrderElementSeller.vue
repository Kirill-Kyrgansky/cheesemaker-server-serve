<template>
  <div class="order-element" v-if="order.status == 'отправлен на точку' || order.status =='прибыл в магазин'">
    <div class="order-title">
      <p class="title-2">Дата заказа: {{ date }}</p>
      <p class="title-2">Номер заказа: {{ order.id }}</p>
      <div class="border-line"></div>
    </div>
    <div v-for="(content, index) in CONTENTS" :key="content.id">
      <ProductOrderElementSeller
        :content="content"
        v-if="content.order_id == order.id"
        :index="index"
        :orderRun="orderRun"
      />
    </div> 
    <div v-for="pickpoint in DELIVERY_POINTS" :key="pickpoint.id">
    <p class="title-3" v-if="pickpoint.id == order.pickpoint_id">
      <span class="bold">Адрес доставки:</span>
      {{ pickpoint.name }}
    </p>
  </div>
    <div v-for="user in USERS" :key="user.id">
      <div v-if="user.id == order.user_id">
    <p class="title-3">
      <span class="bold">Ф.И.О.</span> {{  user.fio }}
    </p>
    <p class="title-3">
      <span class="bold">E-mail:</span> {{  user.email }}
    </p>
    <p class="title-3">
      <span class="bold">Телефон:</span> {{ user.phone }}
    </p>
  </div>
  </div>
    <div class="button-right">
      <button
      v-if="order.status == 'отправлен на точку'"
        @click="orderSentToThePoint"
        type="button"
        class="btn centered"
      >
        Заказ принят в магазине
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-bar-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
          />
        </svg>
      </button>
      <button
      v-if="order.status == 'прибыл в магазин'"
        @click="orderIssued"
        type="button"
        class="btn centered"
      >
        Заказ выдан
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-bar-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import ProductOrderElementSeller from './ProductOrderElementSeller.vue';
import config from '@/config.js'

export default {
  name: 'OrderElementSeller',
  data() {
    return {
      newOrder: {},
      orderRun: false,
      comment: '',
      products: {},
      usersInfo: {}
    };
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
    // products: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
    index: {
      type: Number,
    },
  },
  components: {
    ProductOrderElementSeller,
  },
  computed: {
    ...mapGetters(['CONTENTS', 'USERS', 'DELIVERY_POINTS']),
    date() {
      let date = this.order.order_date.split('T')[0].split('-');
      return date[2] + '-' + date[1] + '-' + date[0];
    },
  },
  mounted() {
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  methods: {
    ...mapActions([ 'GET_DELIVERY_POINTS_FROM_API']),
    getUserInfo() {
      axios({
        method: 'GET',
        url: `${config.url}/users/info/`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((order) => {
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    currentDate(date) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      var yyyy = date.getFullYear();
      if (yyyy < 10) yyyy = '0' + yyyy;
      return yyyy + '-' + mm + '-' + dd;
    },
    orderSentToThePoint() {
      let date = new Date();
      this.orderRun = true;
      this.order.status = 'прибыл в магазин';
      this.order.date = this.currentDate(date);
      this.order.delivery_date = this.currentDate(date);
      let order = this.order;
      axios({
        method: 'PATCH',
        url: `${config.url}/orders/${this.order.id}`,
        data: order,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((order) => {
          // alert('Заказ принят.')
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    orderIssued() {
      let date = new Date();
      this.order.status = 'заказ выдан';
      this.order.date = this.currentDate(date);
      this.order.delivery_date = this.currentDate(date);
      axios({
        method: 'PATCH',
        url: `${config.url}/orders/${this.order.id}`,
        data: this.order,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((order) => {
          alert('Заказ успешно отменен.');
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
  },
};
</script>
