<template>
  <div class="report">
    <div class="cart-done" v-if="reportDateVisible">
      <div class="cart cart-sucsess order-title">
        <div class="position-end">
          <img
              src="/allImage/Icons/cross.svg"
              class="header-link-icon pointer close"
              @click="reportVisible"
              alt="close"/>
        </div>
        <input class="btn" type="button" @click="report('dsf')" value="Отчет по производству">
        <input class="btn" type="button" @click="report('hello')" value="Отчет по заказам">
        <Datepicker
            v-model="date"
            ref="Datepicker"
            locale="ru"
            :presetRanges="presetRanges"
            :monthChangeOnScroll="false"
            :enableTimePicker="false"
            placeholder="Выберете промежуток"
            :maxDate="new Date()"
            teleportCenter
            range
            required
        >
          <template #yearly="{ label, range, presetDateRange }">
            <span @click="presetDateRange(range)">{{ label }}</span>
          </template>
          <template #action-select class="dp-inline">
            <p class="custom-select" @click="closeMenu">Закрыть</p>
            <p class="custom-select" @click="selectDate">Выбрать</p>
          </template>
        </Datepicker>
      </div>
    </div>

    <div class="report-button">
      <input class="btn" type="button" @click="reportVisible" value="Отчеты">
    </div>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ref} from 'vue';
import {endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths} from 'date-fns';
import axios from "axios";
import config from "@/config";

export default {
  name: 'Report',
  components: {Datepicker},
  computed: {
    setup(){
    const date = ref();
    const presetRanges = ref([
      {label: 'Сегодня', range: [new Date(), new Date()]},
      {label: 'Этот месяц', range: [startOfMonth(new Date()), endOfMonth(new Date())]},
      {
        label: 'Прошлый месяц',
        range: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
      },
      {label: 'Этот год', range: [startOfYear(new Date()), endOfYear(new Date())]},
    ]);
    const format = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `Selected date is ${day}/${month}/${year}`;
    }
    return {
      // date,
      // presetRanges,
      format
    }
    }
  },
  data() {
    return {
      reportDateVisible: false,
      date: null
    }
  },
  methods: {
    report(url) {
      let firstDate = this.date[0]
      let secondDate = this.date[1]
      let sendData = {}
      sendData.start_date = firstDate.toISOString().split('T')[0]
      sendData.end_date = secondDate.toISOString().split('T')[0]
      // axios({
      //   method: 'POST',
      //   // url: `${config.url}/orders/${url}`,
      //   data: sendData,
      //   headers: {
      //     authorization: this.$cookies.get('authorization'),
      //   },
      // })
      //     .then((res) => {
      //       console.log(res)
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       alert('Ошибка в работе приложения. Обратитесь к администратору.');
      //     });
    },
    closeMenu() {
      this.$refs.Datepicker.closeMenu();
    },
    selectDate() {
      this.$refs.Datepicker.selectDate();
    },
    reportVisible() {
      this.reportDateVisible = !this.reportDateVisible
    }
  },
}

</script>

<style>
/*.custom-select:hover {*/
/*  background-color: red;*/
/*}*/


.report-wrap {

}

.report-date {

}

.report {

}

.report-button {

}

</style>