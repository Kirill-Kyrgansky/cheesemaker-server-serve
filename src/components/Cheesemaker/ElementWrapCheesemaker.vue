<template>
  <div >
    <div class="section wrap-cheesemaker">
      <ElementSorting
        :selected="selected"
        :options="CATEGORIES"
        @select="sortByCategories"
      />
      <div class="container">
        <div class="catalog-items-admin">
          <ElementCatalogCheesemaker
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @addToCart="addToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import ElementSorting from '../Filter/ElementSorting.vue';
import ElementCatalogCheesemaker from './ElementCatalogCheesemaker.vue';

export default {
  name: 'ElementWrapCheesemaker',
  data() {
    return {
      selected: 'Вся продукция',
      sortedProducts: [],
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
    ElementSorting,
    ElementCatalogCheesemaker,
  },
  methods: {
    ...mapActions(['GET_PRODUCTS_FROM_API', 'ADD_TO_CART', 'GET_CATEGORIES_FROM_API']),
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
    addToCart(data) {
      this.ADD_TO_CART(data);
    },
    optionSelect(CATEGORIES) {
      this.selected = CATEGORIES.text;
    },
  },
  mounted() {
    this.GET_PRODUCTS_FROM_API();
    this.GET_CATEGORIES_FROM_API();
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
