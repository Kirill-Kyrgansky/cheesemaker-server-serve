<template>
  <div class="product-order-element" v-if="content.status !== 'отменен'">
    <div>
      <div class="margin-10-0">
        <p class="paragraph-small">
          <span class="title-3 bold"> Название: </span>
          {{ content.product.name }}
        </p>
        <div v-if="content.comment !== 'Комментарий'">
          <p class="paragraph">
            <span class="title-3 bold"> Комментарий: </span>
          </p>
          <p class="paragraph-small">{{ content.comment }}</p>
        </div>
        <p class="paragraph-small">
          <span class="title-3 bold"> Кол-во: </span>
          {{ content.amount }}
          {{ content.price.item_measure }}
        </p>
        <p class="paragraph-small">
          <span class="title-3 bold"> Сумма: </span>
          {{ (content.price.item_price * content.amount).toFixed(2) }} ₽
        </p>
        <div class="order-title" v-if="measure === 'кг' && content.status === 'в обработке'">
          <div class="order-element margin-10-0"></div>
          <p class="paragraph">
            <span class="title-3 bold"> Фактический вес: </span>
            {{ factWeight }}
            кг
          </p>
          <p class="paragraph-small">
            <span class="title-3 bold"> Фактическая сумма: </span>
            {{ (price * factWeight).toFixed(2) }} ₽
          </p>
        </div>
      </div>
      <div v-if="content.status === 'подготовлен к отправке' && order.status !== 'отправлен на точку' ">
        <input type="button" class="btn" value="Товар принят в магазине" @click="orderRun"/>
        <input type="button" class="cancellation text-centered" value="Товар НЕ принят в магазине"
               @click="orderError"/>
      </div>
      <input type="button" class="btn" value="Товар выдан" @click="orderDone"
             v-if="content.status === 'прибыл в магазин'"/>
      <input type="button" class="cancellation text-centered" value="Покупатель отказался" @click="orderStop"
             v-if="content.status === 'прибыл в магазин'"/>
    </div>
    <p class="cancellation text-centered" v-if="content.status === 'отменен покупателем на точке'">
      Товар отменен
    </p>
    <p class="btn text-centered" v-if="content.status === 'товар выдан'">
      Товар выдан покупателю
    </p>
  </div>
</template>
<script>
import axios from 'axios';
import {mapActions, mapGetters} from 'vuex';
import config from '@/config.js';

export default {
  name: 'ProductOrderElementSeller',
  data() {
    return {
      factWeight: 0.01,
      factPrice: 0,
      name: '1',
      price: '',
      measure: '',
      comment: '',
    };
  },
  props: ['content', 'index', 'order'],
  methods: {
    ...mapActions(['GET_CONTENTS_FROM_API']),
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
    orderRun() {
      let date = new Date();
      let content = {};
      content.date = this.currentDate(date)
      content.order_id = this.content.order_id
      content.product_id = this.content.product.id
      content.manufacturer_id = this.content.manufacturer.id
      content.storage_id = this.content.storage.id
      content.amount = this.content.amount
      content.price_id = this.content.price.id
      content.status = 'прибыл в магазин'
      content.comment = this.content.comment
      content.author_id = this.content.author_id
      content.operation = this.content.operation
      content.operation = 0
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.content.id}`,
        data: content,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then(() => {
            this.content.status = 'прибыл в магазин';
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    orderError() {
      let comment = prompt('Укажите причину отказа');
      if (comment === '') {
        alert('Укажите причину!');
      } else if (comment == null) {
      } else {
        let date = new Date();
        this.content.date = this.currentDate(date);
        this.content.status = 'товар не принят на точке';
        this.content.comment = comment;
        let content = this.content;
        content.operation = 3
        axios({
          method: 'PATCH',
          url: `${config.url}/contents/${this.content.id}`,
          data: content,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
            .then(() => {
              alert('Вы отказались от товара.');
            })
            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    orderDone() {
      let date = new Date();
      this.content.date = this.currentDate(date);
      this.content.status = 'выдан покупателю';
      let content = this.content;
      content.operation = 2
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.content.id}`,
        data: content,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    orderStop() {
      let comment = prompt('Укажите причину отказа');
      if (comment !== '' && comment !== null) {
        let date = new Date();
        let content = {};
        content.date = this.currentDate(date)
        content.order_id = this.content.order_id
        content.product_id = this.content.product.id
        content.manufacturer_id = this.content.manufacturer.id
        content.storage_id = this.content.storage.id
        content.amount = this.content.amount
        content.price_id = this.content.price.id
        content.status = 'отменен покупателем на точке'
        content.comment = comment
        content.author_id = this.content.author_id
        content.operation = this.content.operation
        content.operation = 3
        this.content.date = this.currentDate(date);
        axios({
          method: 'PATCH',
          url: `${config.url}/contents/${this.content.id}`,
          data: content,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
            .then(() => {
              this.content.status = content.status
              this.content.comment = comment;
            })
            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      } else {
        alert('Введите причину отмены')
      }
    },
  },
  computed: {
    ...mapGetters(['ORDERS', 'CONTENTS', 'DELIVERY_POINTS']),
  },
};
</script>
