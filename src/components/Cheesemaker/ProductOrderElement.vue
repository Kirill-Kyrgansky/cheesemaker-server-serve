<template>
  <div class="product-order-element">
    <div>
      <div class="margin-10-0">
        <p class="paragraph-small">
          <span class="title-3 bold"> Название: </span>
          {{ name }}
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
          {{ measure }}
        </p>
        <p class="paragraph-small">
          <span class="title-3 bold"> Сумма: </span>
          {{ (price * content.amount).toFixed(2) }} ₽
        </p>
        <div v-if="measure === 'кг' && content.status === 'в обработке'" class="order-title">
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
        </div>
      </div>
      <div class="header-nav">
        <div class="footer" v-if="content.status === 'в обработке'">
          <input type="button" class="btn" value="Товар укомплектован" @click="productDone" />
          <input type="button" class="btn" value="С товаром возникли проблемы" @click="orderStop" />
          <div class="v-select">
            <p class="input delivery" @click="areOptionsVisible = !areOptionsVisible">
              {{ selected }}
            </p>
            <div class="options cart-options" v-if="areOptionsVisible">
              <p class="paragraph input search-cart" v-for="store in STORAGES" :key="store.id"
                @click="selectOption(store)">
                {{ store.name }}
              </p>
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
          Покупатель отказался от товара! Причина отказа: {{content.comment}}
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
      productRun: false
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
    // test() {
    //   if (this.orderRun == true) {
    //     orderRun();
    //   }
    // },
  },
  methods: {
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
    productCheck() {
      let name = this.name
      let storage = this.storage_id
      let storageName = this.selected
      let date = new Date();
      if (this.content.status !== 'подготовлен к отправке') {
        if (storage === 0) {
          alert(`Выберете склад для товара ${name}`);
        } else if (this.content.status === 'отменен') {
        }
        else {
          this.addedChangeWeight()
          this.content.date = this.currentDate(date);
          this.content.storage_id = storage;
          this.content.operation = 1
          let content = this.content;
          content.status = 'подготовлен к отправке';
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
                this.content.status = 'в обработке'
                alert(`Товара ${name} недостаточно на складе ${storageName}`)
              } else {
                console.log(error);
                alert('Ошибка в работе приложения. Обратитесь к администратору.');
              }
            });
        }
      }
    },
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
          console.log(product)
          return (this.name = product.data.name);
        })
        .catch((error) => {
          console.log(error)
          // alert('Ошибка в работе приложения. Обратитесь к администратору.');
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
          console.log(price)
          this.measure = price.data.item_measure;
          this.price = price.data.item_price;
        })
        .catch((error) => {
          console.log(error);
          // alert(error);
        });
    },
    addedChangeWeight() {
        let date = new Date();
        this.CONTENTS[this.index].date = this.currentDate(date);
        this.CONTENTS[this.index].amount = this.factWeight;
        let contentsIndex = this.CONTENTS[this.index];
        contentsIndex.storage_id = this.storage_id
        contentsIndex.operation = 0
        axios({
          method: 'PATCH',
          url: `${config.url}/contents/${this.CONTENTS[this.index].id}`,
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
    // changeOrderForStart() {
    //   let date = new Date();
    //   // this.orderRun = true;
    //   this.order.status = 'в работе';
    //   this.order.date = this.currentDate(date);
    //   this.order.delivery_date = this.currentDate(date);
    //   let order = this.order;
    //   axios({
    //     method: 'PATCH',
    //     url: `${config.url}/orders/${this.order.id}`,
    //     data: order,
    //     headers: {
    //       authorization: this.$cookies.get('authorization'),
    //     },
    //   })
    //     .then((order) => {
    //       console.log(order);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       alert('Ошибка в работе приложения. Обратитесь к администратору.');
    //     });
    // },
    productRun() {
      // let date = new Date();
      //   this.content.date = this.currentDate(date);
      //   this.content.status = 'отправлен';
      //   this.content.storage_id = this.storage_id;
      //   let content = this.content;
      //   content.operation = 1
      //   console.log(content);
      //   axios({
      //     method: 'PATCH',
      //     url: `${config.url}/contents/${this.content.id}`,
      //     data: content,
      //     headers: {
      //       authorization: this.$cookies.get('authorization'),
      //     },
      //   })
      //     .then((order) => {
      //       this.productRun == true      
      //     })
      //     .catch((error) => {
      //       if (error.response.status == 500) {
      //         alert(`Тована ${this.name} недостаточно на складе`)
      //       }
      //       console.log(error);
      //       alert('Ошибка в работе приложения. Обратитесь к администратору.');
      //     });
    },
    orderStop() {
      if (this.storage_id === '') {
        alert('Выберете склад.')
      } else {
        let comment = prompt('Введите причину отмены.');
        if (comment === '') {
          alert('Вы не ввели причину отмены. Пожалуйста, повторите попытку.');
        } else if (comment == null) {
        } else {
          let date = new Date();
          this.content.date = this.currentDate(date);
          this.content.status = 'отменен';
          this.content.comment = comment;
          let content = this.content;
          content.operation = 3
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
              alert('Товар убран из заказа.');
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
      if (this.storage_id === 0) {
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
  computed: {
    ...mapGetters(['ORDERS', 'CONTENTS', 'DELIVERY_POINTS', 'STORAGES']),
  },
};
</script>
