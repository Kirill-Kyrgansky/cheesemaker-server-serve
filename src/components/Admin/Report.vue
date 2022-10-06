<template>
  <div class="report">
    <div
        class="cart-done"
        v-if="reportDateVisible"
    >
      <div
          class="cart cart-sucsess order-title"
          v-click-outside="isVisibleReport"
      >
        <div class="position-end">
          <img
              src="/allImage/Icons/cross.svg"
              class="header-link-icon pointer close"
              @click="reportVisible"
              alt="close"
          />
        </div>
        <input
            class="btn margin-10-0"
            type="button"
            @click="report('production')"
            value="Отчет по производству"
        >
        <input
            class="btn margin-10-0"
            type="button"
            @click="report('order-contents')"
            value="Отчет по движению товара"

        >
        <input
            class="btn margin-10-0"
            type="button"
            @click="report('orders')"
            value="Отчет по заказам"
        >
        <Datepicker
            v-model="date"
            ref="Datepicker"
            locale="ru"
            :presetRanges="setup"
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
            <p
                class="custom-select"
                @click="closeMenu"
            >Закрыть
            </p>
            <p
                class="custom-select"
                @click="selectDate"
            >Выбрать
            </p>
          </template>
        </Datepicker>
      </div>
    </div>

    <div class="report-button">
      <input
          class="header-link pointer"
          type="button"
          @click="reportVisible"
          value="Отчеты"
      >
    </div>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from "axios";
import config from "@/config";
import vClickOutside from "click-outside-vue3";

export default {
  name: 'Report',
  components: {Datepicker},
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      reportDateVisible: false,
      date: null
    }
  },
  methods: {
    isVisibleReport() {
      this.reportDateVisible = false
    },
    report(url) {
      if (this.date === null) {
        alert('Выберите дату.')
      } else if (this.date[0] !== null && this.date[1] === null) {
        let firstDate = this.date[0]
        let secondDate = this.date[0]
        let start_date = firstDate.toISOString().split('T')[0]
        secondDate.setDate(secondDate.getDate() + 1)
        let end_date = secondDate.toISOString().split('T')[0]
        this.getFile(url, start_date, end_date)
        secondDate.setDate(secondDate.getDate() - 1)
      } else {
        let firstDate = this.date[0]
        let secondDate = this.date[1]
        let start_date = firstDate.toISOString().split('T')[0]
        let end_date = secondDate.toISOString().split('T')[0]
        this.getFile(url, start_date, end_date)
      }
    },
    getFile(url, start_date, end_date) {
      axios({
        method: 'GET',
        url: `${config.url}/reports/${url}`,
        params: {
          start_date,
          end_date
        },
        headers: {
          authorization: this.$cookies.get('authorization'),

        },
      })
          .then((res) => {
            let base64 = res.data
            console.log(res)
            window.open("data:application/vnd.ms-excel;base64," + base64);
          })
          .catch((error) => {
            console.log(error);
          });
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