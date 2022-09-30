<template>
<div class="personal-cabinet">
  <div>
    <div v-if="activeOrders" >
      <div class="cart margin-10-0"
           v-if="(orders.status !== 'заказ выдан' && orders.status !== 'отменен')">
        <p class="paragraph">Заказ №: {{ orders.id }}</p>
        <p class="paragraph" v-if="orders.status == 'отменен'">
          Статус:
          <span class="text-red">{{ orders.status }}</span>
        </p>
        <p class="paragraph" v-if="orders.status != 'отменен'">
          Статус: {{ orders.status }}
        </p>
        <p v-if="orders.comment != 'None'">
          {{ 'Комментарии: ' + orders.comment }}

        </p>
        <p class="paragraph">
          Дата заказа:
          {{
            orders.order_date.split('T')[0].split('-')[2] +
            '.' +
            orders.order_date.split('T')[0].split('-')[1] +
            '.' +
            orders.order_date.split('T')[0].split('-')[0]
          }}
        </p>
        <p class="paragraph">
          Примерная дата доставки:
          {{
            orders.delivery_date.split('T')[0].split('-')[2] +
            '.' +
            orders.delivery_date.split('T')[0].split('-')[1] +
            '.' +
            orders.delivery_date.split('T')[0].split('-')[0]
          }}
        </p>
          <InfoPersonOrder
          :orders.id="orders"
          />
        <!--                        <button @click="logOut" class="btn">Отменить заказ</button>-->
      </div>
    </div>
    <div v-if="historyOrders">
      <div class="cart margin-10-0"
           v-if="(orders.status === 'заказ выдан' || orders.status === 'отменен')">
        <p class="paragraph">Заказ №: {{ orders.id }}</p>
        <p class="paragraph" v-if="orders.status == 'отменен'">
          Статус:
          <span class="text-red">{{ orders.status }}</span>
        </p>
        <p class="paragraph" v-if="orders.status != 'отменен'">
          Статус: {{ orders.status }}
        </p>
        <p v-if="orders.comment != 'None'">
          {{ 'Комментарии: ' + orders.comment }}
        </p>
        <p class="paragraph">
          Дата заказа:
          {{
            orders.order_date.split('T')[0].split('-')[2] +
            '.' +
            orders.order_date.split('T')[0].split('-')[1] +
            '.' +
            orders.order_date.split('T')[0].split('-')[0]
          }}
        </p>
        <p class="paragraph">
          Примерная дата доставки:
          {{
            orders.delivery_date.split('T')[0].split('-')[2] +
            '.' +
            orders.delivery_date.split('T')[0].split('-')[1] +
            '.' +
            orders.delivery_date.split('T')[0].split('-')[0]
          }}
        </p>
        <InfoPersonOrder
            :orders.id="orders"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>

import InfoPersonOrder from "@/components/Page/InfoPersonOrder";
export default {
  name: "personalСabinet",
  components: {InfoPersonOrder},
  props: ['orders', 'activeOrders', 'historyOrders']
}
</script>

<style scoped>

</style>