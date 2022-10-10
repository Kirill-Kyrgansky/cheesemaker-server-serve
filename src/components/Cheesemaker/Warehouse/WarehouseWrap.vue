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
            v-for="(warehouse, index) in sort"
            :key="warehouse.id"
            :warehouse="warehouse"
            :index="index"
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
      allWarehouses: {},
      sort: []
    }
  },
  components: {WarehouseElement},
  mounted() {
    this.getInfoWarehouses()
  },
  methods: {
    sortingWarehouse() {
      let sortedWarehouse = []
        for (let value of this.allWarehouses) {
        if (value.storage !=='Не выбранный склад') {
          sortedWarehouse.push(value)
        }
      }
      this.sort = sortedWarehouse
    },
    getInfoWarehouses() {
      axios({
        method: 'GET',
        url: `${config.url}/warehouses`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            this.allWarehouses = req.data
            this.sortingWarehouse()
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
}
</script>
