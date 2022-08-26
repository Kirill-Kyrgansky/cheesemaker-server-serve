<template>
  <section class="section">
    <div class="container">
      <div class="map">
        <div
          class="map-border"
          v-for="deliveryPoint in DELIVERY_POINTS"
          :key="deliveryPoint.id"
        >
          <div class="map-cart-text">
            <h3 class="title-3">{{ deliveryPoint.name }}</h3>
            <p class="paragraph margin-10-0">
              {{ deliveryPoint.address }}
            </p>
            <a
              href="tel:+79912105757"
              class="title-3"
            >
              {{ deliveryPoint.phoneTitle }}
            </a>
          </div>
          <div
            style="position: relative;
            overflow: hidden;
            border-radius: 15px"
          >
            <a
              :href="deliveryPoint.linkYandex"
              style="color: #eee;
              font-size: 12px;
              position: absolute;
              top: 0px"
              >Славный сыровар</a
            ><a
              :href="deliveryPoint.linkPoint"
              style="color: #eee;
              font-size: 12px;
              position: absolute;
              top: 14px"
              >Молочный магазин в Белгородской области</a
            ><iframe
              title="map"
              :src="deliveryPoint.mapFrame"
              height="250"
              frameborder="0"
              allowfullscreen="true"
              style="position: relative"
              class="box-shadow"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DeliveryPoint',
  computed: {
    ...mapGetters(['DELIVERY_POINTS']),
  },
  mounted() {
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  methods: {
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
  },
};
</script>
