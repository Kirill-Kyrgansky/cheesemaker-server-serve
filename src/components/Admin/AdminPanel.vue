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
      <div class="centered centered-vertical">
        <!-- <label for="description">
            <input
              type="number"
              id="description"
              class="input small-index"
              @click="productPrice = ''"
              placeholder="Цена"
              v-model="form.price"
              required
            />
          </label> -->
        <!-- <select
          class="input"
          name="list"
          v-model="form.unit"
          > 
            <option
              v-for="unit in units"
              :value="unit.name"
              :key="unit.id"
            >
              {{ unit.name }}
            </option>
          </select> -->
      </div>
      <!-- <p class="paragraph">Кол-во произведенного продука:</p> -->
      <!-- <label for="production-quantity">
          <input
            type="number"
            id="production-quantity"
            v-model="form.inStockQuantity"
            class="input"
            placeholder="Кол-во"
            required
          />
        </label> -->
      <select class="input" name="list">
        <!-- v-model="product.category" -->
        <option
          v-for="category in CATEGORY"
          :value="category.name"
          :key="category.id"
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
      units: [
        {
          id: 1,
          name: 'шт',
        },
        {
          id: 2,
          name: 'л',
        },
        {
          id: 3,
          name: 'кг',
        },
      ],
      // form:
      // {
      //   id: '',
      //   image: '',
      //   name: '',
      //   description: '',
      //   price: '',
      //   unit: 'шт',
      //   inStockQuantity: '',
      //   category: '',
      // },
      selectedUnit: 'шт',
    };
  },
  computed: {
    ...mapGetters(['CATEGORY']),
  },
  mounted() {
    this.form = this.product;
  },
  methods: {
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
        'Подтвердите удаление товара. Удаляйте товар, только в том случае если именно его не будет больше НИКОГДА, а не если когда он закончился!'
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
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.$emit('load', e.target.result);
      reader.readAsText(file);
    },
  },
};
</script>
