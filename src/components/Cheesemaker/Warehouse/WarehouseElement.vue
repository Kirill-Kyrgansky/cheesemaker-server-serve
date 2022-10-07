<template>
  <div class="warehouse-element-column">
    <p class="paragraph">{{ index }}</p>
  </div>
  <div class="warehouse-element-column">
    <p class="paragraph">{{ warehouse.product }}</p>
  </div>
  <div class="warehouse-element-column">
    <p class="paragraph">{{ warehouse.storage }}</p>
  </div>
  <div class="warehouse-element-column">
    <p class="paragraph">{{ warehouse.amount }} {{ warehouse.item_measure }}</p>
  </div>
  <div class="warehouse-element-column">
    <p class="paragraph">{{ warehouse.reserve }}</p>
  </div>
</template>

<script>
export default {
  name: "WarehouseElement",
  props: ['warehouse', 'index']
}
</script>

<style scoped>

</style>