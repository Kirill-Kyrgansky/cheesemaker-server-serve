<template>
  <div class="product-order-element">
    <div>
      <div class="margin-10-0">
        <p class="paragraph-small">
          <span class="title-3 bold"> Название: </span>
          {{ content.product.name }}
        </p>
        <div v-if="content.comment !== ''">
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
        <div
            v-if="content.price.item_measure === 'кг' && content.status === 'в обработке'"
            class="order-title"
        >
          <p class="paragraph">
            <span class="title-3 bold"> Фактический вес: </span>
            {{ factWeight }}
            кг
          </p>
          <input
              type="number"
              class="input text-centered"
              step="0.1"
              min="0.1"
              v-model="factWeight"
          />
        </div>
      </div>
      <div class="header-nav">
        <div
            class="order-element-button"
            v-if="content.status === 'в обработке'"
        >
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
            <div
                class="options order-options"
                v-if="areOptionsVisible"
            >
              <div
                  class="paragraph pointer"
                  v-click-outside="closeStoreOutside"
                  @click="selectOption(store)"
                  v-for="store in STORAGES"
                  :key="store.id">
                <p
                    class="paragraph input search-cart"
                    v-if="store.name !== 'Не выбранный склад' && store.active !== 0"
                >
                  {{ store.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="content.status === 'подготовлен к отправке'">
        <p class="input bold centered-horizontally">
          Товар подготовлен к отправке на точку выдачи!
        </p>
      </div>
      <div v-if="content.status === 'отменен'">
        <p class="cancellation bold centered-horizontally">
          Товар отменен сыроваром! Причина отмены: {{ content.comment }}
        </p>
      </div>
      <div v-if="content.status === 'отменен покупателем на точке'">
        <p class="cancellation bold centered-horizontally">
          Покупатель отказался от товара! Причина отказа: {{ content.comment }}
        </p>
      </div>
      <div v-if="content.status === 'заказ выдан' || content.status === 'прибыл в магазин'">
        <p class="btn bold centered-horizontally">
          Товар принят на точку!
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {mapGetters, mapActions} from 'vuex';
import config from '@/config.js';
import vClickOutside from 'click-outside-vue3';

export default {
  name: 'ProductOrderElement',
  data() {
    return {
      factWeight: 0,
      factPrice: 0,
      price: '',
      measure: '',
      areOptionsVisible: false,
      selected: 'Выберите склад',
      storage_id: '',
      productRun: false
    };
  },
  props: ['content', 'index', 'order', 'orderRun'],
  mounted() {
    this.factWeight = this.content.amount
    this.GET_STORAGES_FROM_API();
  },
  computed: {
    ...mapGetters(['ORDERS', 'CONTENTS', 'DELIVERY_POINTS', 'STORAGES']),
  },
  methods: {
    closeStoreOutside() {
      this.areOptionsVisible = false
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
    productCheck() {
      let name = this.content.product.name
      let storage = Number(this.storage_id)
      let storageName = this.selected
      let date = new Date();
      if (this.content.status === 'в обработке') {
        if (this.content.storage.id === 0 && storage === 0) {
          alert(`Выберете склад для товара ${name}`);
        } else {
          this.addedChangeWeight()
          let contentsIndex = {}
          contentsIndex.date = this.currentDate(date);
          contentsIndex.order_id = this.order.id
          contentsIndex.product_id = this.content.product.id
          contentsIndex.amount = this.factWeight;
          contentsIndex.storage_id = Number(this.storage_id)
          contentsIndex.operation = 1
          contentsIndex.manufacturer_id = this.content.manufacturer.id
          contentsIndex.price_id = this.content.price.id
          contentsIndex.author_id = this.$cookies.get('id')
          contentsIndex.status = 'подготовлен к отправке';
          this.content.status = 'подготовлен к отправке'
          this.content.storage_id = storage;
          axios({
            method: 'PATCH',
            url: `${config.url}/contents/${this.content.id}`,
            data: contentsIndex,
            headers: {
              authorization: this.$cookies.get('authorization'),
            },
          })
              .catch((error) => {
                if (error.response.status === 500) {
                  console.log(error)
                  this.content.status = 'в обработке'
                  alert(`Товара ${name} недостаточно на складе ${storageName}`)
                  location.reload()
                } else {
                  console.log(error);
                  alert('Ошибка в работе приложения. Обратитесь к администратору.');
                }
              });
        }
      } else {
        alert('Товары уже подготовлены к отправке.')
      }
    },
    selectOption(store) {
      this.selected = store.name;
      this.storage_id = store.id;
      this.areOptionsVisible = false;
    },
    ...mapActions(['GET_CONTENTS_FROM_API', 'GET_STORAGES_FROM_API']),
    addedChangeWeight() {
      let date = new Date();
      let contentsIndex = {}
      contentsIndex.date = this.currentDate(date);
      contentsIndex.order_id = this.order.id
      contentsIndex.product_id = this.content.product.id
      contentsIndex.amount = this.factWeight;
      contentsIndex.storage_id = Number(this.storage_id)
      contentsIndex.operation = 0
      contentsIndex.manufacturer_id = this.content.manufacturer.id
      contentsIndex.price_id = this.content.price.id
      contentsIndex.status = 'подготовлен к отправке';
      this.content.status = 'подготовлен к отправке'
      contentsIndex.author_id = this.$cookies.get('id')
      axios({
        method: 'PATCH',
        url: `${config.url}/contents/${this.content.id}`,
        data: contentsIndex,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .catch((error) => {
            if (error.response.status === 500) {
              console.log(error)
            } else {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            }
          });
    },
    orderStop() {
      if (this.content.storage.id === '0') {
        alert('Выберете склад.')
      } else {
        let comment = prompt('Введите причину отмены.');
        if (comment === '') {
          alert('Вы не ввели причину отмены. Пожалуйста, повторите попытку.');
        } else if (comment == null) {
        } else {
          let contentsIndex = {}
          let date = new Date();
          if (comment === 'None') {
            return comment = ''
          }
          contentsIndex.date = this.currentDate(date);
          contentsIndex.order_id = this.order.id
          contentsIndex.product_id = this.content.product.id
          contentsIndex.amount = this.factWeight;
          contentsIndex.storage_id = Number(this.storage_id)
          contentsIndex.operation = 0
          contentsIndex.manufacturer_id = this.content.manufacturer.id
          contentsIndex.price_id = this.content.price.id
          contentsIndex.author_id = this.content.author_id
          contentsIndex.status = 'отменен';
          this.content.date = this.currentDate(date);
          this.content.status = 'отменен';
          contentsIndex.comment = comment;
          console.log(contentsIndex);
          axios({
            method: 'PATCH',
            url: `${config.url}/contents/${this.content.id}`,
            data: contentsIndex,
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
    },
    productStart() {
      this.productDone()
    },
    productDone() {
      let name = this.name
      if (this.content.storage.id === '0') {
        alert(`Выберете склад для продукта ${name}`);
      } else {
        if (this.order.status === 'подготовлен к отправке') {
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
              .catch((error) => {
                if (error.response.status === 500) {
                  console.log(error)
                  alert(`Тована ${this.name} недостаточно на складе`)
                }
                console.log(error);
                alert('Ошибка в работе приложения. Обратитесь к администратору.');
              });
        } else {
        }
      }
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
};
</script>
