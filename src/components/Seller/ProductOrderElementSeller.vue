<template>
  <div
    class="product-order-element"
    v-if="content.status == 'отправлен' || 'принят на точке продаж'"
  >
    <div>
      <div class="margin-10-0">
        <p class="paragraph-small">
          <span class="title-3 bold"> Название: </span>
          {{ name }}
        </p>
        <div v-if="content.comment != 'Комментарий'">
          <p class="paragraph">
            <span class="title-3 bold"> Комментарий: </span>
          </p>
          <p class="paragraph-small">{{ content.comment }}</p>
        </div>
        <p class="paragraph-small">
          <span class="title-3 bold"> Кол-во: </span>
          {{ content.amount }}
          {{ measure }}
        </p>
        <p class="paragraph-small">
          <span class="title-3 bold"> Сумма: </span>
          {{ (price * content.amount).toFixed(2) }} ₽
        </p>
        <div
          class="order-title"
          v-if="measure == 'кг' && content.status == 'в обработке'"
        >
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
      <input
        type="button"
        class="btn"
        value="Товар принят в магазине"
        @click="orderRun"
        v-if="content.status == 'отправлен'"
      />
      <input
        type="button"
        class="cancellation text-centered"
        value="Товар НЕ принят в магазине"
        @click="orderError"
        v-if="content.status == 'отправлен'"
      />
      <input
        type="button "
        class="cancellation text-centered"
        value="Покупатель отказался"
        @click="orderStop"
        v-if="content.status == 'принят на точке продаж'"
      />
      <input
        type="button"
        class="btn"
        value="Товар выдан"
        @click="orderDone"
        v-if="content.status == 'принят на точке продаж'"
      />
    </div>
    <p
      class="cancellation text-centered"
      v-if="content.status == 'отменен покупателем на точке'"
    >
      Товар отменен
    </p>
    <p class="btn text-centered" v-if="content.status == 'выдан покупателю'">
      Товар выдан покупателю
    </p>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
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
  props: ['content', 'index', 'order', 'orderRun'],
  mounted() {
    this.getProductName();
    this.GET_CONTENTS_FROM_API();
    this.getPriceId();
  },
  watch: {
    test() {
      if (this.orderRun == true) {
        orderRun();
      }
    },
  },
  methods: {
    ...mapActions(['GET_CONTENTS_FROM_API']),
    getProductName() {
      axios({
        method: 'GET',
        url: `${config.url}/products/${this.content.product_id}`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((product) => {
          return (this.name = product.data.name);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    getPriceId() {
      axios({
        method: 'GET',
        url: `${config.url}/prices/${this.content.price_id}`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((price) => {
          this.measure = price.data.item_measure;
          this.price = price.data.item_price;
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
    orderRun() {
      let date = new Date();
      this.content.date = this.currentDate(date);
      this.content.status = 'принят на точке продаж';
      let content = this.content;
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.content.id}`,
        data: content,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((order) => {
          alert('Товар принят.');
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    orderError() {
      let comment = prompt('Укажите причину отказа');
      if (comment == '') {
        alert('Укажите причину!');
      } else if (comment == null) {
      } else {
        let date = new Date();
        this.content.date = this.currentDate(date);
        this.content.status = 'товар не принят на точке';
        this.content.comment = comment;
        let content = this.content;
        axios({
          method: 'PATCH',
          url: `${config.url}/contents/${this.content.id}`,
          data: content,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
          .then((order) => {
            alert('Вы успешно отказались от товара.');
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
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.content.id}`,
        data: content,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((order) => {})
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    orderStop() {
      let date = new Date();
      this.content.date = this.currentDate(date);
      this.content.status = 'отменен покупателем на точке';
      this.content.comment = this.comment;
      let content = this.content;
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.content.id}`,
        data: content,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((order) => {
          alert('Товар убран из заказа');
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
  },
  computed: {
    ...mapGetters(['ORDERS', 'CONTENTS', 'DELIVERY_POINTS']),
  },
};
</script>
