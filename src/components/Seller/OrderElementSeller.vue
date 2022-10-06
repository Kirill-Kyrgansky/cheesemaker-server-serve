<template>
  <div class="order-element">
    <div
        class="order-finished"
        v-if="order.status !== 'отправлен на точку' && order.status !== 'прибыл в магазин' && order.status !== 'прибыл в магазин частично'"
    >
      <p class="title-1">Заказ закрыт.</p>
    </div>
    <div class="order-title">
      <div class="order-info">
        <div>
          <p class="title-2">Номер заказа: {{ order.id }}</p>
          <p class="title-2">Дата заказа: {{ date }}</p>
          <p class="title-2">Статус: {{ order.status }}</p>
        </div>
        <div>
          <p class="title-3">
            <span class="bold">Ф.И.О.</span> {{ order.author.fio }}
          </p>
          <p class="title-3">
            <span class="bold">E-mail:</span> {{ order.author.email }}
          </p>
          <p class="title-3">
            <span class="bold">Телефон:</span> {{ order.author.phone }}
          </p>
          <p class="title-3">
            <span class="bold">Адрес доставки:</span>
            {{ order.pickpoint.name }}
          </p>
        </div>
      </div>
      <div class="border-line"></div>
    </div>
    <div
        v-for="content in order.content"
        :key="content.id"
    >
      <ProductOrderElementSeller
          ref="ProductOrderElementSeller"
          :content="content"
          :order="order"
      />
    </div>
    <div>

    </div>
    <div class="button-right">
      <button
          v-if="order.status === 'отправлен на точку'"
          @click="orderReceivedInFull"
          type="button"
          class="btn centered"
      >
        Заказ принят в магазине полностью
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
              d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button
          v-if="order.status === 'отправлен на точку'"
          @click="orderReceivedInPart"
          type="button"
          class="cancellation centered"
      >
        Заказ принят в магазине частично
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
              d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button
          v-if="order.status === 'прибыл в магазин' || order.status === 'прибыл в магазин частично' "
          @click="orderIssued"
          type="button"
          class="btn centered">
        Завершить заказ
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
      cancelProduct: [],
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
      return date[2] + '.' + date[1] + '.' + date[0];
    },
  },
  methods: {
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
    orderReceivedInPart() {
      let date = new Date();
      let nowDate = this.currentDate(date)
      let order = {}
      order.delivery_date = this.order.delivery_date.split('T')[0]
      order.comment = this.order.comment
      order.date = this.order.date
      order.payment_type = this.order.payment_type
      order.pickpoint_id = this.order.pickpoint.id
      order.user_id = this.order.user_id
      order.author_id = this.order.author.id
      order.date = nowDate
      order.status = 'прибыл в магазин частично'
      axios({
        method: 'PATCH',
        url: `${config.url}/orders/${this.order.id}`,
        data: order,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then(() => {
            this.order.status = 'прибыл в магазин частично'
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
      return yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minutes + ':' + sec;
    },
    orderReceivedInFull() {
      let date = new Date();
      let nowDate = this.currentDate(date)
      let contentsLength = Object.keys(this.order.content).length;
      for (let i = 0; i < contentsLength; i++) {
        this.$refs.ProductOrderElementSeller[i].orderRun()
      }
      let order = {}
      order.delivery_date = this.order.delivery_date.split('T')[0]
      order.comment = this.order.comment
      order.date = this.order.date
      order.payment_type = this.order.payment_type
      order.pickpoint_id = this.order.pickpoint.id
      order.user_id = this.order.user_id
      order.author_id = this.order.author.id
      order.date = nowDate
      order.status = 'прибыл в магазин'
      axios({
        method: 'PATCH',
        url: `${config.url}/orders/${this.order.id}`,
        data: order,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then(() => {
            this.order.status = 'прибыл в магазин';
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    orderIssued() {
      let date = new Date();
      let allProducts = []
      let canceledProducts = []
      let globalValue = {}
      for (let value of Object.values(this.order.content)) {
        globalValue = value
        allProducts.push(value)
        if (value.status === 'отменен покупателем на точке') {
          canceledProducts.push(value)
        } else if (value.status !== 'отменен покупателем на точке' && value.status !== 'отменен') {
          let order = {}
          order.date = date
          order.order_id = globalValue.order_id
          order.product_id = globalValue.product.id
          order.manufacturer_id = globalValue.manufacturer.id
          order.storage_id = globalValue.storage.id
          order.amount = globalValue.amount
          order.price_id = globalValue.price.id
          order.status = 'заказ выдан'
          order.comment = globalValue.comment
          order.author_id = globalValue.author_id
          order.operation = 2
          axios({
            method: 'PATCH',
            url: `${config.url}/contents/${globalValue.id}`,
            data: order,
            headers: {
              authorization: this.$cookies.get('authorization'),
            },
          })
              .then(() => {
                globalValue.status = 'заказ выдан'
              })
              .catch((error) => {
                console.log(error);
                alert('Ошибка в работе приложения. Обратитесь к администратору.');
              });
        }
      }
      if (allProducts.length === canceledProducts.length) {
        let date = new Date();
        let nowDate = this.currentDate(date)
        let order = {}
        order.delivery_date = this.order.delivery_date.split('T')[0]
        order.comment = this.order.comment
        order.date = this.order.date
        order.payment_type = this.order.payment_type
        order.pickpoint_id = this.order.pickpoint.id
        order.user_id = this.order.user_id
        order.author_id = this.order.author.id
        order.date = nowDate
        order.status = 'заказ отменен покупателем'
        axios({
              method: 'PATCH',
              url: `${config.url}/orders/${this.order.id}`,
              data: order,
              headers: {
                authorization: this.$cookies.get('authorization'),
              },
            }
        )
            .then(() => {
              this.order.status = 'заказ отменен покупателем';
              alert(`Заказ № ${this.order.id} отменен`);
            })
            .catch((error) => {
              this.order.status = 'в обработке'
              console.log(this.order);
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      } else {
        if (this.order.status !== 'заказ отменен. покупатель отказался от товаров') {
          let date = new Date();
          let nowDate = this.currentDate(date)
          let order = {}
          order.delivery_date = this.order.delivery_date.split('T')[0]
          order.comment = this.order.comment
          order.date = this.order.date
          order.payment_type = this.order.payment_type
          order.pickpoint_id = this.order.pickpoint.id
          order.user_id = this.order.user_id
          order.author_id = this.order.author.id
          order.date = nowDate
          order.status = 'заказ выдан'

          axios({
                method: 'PATCH',
                url: `${config.url}/orders/${this.order.id}`,
                data: order,
                headers: {
                  authorization: this.$cookies.get('authorization'),
                },
              }
          )
              .then(() => {
                alert(`Заказ № ${this.order.id} успешно выдан`);
                this.order.status = 'заказ выдан';
              })
              .catch((error) => {
                this.order.status = 'в обработке'
                console.log(this.order);
                console.log(error);
                alert('Ошибка в работе приложения. Обратитесь к администратору.');
              });
        }
      }
    },
  },
}
</script>
