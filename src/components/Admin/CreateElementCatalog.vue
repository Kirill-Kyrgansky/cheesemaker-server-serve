<template>
  <div class="catalog-element" id="admin">
    <div class="catalog-element-wrap text-centered">
        <label class="text-reader">
          <input type="file" @change="handleImage" accept="image/*"/>
        </label>
        <div class="catalog-element-text">
          <label for="name">
            <input
              type="text"
              id="name"
              v-model="productCreate.name"
              class="input"
              placeholder="Название"
              required
            />
          </label>
          <textarea
            placeholder="Описание"
            type="text"
            class="input"
            v-model="productCreate.description"
            required
          ></textarea>
        </div>
        <!-- <div class="centered centered-vertical">
            <input
              type="number"
              id="description"
              class="input small-index"
              @click="productPrice = ''"
              v-model="productCreate.price"
              placeholder="Цена"
              required
            />
          <select  class="input" name="list"  v-model="productCreate.unit"> 
          <option v-for="unit in units" :value="unit.name" :key="unit.id"
          >
            {{ unit.name }}
          </option>
        </select>
        </div> -->
        <!-- <p class="paragraph">Кол-во произведенного продука:</p>
        <label for="production-quantity">
          <input
            type="number"
            @click="productQuantity = ''"
            id="production-quantity"
            v-model="form.inStockQuantity"
            class="input"
            placeholder="Кол-во"
            required
          />
        </label> -->
        <div >
        <select
          class="input"
          name="list"
          v-model="productCreate.category"
          >
          <option
          v-for="category in CATEGORY"
          :value="category.name"
          :key="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        </div>
        <div class="text-centered">
          <button class="btn" @click="createProduct(productCreate)">Создать</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'CreateElementCatalog',
  data() {
    return {
      avatar: '',
      productCreate:
      {
        name: '',
        active: "0",
        image: '',
        category_id: "5",
        comment: 'None',
        description: '',
        author_id: "1",
        image: '',
        ext: ''
      },
      units: [
        { id: 1, name: 'шт' },
        { id: 2, name: 'л' },
        { id: 3, name: 'кг' },
      ],
    };
  },
  props: {
    adminLogin: {},
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(['CATEGORY']),
  },
    methods: {
      createProduct() {
        console.log(this.productCreate);
      },
    handleImage(e) {
      const selectedImage = e.target.files[0]; // get first file
      this.createBase64Image(selectedImage);
      let type = selectedImage.type.split('/')[1]
      this.productCreate.ext = type
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = (e) => {
      this.image = e.target.result;
      const { image } = this;
      let base64 = image.split(',')[1]
      this.productCreate.image = base64
      };
      reader.readAsDataURL(fileObject);
    },
  },
};
</script>



      // if (formArray.includes('') === true) {
      //   alert('Заполните пожалуйста все поля.');
      //   console.log(formArray);
      // } else if (this.form.category === 'Вся продукция') {
      //   alert('Выберите категорию.');
      // } else {}