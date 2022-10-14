<template>
  <div class="admin-panel">
    <div class="catalog-element-wrap text-centered">
      <label class="text-reader">
        <input
            type="file"
            ref="files"
            id="files"
            @change="handleImage"
            accept="image/*"
        />
        <input
            type="button"
            class="btn"
            value="Загрузить изображение"
            @click="addFiles()"
        />
        <p
            class="paragraph"
            v-if="fileUpload"
        >
          Файл загружен
        </p>
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
      <p class="paragraph">Категория:</p>
      <p
          class="paragraph input search-cart pointer"
          @click="isVisibleCategory = !isVisibleCategory"
          v-if="!isVisibleCategory"
      >
        {{ selectCategory.name }}
      </p>
      <div v-if="isVisibleCategory">
        <div class="pointer" v-for="category in CATEGORY" :key="category.id">
          <p
              class="paragraph input search-cart"
              @click="selectOption(category)"
          >
            {{ category.name }}
          </p>
        </div>
      </div>

      <div class="text-centered">
        <button class="btn" @click="ApplyProductChanges(product.id)">
          Применить изменения
        </button>
        <button
            class="btn"
            @click="isVisibleProduct(product.id)"
            v-if="product.active"
        >
          Скрыть
        </button>
        <button
            class="btn"
            @click="isVisibleProduct(product.id)"
            v-if="!product.active"
        >
          Показать
        </button>
      </div>
      <button class="btn" @click="priceChange = !priceChange">
        Настройка цен
      </button>
      <div class="border-no-absolutle margin-10-0" v-if="priceChange">
        <div v-for="price in PRICES" :key="price.id">
          <div v-if="price.product_id === product.id">
            <div class="cart-element-wrap">
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
              <select
                  v-model="price.item_measure"
                  class="input"
                  v-if="price.visible"
              >
                <option>кг</option>
                <option>л</option>
                <option>шт</option>
              </select>
              <button
                  class="btn"
                  @click="changePriceChanges(price)"
                  v-if="price.visible"
              >
                Применить
              </button>
            </div>
          </div>
          <div v-if="price.product_id === product.id" class="cart-element-wrap">
            <input
                type="checkbox"
                true-value="1"
                false-value="0"
                v-model="price.active"
                @click="ApplyPriceChanges(price.active, price, price.id)"
                v-if="!price.visible"
            />
            <div class="width-70">
            <p class="paragraph" v-if="!price.visible">
              {{ price.item_price }}&nbsp;₽
            </p>
            </div>
            <div class="width-70">
            <p class="paragraph" v-if="!price.visible">
              1 {{ price.item_measure }}
            </p>
            </div>
            <button
                class="btn"
                @click="price.visible = !price.visible"
                v-if="!price.visible"
            >
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
          <p class="paragraph margin-0-10"> 1</p>
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
import {mapGetters} from 'vuex';
import axios from 'axios';
import config from '@/config.js'

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
      selectCategory: {name: 'Все категории', id: ''},
      isVisibleCategory: false,
      fileUpload: false

    };
  },
  computed: {
    ...mapGetters(['PRICES', 'CATEGORY']),
  },
  mounted() {
    // this.form = this.product;
    this.isActivePrice = this.PRICES.active;  //изменение видимости цены
    this.nameSelect(); //установка имени категории
  },
  methods: {
    selectOption(category) { //выподающий список категорий
      this.selectCategory.name = category.name
      this.selectCategory.id = category.id
      this.isVisibleCategory = !this.isVisibleCategory
    },
    addFiles() { //загрузка изображения на сервер
      this.$refs.files.click()
    },
    nameSelect() { //получение имен категорий
      axios({
        method: 'GET',
        url: `${config.url}/categories/${this.product.category_id}`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            return (this.selectCategory.name = res.data.name);
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    changePriceChanges(price) {
      let sendPriceChanges = {}
      sendPriceChanges.author_id = this.$cookies.get('id')
      sendPriceChanges.active = price.active
      sendPriceChanges.item_measure = price.item_measure
      sendPriceChanges.product_id = price.product_id
      sendPriceChanges.item_price = price.item_price
      axios({
        method: 'PATCH',
        url: `${config.url}/prices/${price.id}`,
        data: sendPriceChanges,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            alert('Цена успешно изменена');
            price.visible = !price.visible;

          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    addPriceProduct(item_measure, item_price) { //добавить цену к продукту
      let formAddPrice = {};
      formAddPrice.item_measure = item_measure;
      formAddPrice.item_price = item_price;
      formAddPrice.product_id = this.product.id;
      formAddPrice.active = 1;
      formAddPrice.author_id = 1;
      axios({
        method: 'POST',
        url: `${config.url}/prices/`,
        data: formAddPrice,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    handleImage(e) {    //подготовка изображения для отправки на сервер
      const selectedImage = e.target.files[0]; // get first file
      this.createBase64Image(selectedImage);
      this.product.ext = selectedImage.type.split('/')[1];
    },
    createBase64Image(fileObject) {   //конвертирование в base64
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
        const {image} = this;
        this.product.image = image.split(',')[1];

        if (this.product.image != '') {
          this.fileUpload = true
        }
      };
      reader.readAsDataURL(fileObject);
    },
    isVisibleProduct(index) { //настройка видимости товара
      let proof = confirm('Изменить видимость товара?');
      if (proof === true) {
        this.product.active = !this.product.active;
        axios({
          method: 'PATCH',
          url: `${config.url}/products/${index}`,
          data: this.product,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
            .then((res) => {
              location.reload(res);
            })
            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    ApplyProductChanges(index) { //отправить изменения продукта в backend
      if (this.selectCategory.id !== '') {
        this.product.category_id = this.selectCategory.id;
      } else {
      }
      let product = this.product;
      console.log(product.category_id)
      axios({
        method: 'PATCH',
        url: `${config.url}/products/${index}`,
        data: product,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            location.reload(res);
            this.product.category_id = this.selectCategory.id;
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    ApplyPriceChanges(isActive, price, index) { //отправить изменения цены продукта в backend
      price.active = Number(!isActive);
      axios({
        method: 'PATCH',
        url: `${config.url}/prices/${index}`,
        data: price,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            alert('Изменения применены');
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
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
