<template>
  <section class="section">
    <div class="container warehouse">
      <div class="warehouse-element-column-first">
        <p class="paragraph bold">№</p>
      </div>
      <div class="warehouse-element-column-first">
        <p class="paragraph bold">Товар</p>
      </div>
      <div class="warehouse-element-column-first">
        <p class="paragraph bold">Имя склада</p>
      </div>
      <div class="warehouse-element-column-first">
        <p class="paragraph bold">Кол-во на складе</p>
      </div>
      <div class="warehouse-element-column-first">
        <p class="paragraph bold">Резерв</p>
      </div>
      <WarehouseElement
          v-for="(warehouse, index) in warehouses"
          :key="warehouse.id"
          :warehouse="warehouse"
          :index="index+1"
      />
    </div>
  </section>
</template>

<script>
import WarehouseElement from "@/components/Cheesemaker/Warehouse/WarehouseElement";
import axios from "axios";
import config from "@/config";

export default {
  name: "WarehouseWrap",
  data() {
    return {
      warehouses: {}
    }
  },
  components: {WarehouseElement},
  mounted() {
    this.getInfoWarehouses()
  },
  methods: {
    getInfoWarehouses() {
      axios({
        method: 'GET',
        url: `${config.url}/warehouses`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            console.log(req)
            this.warehouses = req.data
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
}
</script>
