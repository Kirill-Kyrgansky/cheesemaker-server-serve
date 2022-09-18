<template>
  <div class="product-order-element">
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
        <div v-if="content.status == 'в обработке'">
          <input
            type="button"
            class="btn"
            value="Товар укомплектован"
            @click="orderRun"
          />
          <input
            type="button"
            class="btn"
            value="С товаром возникли проблемы"
            @click="orderStop"
          /><input
            type="text"
            class="input"
            placeholder="Введите описание проблемы"
            v-model="comment"
          />
        </div>
        <div v-if="content.status == 'отменен'">
          <p class="cancellation bold centered-horizontally">
            Товар отменен сыроваром! Причина отмены: {{ content.comment }}
          </p>
        </div>
        <div v-if="content.status == 'отправлен'">
          <p class="btn bold centered-horizontally">
            Товар подготовлен к отправке на точку выдачи!
          </p>
        </div>
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
          <input type="number" class="input" step="0.01" v-model="factWeight" />
          <input
            type="button"
            class="btn"
            value="Применить"
            @click="addedChangeWeight"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import config from '@/config.js'

export default {
  name: 'ProductOrderElement',
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
    addedChangeWeight() {
      let date = new Date();
      this.CONTENTS[this.index].date = this.currentDate(date);
      this.CONTENTS[this.index].amount = this.factWeight;
      let contentsIndex = this.CONTENTS[this.index];
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.CONTENTS[this.index].id}`,
        data: contentsIndex,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((req) => {
          alert('Вес товара успешно изменен');
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    orderRun() {
      let date = new Date();
      this.content.date = this.currentDate(date);
      this.content.status = 'отправлен';
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
          alert('Товар успешно укомплектован');
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    orderStop() {
      if (this.comment == '') {
        alert('Введите причину отмены');
      } else {
        let date = new Date();
        this.content.date = this.currentDate(date);
        this.content.status = 'отменен';
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
      }
    },
  },
  computed: {
    ...mapGetters(['ORDERS', 'CONTENTS', 'DELIVERY_POINTS']),
  },
};
</script>
