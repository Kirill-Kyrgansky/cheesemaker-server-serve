<template>
  <section class="section">
    <div class="container">
      <div class="map">
        <div
          class="map-border"
          v-for="pickpoint in DELIVERY_POINTS"
          :key="pickpoint.id"
        >
          <div class="map-cart-text">
            <h3 class="title-3">{{ pickpoint.name }}</h3>
            <p class="paragraph margin-10-0">
              {{ pickpoint.address }}
            </p>
            <a
              href="tel:+79912105757"
              class="title-3"
            >
              {{ pickpoint.phone }}
            </a>
             <p class="paragraph margin-10-0">
              {{ pickpoint.workhours }}
            </p>
          </div>
          <div
            style="position: relative;
            overflow: hidden;
            border-radius: 15px"
          >
            <a
              :href="pickpoint.linkYandex"
              style="color: #eee;
              font-size: 12px;
              position: absolute;
              top: 0px"
              >Славный сыровар</a
            ><a
              :href="pickpoint.linkPoint"
              style="color: #eee;
              font-size: 12px;
              position: absolute;
              top: 14px"
              >Молочный магазин в Белгородской области</a
            ><iframe
              title="map"
              :src="pickpoint.mapFrame"
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
