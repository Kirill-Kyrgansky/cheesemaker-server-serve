<template>
  <div class="catalog-items-admin">
    <div class="catalog-element">
      <p
          class="title-2 cancellation"
          v-if="!product.active"
      >
        Отключен
      </p>
      <img
          :src="'http://shop-dev.zdmail.ru' + product.image_path.slice('2')"
          :alt="product.name"
          class="catalog-element-img"
      />
      <div class="text-align-right">
        <h3 class="title-3 text-centered">{{ product.name }}</h3>
        <p class="paragraph text-centered">{{ product.description }}</p>
      </div>
      <AdminPanel :product="product"/>
    </div>
  </div>
</template>

<script>
import AdminPanel from './AdminPanel.vue';

export default {
  name: 'ElementCatalogAdmin',
  props: {
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
};
</script>
