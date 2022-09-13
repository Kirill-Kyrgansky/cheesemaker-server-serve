<template>
  <div class="product-order-element">
    <div>
      <div class="margin-10-0">
        <p class="paragraph-small">
          <span class="title-3 bold"> Название: </span>
          {{ name }}
        </p>
        <div>
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
          {{ price * content.amount }} ₽
        </p>
        <input type="button" class="btn" value="Товар отправлен" @click="orderRun">
        <input type="button" class="btn" value="С товаром возникли проблемы" @click="orderStop"><input
            type="text"
            class="input"
            placeholder="Введите описание проблемы"
            v-model="comment"
            />

        <div class="order-title" v-if="measure == 'кг'">
          <div class="order-element margin-10-0"></div>
          <p class="paragraph">
            <span class="title-3 bold" > Фактический вес: </span>
            {{factWeight}}
            кг
          </p>
          <p class="paragraph-small">
            <span class="title-3 bold"> Фактическая сумма: </span>
            {{(price * factWeight).toFixed(2)}} ₽
          </p>
          <input
            type="number"
            class="input"
            step="0.01"
            v-model="factWeight"
            />
            <input type="button" class="btn" value="Применить" @click="addedChangeWeight">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductOrderElement',
  data() {
    return {
      factWeight: 0.01,
      factPrice: 0,
      name: '1',
      price: '',
      measure: '',
      comment: ''
    };
  },
  props: ['content', 'index', 'order','orderRun'],
  mounted() {
    this.getProductName();
    this.GET_CONTENTS_FROM_API();
    this.getPriceId();

  },
  watch: {
    test () {
      if (this.orderRun == true) {
      orderRun()
    } 
    }
  },
  methods: {
    ...mapActions(['GET_CONTENTS_FROM_API']),
    getProductName() {
      axios
        .get(`http://shop-dev.zdmail.ru/api/products/${this.content.product_id}`)
        .then((product) => {
          return (this.name = product.data.name);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
            // console.log(error);
        });
    },
    getPriceId() {
      axios
        .get(`http://shop-dev.zdmail.ru/api/prices/${this.content.price_id}`)
        .then((price) => {
          this.measure = price.data.item_measure;
          this.price = price.data.item_price;
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
            // console.log(error);
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
      this.CONTENTS[this.index].amount = this.factWeight
      console.log(this.CONTENTS[this.index]);
      axios
        .patch (`http://shop-dev.zdmail.ru/api/contents/${this.CONTENTS[this.index].id}`, this.CONTENTS[this.index])
        .then((req) => {
          alert('Вес товара успешно изменен')
          console.log(req);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
        })
    },
    orderRun() {
      let date = new Date();
      this.content.date = this.currentDate(date);
        this.content.status = 'отправлен'
        axios
      .patch(`http://shop-dev.zdmail.ru/api/contents/${this.content.id}`, this.content)
      .then((order) => {
        alert('Товар успешно укомплектован');
        console.log(order);
      })
      .catch((error) => {
        alert('Ошибка в работе приложения. Обратитесь к администратору.');
            // console.log(error);
      })
    }, 
    orderStop() {
      if (this.comment == '') {
        alert('Введите причину отмены')
      } else {
      let date = new Date();
      this.content.date = this.currentDate(date);
        this.content.status = 'проблемы'
        this.content.comment = this.comment
        axios
      .patch(`http://shop-dev.zdmail.ru/api/contents/${this.content.id}`, this.content)
      .then((order) => {
        alert('Товар убран из заказа');
      })
      .catch((error) => {
        alert('Ошибка в работе приложения. Обратитесь к администратору.');
            // console.log(error);
      })
    }
    }, 
  },
  computed: {
    ...mapGetters(['ORDERS', 'CONTENTS']),
    
    // computedFactPrice() {
    //   if (NaN) {
    //     return '0';
    //   }
    //   return (this.product.price * this.factWeight).toFixed(2);
    // },
  },
};
</script>
