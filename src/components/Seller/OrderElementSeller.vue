<template>
  <div class="order-element"
       v-if="order.status == 'отправлен на точку' || order.status == 'прибыл в магазин' || order.status == 'прибыл в магазин частично'">
    <div class="order-title">
      <p class="title-2">Дата заказа: {{ date }}</p>
      <p class="title-2">Номер заказа: {{ order.id }}</p>
      <p class="title-2">Статус: {{ order.status }}</p>
      <div class="border-line"></div>
    </div>
    <div v-for="(content, index) in CONTENTS" :key="content.id">
      <ProductOrderElementSeller :content="content" v-if="content.order_id === order.id" :index="index"
                                  :order="order"/>
    </div>
    <div v-for="pickpoint in DELIVERY_POINTS" :key="pickpoint.id">
      <p class="title-3" v-if="pickpoint.id === order.pickpoint_id">
        <span class="bold">Адрес доставки:</span>
        {{ pickpoint.name }}
      </p>
    </div>
    <div v-for="user in USERS" :key="user.id">
      <div v-if="user.id === order.user_id">
        <p class="title-3">
          <span class="bold">Ф.И.О.</span> {{ user.fio }}
        </p>
        <p class="title-3">
          <span class="bold">E-mail:</span> {{ user.email }}
        </p>
        <p class="title-3">
          <span class="bold">Телефон:</span> {{ user.phone }}
        </p>
      </div>
    </div>
    <div class="button-right">
      <button v-if="order.status === 'отправлен на точку'" @click="orderReceivedInFull" type="button"
              class="btn centered">
        Заказ принят в магазине полностью
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right"
             viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button v-if="order.status === 'отправлен на точку'" @click="orderReceivedInPart" type="button"
              class="cancellation centered">
        Заказ принят в магазине частично
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right"
             viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button v-if="order.status == 'прибыл в магазин' " @click="orderIssued" type="button" class="btn centered">
        Завершить заказ
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right"
             viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {mapActions, mapGetters} from 'vuex';
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
      usersInfo: {},
      cancellProduct: [],
      allProduct: [],
      doneProduct: [],
    };
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
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
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
    orderReceivedInPart() {
      let date = new Date();
      this.order.status = 'прибыл в магазин частично';
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
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
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
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yyyy = date.getFullYear();
      if (yyyy < 10) yyyy = '0' + yyyy;
      let hour = date.getHours()
      if (hour < 10) hour = '0' + hour
      let minutes = date.getMinutes()
      if (minutes < 10) minutes = '0' + minutes
      let sec = date.getSeconds()
      if (sec < 10) sec = '0' + sec
      return yyyy + '-' + mm + '-' + dd + 'T' + hour + ':' + minutes + ':' + sec;
    },
    orderReceivedInFull() {
      let date = new Date();
      let contents = this.CONTENTS
      for (let value of Object.values(contents)) {
        if (value.order_id === this.order.id) {
          value.date = this.currentDate(date);
          value.status = 'прибыл в магазин'
          value.operation = 0
          axios({
            method: 'PATCH',
            url: `${config.url}/contents/${value.id}`,
            data: value,
            headers: {
              authorization: this.$cookies.get('authorization'),
            },
          })
              .then((order) => {
                console.log(order);
              })
              .catch((error) => {
                console.log(error);
                alert('Ошибка в работе приложения. Обратитесь к администратору.');
              });
        }
      }
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
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },

    orderIssued() {
      let date = new Date();
      let contents = this.CONTENTS
      let allProducts = []
      let canceledProducts = []
      let globalValue = {}
      for (let value of Object.values(contents)) {
        globalValue = value
        if (value.order_id == this.order.id) {
          allProducts.push(value)
            if(value.status === 'отменен покупателем на точке') {
              canceledProducts.push(value)
            }
        }
      }
      if (allProducts.length === canceledProducts.length) {
        this.order.status = 'заказ отменен покупателем';
        this.order.date = this.currentDate(date)
        this.order.delivery_date = this.currentDate(date)
        axios({
              method: 'PATCH',
              url:`${config.url}/orders/${this.order.id}`,
              data: this.order,
              headers: {
                authorization: this.$cookies.get('authorization'),
              },
            }
        )
            .then((order) => {
              alert(`Заказ № ${this.order.id} отменен`);
            })
            .catch((error) => {
              this.order.status = 'в обработке'
              console.log(this.order);
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      } else {
        globalValue.date = date
        globalValue.status = 'заказ выдан'
        globalValue.operation = 2
        globalValue.date = this.currentDate(date);
        globalValue.delivery_date = this.currentDate(date);
        axios({
          method: 'PATCH',
          url: `${config.url}/contents/${globalValue.id}`,
          data: globalValue,
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
        console.log('bad')
      }
      if (this.order.status !== 'заказ отменен. покупатель отказался от товаров') {
        this.order.status = 'заказ выдан';
        this.order.date = this.currentDate(date)
        this.order.delivery_date = this.currentDate(date)
        axios({
              method: 'PATCH',
              url:`${config.url}/orders/${this.order.id}`,
              data: this.order,
              headers: {
                authorization: this.$cookies.get('authorization'),
              },
            }
        )
            .then((order) => {
              alert(`Заказ № ${this.order.id} успешно выдан`);
            })
            .catch((error) => {
              this.order.status = 'в обработке'
              console.log(this.order);
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
},
}
</script>
