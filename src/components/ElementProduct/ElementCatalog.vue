<template>
  <div class="catalog-items-products" v-if="this.product.inStockQuantity > 0">
    <!--product quantity checked-->
    <div class="catalog-element products">
      <div class="catalog-items-products-img">
      <img
        :src="product.image"
        :alt="product.name"
        class="catalog-element-img"
      />
      </div>
        <p class="paragraph bold text-centered">{{ product.name }}</p>
        <!-- <p class="paragraph text-centered">{{ product.description }}</p> -->
          <p class="paragraph-tiny bold margin-10-0">
            {{ product.price }}&nbsp;₽&nbsp;/&nbsp;1 {{ product.unit }}.
          </p>
          <button
            type="submit"
            @click="addToCart"
            class="btn centered"
          >
            В корзину
          </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ElementCatalog',
  data() {
    return {
      productAmount: '',
      productАvailability: false,
      units: [
        { value: 0, text: 'шт' },
        { value: 1, text: 'кг' },
        { value: 2, text: 'л' },
      ],
      productId: '',
      inStockQuantity: '',
      productInStock: false,
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
    },
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORIES']),
  },
  methods: {
    quantityProduct() {
      this.inStockQuantity = this.product.inStockQuantity;
      return this.inStockQuantity;
    },
    isEmpty() {
      if (this.product.inStock == 0) {
        return false;
      }
      return true;
    },
    addToCart() {
      this.$emit('addToCart', this.product);
    },
  },
};
</script>
