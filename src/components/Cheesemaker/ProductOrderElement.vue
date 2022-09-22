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
        <div
        v-if="measure == 'кг' && content.status == 'в обработке'"
          class="order-title"
        >
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
        <div class="header-nav">
          <div class="footer" v-if="content.status == 'в обработке'">
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
            />
              <div class="v-select">
                <p
                  class="input delivery"
                  @click="areOptionsVisible = !areOptionsVisible"
                >
                  {{ selected }}
                </p>
                <div class="options cart-options" v-if="areOptionsVisible">
                  <p
                    class="paragraph input search-cart"
                    v-for="store in STORAGES"
                    :key="store.id"
                    @click="selectOption(store)"
                  >
                    {{ store.name }}
                  </p>
                </div>
              </div>
            </div>
      </div>
      <div v-if="content.status == 'отправлен'">
            <p class="input bold centered-horizontally">
              Товар подготовлен к отправке на точку выдачи!
            </p>
          </div>
          <div v-if="content.status == 'отменен'">
            <p class="cancellation bold centered-horizontally">
              Товар отменен сыроваром! Причина отмены: {{ content.comment }}
            </p>
          </div>
          <div v-if="content.status == 'выдан покупателю' || content.status == 'принят на точке продаж'">
            <p class="btn bold centered-horizontally">
              Товар принят на точку!
            </p>
          </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import config from '@/config.js';

export default {
  name: 'ProductOrderElement',
  data() {
    return {
      factWeight: 0,
      factPrice: 0,
      name: '',
      price: '',
      measure: '',
      areOptionsVisible: false,
      selected: 'Выберите склад',
      storage_id: '',
    };
  },
  props: ['content', 'index', 'order', 'orderRun'],
  mounted() {
    this.factWeight = this.content.amount
    this.getProductName();
    this.GET_CONTENTS_FROM_API();
    this.getPriceId();
    this.GET_STORAGES_FROM_API();
  },
  watch: {
    test() {
      if (this.orderRun == true) {
        orderRun();
      }
    },
  },
  methods: {
    selectOption(store) {
      this.selected = store.name;
      this.storage_id = store.id;
      this.areOptionsVisible = false;
    },
    ...mapActions(['GET_CONTENTS_FROM_API', 'GET_STORAGES_FROM_API']),
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
      if (this.storage_id == '') {
        alert('Выберете склад');
      } else {
      let date = new Date();
      this.CONTENTS[this.index].date = this.currentDate(date);
      this.CONTENTS[this.index].amount = this.factWeight;
      let contentsIndex = this.CONTENTS[this.index];
      contentsIndex.storage_id = this.storage_id
      contentsIndex.operation = 1
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
          console.log(req);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 500) {
            alert('На складе недостаточно продукта')
          } else {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          }
        });
      }
    },
    orderRun() {
      if (this.storage_id == '') {
        alert('Выберете склад');
      } else {
        let date = new Date();
        this.content.date = this.currentDate(date);
        this.content.status = 'отправлен';
        this.content.storage_id = this.storage_id;
        let content = this.content;
        content.operation = 1
        console.log(content);
        axios({
          method: 'PATCH',
          url: `${config.url}/contents/${this.content.id}`,
          data: content,
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
    },
    orderStop() {
      let comment = prompt('Введите причину отмены');
      if (comment == '') {
        alert('Вы не ввели причину отмены. Пожалуйста, повторите попытку');
      } else if (comment == null) {
      } else {
        let date = new Date();
        this.content.date = this.currentDate(date);
        this.content.status = 'отменен';
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
    ...mapGetters(['ORDERS', 'CONTENTS', 'DELIVERY_POINTS', 'STORAGES']),
  },
};
</script>
