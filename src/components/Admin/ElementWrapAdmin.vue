<template>
  <div class="section wrap-cheesemaker">
    <ElementSortingAdmin
      :selected="selected"
      :options="CATEGORY"
      @select="sortByCategories"
    />
    <div class="container">
      <div class="catalog-items-admin">
        <CreateElementCatalog :product="product" />
        <ElementCatalogAdmin
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @addToCart="addToCart"
        />
        
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import CreateElementCatalog from './CreateElementCatalog';
import ElementCatalogAdmin from './ElementCatalogAdmin.vue';
import ElementSortingAdmin from '../Filter/ElementSortingAdmin.vue';

export default {
  name: 'ElementWrapAdmin',
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
    ElementCatalogAdmin,
    ElementSortingAdmin,
    CreateElementCatalog,
  },
  methods: {
    sortByCategories(category) {
      this.sortedProducts = [];
      const vm = this;
      this.PRODUCTS.map((item) => {
        if (item.category === category.name) {
          vm.sortedProducts.push(item);
        }
      });
      this.selected = category.name;
    },
    ...mapActions(['GET_PRODUCTS_FROM_API', 'ADD_TO_CART', 'GET_CATEGORY_FROM_API']),
    addToCart(data) {
      this.ADD_TO_CART(data);
    },
    optionSelect(CATEGORY) {
      this.selected = CATEGORY.name;
    },
  },
  mounted() {
    this.GET_PRODUCTS_FROM_API();
    this.GET_CATEGORY_FROM_API();
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORY', 'SEARCH_VALUE']),
    filteredProducts() {
      if (this.sortedProducts.length) {
        return this.sortedProducts;
      }
      return this.PRODUCTS;
    },
  },
};
</script>
