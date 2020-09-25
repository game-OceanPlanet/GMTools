<template>
  <DatePicker ref="picker" class="date-picker" size="large" :clearable="false" confirm type="date"
              format="yyyy年MM月dd日" placement="bottom-start" placeholder="选择日期" :value="selectedDate()"
              @on-change="onChange" style="width: 270px">
  </DatePicker>
</template>

<script>
  import * as services from '@/services'
  import moment from 'moment'

  export default {
    data() {
      return {
        choosedDate: null,
      }
    },

    methods: {
      onChange(date) {
        this.choosedDate = moment(date, 'YYYY年MM月DD日').format('YYYY-MM-DD');
        services.setSelectedDateRange(this.choosedDate, this.choosedDate);
      },

      selectedDate() {
        return services.getSelectedDate();
      }
    }
  }
</script>
