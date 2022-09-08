<template>
  <div class="admin-panel">
    <div class="catalog-element-wrap text-centered">
      <label class="text-reader">
        <input type="file" @change="handleImage" accept="image/*" />
      </label>
      <div class="catalog-element-text">
        <label for="name">
          <input
            type="text"
            id="name"
            v-model="product.name"
            class="input"
            placeholder="Название"
            required
          />
        </label>
        <textarea
          placeholder="Описание"
          type="text"
          class="input"
          v-model="product.description"
          required
        ></textarea>
      </div>

      <select class="input" v-model="selectCategory">
        <option disabled>{{product.category_id}}</option>
        <option
          v-for="category in CATEGORY"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>

      <div class="text-centered">
        <button class="btn" @click="ApplyProductChanges(product.id)">
          Применить изменения
        </button>
        <button
          class="btn"
          @click="isVisibleProduct(product.id)"
          v-if="product.active"
        >
          Удалить
        </button>
        <button
          class="btn"
          @click="isVisibleProduct(product.id)"
          v-if="!product.active"
        >
          Показать
        </button>
      </div>
      <button
        class="btn"
        @click="priceChange = !priceChange"
      >
        Настройка цен
      </button>
      <div class="border-no-absolutle margin-10-0" v-if="priceChange">
        <div v-for="price in PRICES" :key="price.id">
          <div v-if="price.product_id == product.id" >
            <div class="cart-element-wrap" >
            <input
              type="number"
              id="description"
              class="input small-index"
              placeholder="price.item_price"
              v-model="price.item_price"
              v-if="price.visible"
              required
            />
            <p class="paragraph" v-if="price.visible">&nbsp;₽ | 1 &nbsp;</p>
            <select v-model="price.item_measure" class="input" v-if="price.visible">
              <option>кг</option>
              <option>л</option>
              <option>шт</option>
            </select>
            <button class="btn" @click="chagePriceChanges(price)" v-if="price.visible">
              Применить
            </button>
            </div>
          </div>
          <div v-if="price.product_id == product.id" class="cart-element-wrap">
            <input
              type="checkbox"
              true-value="1"
              false-value="0"
              v-model="price.active"
              @click="ApplyPriceChanges(price.active, price, price.id)"
              v-if="!price.visible"
            />
            <p class="paragraph" v-if="!price.visible">
              {{ price.item_price }}&nbsp;₽ | 1 &nbsp; {{ price.item_measure }}
            </p>
            <button class="btn" @click="price.visible = !price.visible" v-if="!price.visible">
              Изменить
            </button>
          </div>
        </div>
        <div class="centered pickpoint-map-container">
          <label for="description">
            <input
              type="number"
              id="description"
              class="input small-index"
              placeholder="Цена"
              v-model="item_price"
              required
            />
          </label>
          <p class="paragraph margin-0-10">| 1</p>
          <select v-model="item_measure" class="input">
            <option>кг</option>
            <option>л</option>
            <option>шт</option>
          </select>
          <button
            class="btn"
            @click="addPriceProduct(item_measure, item_price)"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'AdminPanel',
  props: {
    adminLogin: {
      type: Object,
      default() {
        return {};
      },
    },
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      avatar: '',
      check: [],
      item_price: '',
      item_measure: 'кг',
      priceChange: false,
      isActivePrice: true,
      selectCategory: 'Выбрать категорию'
    };
  },
  computed: {
    ...mapGetters(['PRICES','CATEGORY']),
  },
  mounted() {
    this.form = this.product;
    this.isActivePrice = this.PRICES.active;
  },
  methods: {
    chagePriceChanges(price) {
      axios
      .patch(`http://172.16.0.179/api/prices/${price.id}`, price)
      .then((res) => {
        alert('Цена успешно изменена')
        price.visible = !price.visible
      })
      .catch((error) => {
        console.log(error);
      })
    },
    addPriceProduct(item_measure, item_price) {
      let formAddPrice = {};
      formAddPrice.item_measure = item_measure;
      formAddPrice.item_price = item_price;
      formAddPrice.product_id = this.product.id;
      formAddPrice.active = 0;
      formAddPrice.author_id = 1;
      axios
        .post('http://172.16.0.179/api/prices/', formAddPrice)
        .then((res) => {
          location.reload(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleImage(e) {
      const selectedImage = e.target.files[0]; // get first file
      this.createBase64Image(selectedImage);
      let type = selectedImage.type.split('/')[1];
      this.product.ext = type;
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
        const { image } = this;
        let base64 = image.split(',')[1];
        this.product.image = base64;
      };
      reader.readAsDataURL(fileObject);
    },
    isVisibleProduct(index) {
      let proof = confirm(
        'Отключить видимость товара'
      );
      if (proof == true) {
        this.product.active = !this.product.active;
        console.log(this.product);
        console.log(index);
        axios
          .patch(`http://172.16.0.179/api/products/${index}`, this.product)
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
          });
      }
      return;
    },
    ApplyProductChanges(index) {
      axios
        .patch(`http://172.16.0.179/api/products/${index}`, this.product)
        .then((res) => {
          location.reload(res);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
    ApplyPriceChanges(isActive, price, index) {
      price.active = Number(!isActive);
      console.log(price);
      axios
        .patch(`http://172.16.0.179/api/prices/${index}`, price)
        .then((res) => {
          alert('Изменения применены');
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.$emit('load', e.target.result);
      reader.readAsText(file);
    },
  },
};
</script>
