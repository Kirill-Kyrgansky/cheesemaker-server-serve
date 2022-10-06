<template>
  <div>
  <div class="border-surround filter admin-panel">
    <div class="categories" v-if="!categories">
      <h3 class="title-3 text-centered">Категории</h3>
      <div >
        <div class="options-admin">
          <h3 class="title-3 text-centered">Активные категории</h3>
          <div v-for="option in CATEGORY" :key="option.id">
            <div class="input search" v-if="option.active == true">
              <p href="#" class="paragraph" @click="selectOption(option)">
                {{ option.name }}
              </p>
              <div class="centered">
                <img
                  @click="changeCategory(option.id, option.name)"
                  src="/allImage/Icons/Edit.svg"
                  class="img-question"
                />
                <input
                  true-value="1"
                  false-value="0"
                  type="checkbox"
                  v-model="option.active"
                  @click="
                    сhangeVisibility(option.id, option.active, option.name)
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <div class="options-admin margin-10-0">
          <h3 class="title-3 text-centered">Неактивные категории</h3>
          <div v-for="option in CATEGORY" :key="option.id">
            <div class="input search" v-if="option.active == false">
              <p href="#" class="paragraph" @click="selectOption(option)">
                {{ option.name }}
              </p>
              <div class="centered">
                <img
                  @click="changeCategory(option.id, option.name)"
                  src="/allImage/Icons/Edit.svg"
                  class="img-question"
                />
                <input
                  true-value="1"
                  false-value="0"
                  type="checkbox"
                  v-model="option.active"
                  @click="
                    сhangeVisibility(option.id, option.active, option.name)
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-panel margin-10-0">
        <p class="paragraph-small">{{ searchValue }}</p>
        <p class="paragraph-small margin-10-0">Добавить категорию:</p>
        <input class="input" type="text" v-model="formCategories.name" />
        <button class="btn" @click="addCategories()">Создать</button>
      </div>
    </div>
    <CreateStorage />
    <button class="btn" @click="openCategories" v-if="categories">
      Открыть редактирование категорий
    </button>
    <button class="btn" @click="openCategories" v-if="!categories">
      Закрыть редактирование категорий
    </button>
  </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import CreateStorage from '../Admin/CreateStorage.vue';
import config from '@/config.js'

export default {
  NAME: 'ElementSortingAdmin',
  data() {
    return {
      areOptionsVisible: false,
      searchValue: '',
      formCategories: {
        active: true,
        comment: 'NoComment',
        name: '',
      },
      categories: true,
    };
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    selected: {
      type: String,
      default: '',
    },
    adminLogin: {},
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { CreateStorage },
  computed: {
    ...mapGetters(['CATEGORY', 'SEARCH_VALUE']),
  },
  methods: {
    openCategories() {
      window.scrollTo(top, 140);
      this.categories = !this.categories
    },
    ...mapActions(['GET_SEARCH_VALUE_TO_VUEX']),
    сhangeVisibility(index, isActive, name) {
      let sendForm = {
        active: Number(!isActive),
        name: name,
        author_id: 1,
      };
      axios({
        method: 'PATCH',
        url: `${config.url}/categories/${index}`,
        data: sendForm,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((res) => {
          location.reload(res);
          if (res == 404) {
            alert('Ошибка в работе сервера. Перезагрузите страницу');
          }
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    changeCategory(index, name) {
      let newName = prompt('Введите новое имя категории.', name);
      if (newName != null) {
        let sendForm = {
          name: newName,
          author_id: 1,
        };
        axios({
          method: 'PATCH',
          url: `${config.url}/categories/${index}`,
          data: sendForm,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
          .then((res) => {
            location.reload(res);
            if (res == 404) {
              alert('Ошибка в работе сервера. Перезагрузите страницу');
            }
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
      }
    },
    addCategories() {
      this.formCategories.author_id = 1;
      let formCategories = this.formCategories;
      if (this.formCategories.name.length === 0) {
        alert('Ошибка, пустая строка. Введите название новой категории');
      } else {
        axios({
          method: 'POST',
          url: `${config.url}/categories`,
          data: formCategories,
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
    search(value) {
      this.GET_SEARCH_VALUE_TO_VUEX(value);
    },
    hideShow() {
      if (this.areOptionsVisible == true) {
        this.areOptionsVisible == false;
      } else {
        this.areOptionsVisible == true;
      }
    },
    selectOption(option) {
      this.$emit('select', option);
      this.areOptionsVisible = false;
    },
    hideSelect() {
      this.areOptionsVisible = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.hideSelect.bind(this), true);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.hideSelect);
  },
};
</script>
