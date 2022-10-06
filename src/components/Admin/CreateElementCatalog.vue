<template>
  <div class="catalog-element" id="admin">
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
        <p class="paragraph" v-if="fileUpload">Файл загружен</p>
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
      <div>
        <select class="input" v-model="selectCategory">
          <option disabled>Выбрать категорию</option>
          <option
              v-for="category in CATEGORY"
              :key="category.id"
              :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="text-centered">
        <button class="btn" @click="createProduct(productCreate)">
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import axios from 'axios';
import config from '@/config.js';

export default {
  name: 'CreateElementCatalog',
  data() {
    return {
      avatar: '',
      fileUpload: false,
      productCreate: {
        name: '',
        active: '0',
        comment: '',
        description: '',
        author_id: '1',
        image: '',
        ext: '',
      },
      selectCategory: 'Выбрать категорию',
      units: [
        {id: 1, name: 'шт'},
        {id: 2, name: 'л'},
        {id: 3, name: 'кг'},
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
    addFiles() {
      this.$refs.files.click()
    },
    handleImage(e) {
      const selectedImage = e.target.files[0]; // get first file
      this.createBase64Image(selectedImage);
      this.productCreate.ext = selectedImage.type.split('/')[1];
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
        const {image} = this;
        let base64 = image.split(',')[1];
        this.productCreate.image = base64;
        if (base64 != '') {
          this.fileUpload = true
        }
      };
      reader.readAsDataURL(fileObject);
    },
    createProduct() {
      let createNewProduct = this.productCreate;
      createNewProduct.category_id = this.selectCategory;
      axios({
        method: 'POST',
        url: `${config.url}/products`,
        data: createNewProduct,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
  },
};
</script>
