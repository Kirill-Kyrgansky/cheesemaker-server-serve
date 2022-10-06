<template>
  <div class="catalog-items">
    <div class="catalog-element">
      <img
          :src="'http://shop-dev.zdmail.ru' + product.image_path.slice('2')"
          :alt="product.name"
          class="catalog-element-img"
      />
      <div class="text-align-right">
        <h3 class="title-3 text-centered">
          {{ product.name }}
        </h3>
      </div>
      <p class="paragraph-small margin-10-0 text-centered">
        Введите кол-во приготовленного продукта:
      </p>
      <input
          class="input"
          type="number"
          v-model="form.amount"
          step="0.1"
      />
      <div>
        <p
            class="paragraph input search-cart pointer"
            @click="isVisibleMeasureOptions = !isVisibleMeasureOptions"
        >
          {{ selectMeasure }}
        </p>
        <div class="options-cheesemaker" v-click-outside="onClickOutsideMenu" v-if="isVisibleMeasureOptions">
          <p
              class="paragraph input search-cart pointer"
              @click="createItemMeasure()"
          >
            Создать новую меру
          </p>
          <div
              class="pointer"
              v-for="prices in PRICES"
              :key="prices.id"

          >
            <p
                class="paragraph input search-cart"
                v-if="prices.product_id === product.id"
                @click="selectOption(prices)"
            >
              {{ prices.item_measure }}
            </p>
          </div>
        </div>
      </div>

      <p
          class="paragraph input search-cart pointer"
          @click="isVisibleStorages = !isVisibleStorages"
      >{{ selectStore }}</p>
      <div
          class="options-cheesemaker"
          v-click-outside="onClickOutsideMenu"
          v-if="isVisibleStorages"
      >
        <div
            class="pointer"
            v-for="storage in STORAGES"
            :key="storage.id"
        >
          <p
              class="paragraph input search-cart"
              v-if="storage.id !== 0"
              @click="selectStorage(storage)"
          >
            {{ storage.name }}
          </p>
        </div>
      </div>
      <button
          class="btn"
          @click="addProductProduced()"
      >
        Добавить
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import axios from 'axios';
import config from '@/config.js'
import vClickOutside from "click-outside-vue3";

export default {
  name: 'ElementCatalogCheesemaker',
  data() {
    return {
      isVisibleMeasureOptions: false,
      units: [
        {value: 0, text: 'шт'},
        {value: 1, text: 'кг'},
        {value: 2, text: 'л'},
      ],
      form: {
        amount: 0.01,
        manufacturer_id: 1,
        operation: 'приход',
      },
      selectStore: 'Выбрать склад',
      selectMeasure: 'Выберете меру',
      selectStoreId: null,
      isVisibleStorages: false
    };
  },
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
      price: {
        type: Object,
        default() {
          return {};
        },
      }
    },
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORY', 'STORAGES', 'PRICES']),
  },
  methods: {
    onClickOutsideMenu() {
      this.isVisibleMeasureOptions = false
      this.isVisibleStorages = false
    },
    createItemMeasure() {
      let sendNewMeasure = {}
      sendNewMeasure.item_measure = prompt('Введите новую меру товара.')
      if (sendNewMeasure.item_measure === null || sendNewMeasure.item_measure === '') {
      } else {
        sendNewMeasure.product_id = this.product.id
        sendNewMeasure.item_price = 0
        sendNewMeasure.active = 0
        sendNewMeasure.author_id = this.$cookies.get('id')
        axios
        ({
          method: 'POST',
          url: `${config.url}/prices`,
          data: sendNewMeasure,
          headers: {
            "authorization": this.$cookies.get('authorization')
          }
        })
            .then((res) => {
              alert('Новая мера добавлена.');
              location.reload()
            })
            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    selectOption(PRICES) {
      this.selectMeasure = PRICES.item_measure;
      this.isVisibleMeasureOptions = false
    },
    selectStorage(STORAGES) {
      this.selectStore = STORAGES.name;
      this.selectStoreId = STORAGES.id
      this.isVisibleStorages = false
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
    addProductProduced() {
      if (this.selectStore === 'Выбрать склад') {
        alert('Выберете склад!');
      } else {
        let date = new Date();
        this.form.date = this.currentDate(date);
        this.form.item_measure = this.selectMeasure
        this.form.product_id = this.product.id;
        this.form.storage_id = this.selectStoreId;
        this.form.author_id = this.$cookies.get('id')
        let content = this.form
        axios
        ({
          method: 'POST',
          url: `${config.url}/productions`,
          data: content,
          headers: {
            "authorization": this.$cookies.get('authorization')
          }
        })
            .then((res) => {
              alert('Продукт добавлен');
            })
            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    isEmpty() {
      return this.product.inStock !== 0;
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
};
</script>
