<template>
  <div class="section wrap-cheesemaker">
    <ElementSorting
      :selected="selected"
      :options="CATEGORIES"
      @select="sortByCategories"
    />
    <div class="container">
      <div class="catalog-items">
        <ElementCatalog
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @addToCart="addToCart"
        />
      </div>
      
      <transition name="fade">
        <div class="successfully" v-if="isVisible">
          <p class="title-3 text-centered">Товар успешно добавлен в корзину!</p>
        </div>
        
      </transition>
    </div>
  </div><div class="arrow-bottom-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="70"
        height="70"
        class="arrow-bottom button-on"
        viewBox="0 0 16 16"
        @click="scrollTop"
      >
        <path
          d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"
        />
      </svg>
      </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import ElementCatalog from './ElementCatalog.vue';
import ElementSorting from '../Filter/ElementSorting.vue';

export default {
  name: 'ElementWrap',
  data() {
    return {
      selected: 'Вся продукция',
      sortedProducts: [],
      isVisible: false,
    };
  },
  props: {
    adminLogin: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    ElementCatalog,
    ElementSorting,
  },
  methods: {
    scrollTop() {
      window.scrollTo(top, 0);
    },
    sortByCategories(category) {
      this.sortedProducts = [];
      const vm = this;
      this.PRODUCTS.map((item) => {
        if (item.category === category.text) {
          vm.sortedProducts.push(item);
        }
      });
      this.selected = category.text;
    },
    ...mapActions(['GET_PRODUCTS_FROM_API', 'ADD_TO_CART']),
    addToCart(data) {
      this.isVisible = !this.isVisible;
      setTimeout(() => {
        this.isVisible = !this.isVisible;
      }, 1000);
      this.ADD_TO_CART(data);
    },
    optionSelect(CATEGORIES) {
      this.selected = CATEGORIES.text;
    },
    sortedProductsBySearchValue(value) {
      if (value) {
        this.sortedProducts = this.sortedProducts.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.sortedProducts = this.PRODUCTS;
      }
    },
  },
  mounted() {
    this.GET_PRODUCTS_FROM_API();
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORIES', 'SEARCH_VALUE']),
    filteredProducts() {
      if (this.sortedProducts.length) {
        return this.sortedProducts;
      }
      return this.PRODUCTS;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>
