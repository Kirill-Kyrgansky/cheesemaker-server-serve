<template>
  <section class="section">
    <div class="container pickpoint-map-container">
      <div class="map" v-for="pickpoint in DELIVERY_POINTS" :key="pickpoint.id">
        <div class="map-border" v-if="pickpoint.active == true">
        <input
              type="checkbox"
              @click="сhangeVisibility(pickpoint.id, pickpoint.active)"
              v-model="pickpoint.active"
            />
          <div class="map-cart-text">
            <h3 class="title-3">{{ pickpoint.name }}</h3>
            <p class="paragraph margin-10-0">
              {{ pickpoint.address }}
            </p>
            <a href="tel:+79912105757" class="title-3">
              {{ pickpoint.phone }}
            </a>
            <p class="paragraph margin-10-0">
              {{ pickpoint.workhours }}
            </p>
          </div>
          <div
            style="position: relative; overflow: hidden; border-radius: 15px"
          >
            <a
              :href="pickpoint.linkYandex"
              style="color: #eee; font-size: 12px; position: absolute; top: 0px"
              >Славный сыровар</a
            ><a
              :href="pickpoint.linkPoint"
              style="
                color: #eee;
                font-size: 12px;
                position: absolute;
                top: 14px;
              "
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
        <div class="map-border" v-if="pickpoint.active == false && admin">
        <input
              type="checkbox"
              @click="сhangeVisibility(pickpoint.id, pickpoint.active)"
              v-model="pickpoint.active"
            />
          <div class="map-cart-text">
            <h3 class="title-3">{{ pickpoint.name }}</h3>
            <p class="paragraph margin-10-0">
              {{ pickpoint.address }}
            </p>
            <a href="tel:+79912105757" class="title-3">
              {{ pickpoint.phone }}
            </a>
            <p class="paragraph margin-10-0">
              {{ pickpoint.workhours }}
            </p>
          </div>
          <div
            style="position: relative; overflow: hidden; border-radius: 15px"
          >
            <a
              :href="pickpoint.linkYandex"
              style="color: #eee; font-size: 12px; position: absolute; top: 0px"
              >Славный сыровар</a
            ><a
              :href="pickpoint.linkPoint"
              style="
                color: #eee;
                font-size: 12px;
                position: absolute;
                top: 14px;
              "
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
import axios from 'axios';

export default {
  name: 'DeliveryPoint',
  data() {
    return{
      admin: true
    };
  },
  computed: {
    ...mapGetters(['DELIVERY_POINTS']),
  },
  mounted() {
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  methods: {
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
    сhangeVisibility(index, isActive) {
      let active = {
        active: !isActive,
      };
      axios
        .patch(`http://localhost:3000/pickpoint/${index}`, active)
        .then((res) => {
          location.reload(res);
          if (res == 404) {
            alert('Ошибка в работе сервера. Перезагрузите страницу');
          }
          console.log(res);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
  },
};
</script>
