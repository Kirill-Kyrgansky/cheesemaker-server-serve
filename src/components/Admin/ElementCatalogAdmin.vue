<template>
  <div class="catalog-items-admin">
    <div class="catalog-element">
      <img
        :src="product.image"
        :alt="product.name"
        class="catalog-element-img"
      />
      <div class="text-align-right">
        <h3 class="title-3 text-centered">{{ product.name }}</h3>
        <p class="paragraph text-centered">{{ product.description }}</p>
        <p class="paragraph-tiny bold margin-10-0 text-centered">
            {{ product.price }}&nbsp;₽&nbsp;/&nbsp;1 {{ product.unit }}.
          </p>  
      </div>
      <AdminPanel :product="product" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminPanel from './AdminPanel.vue';

export default {
  name: 'ElementCatalogAdmin',
  data() {
    return {
      productAmount: '',
      productАvailability: false,
      productId: '',
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
  components: {
    AdminPanel,
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORIES']),
  },
};
</script>
