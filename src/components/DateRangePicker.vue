<template>
  <DatePicker ref="picker" class="date-picker" size="large" :clearable="false" confirm type="daterange"
              format="yyyy年MM月dd日" :options="datePickerOptions"
              placement="bottom-start" placeholder="选择日期范围" :value="getSelectedDateRange()" @on-change="onChange"
              style="width: 270px">
  </DatePicker>
</template>

<script>
  import * as services from '@/services'
  import moment from 'moment'

  export default {
    data() {
      return {
        choosedDateFrom: null,
        choosedDateTo: null,

        // 快捷方式
        datePickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              value() {
                const end = new Date();
                const start = (new Date()).setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                return [start, end];
              }
            },
            {
              text: '最近两周',
              value() {
                const end = new Date();
                const start = (new Date()).setTime(end.getTime() - 3600 * 1000 * 24 * 13);
                return [start, end];
              }
            },
            {
              text: '最近一个月',
              value() {
                const end = new Date();
                const start = (new Date()).setTime(end.getTime() - 3600 * 1000 * 24 * 29);
                return [start, end];
              }
            }
          ],

          disabledDate(date) {
            if (date) {
              // 不允许选择今天以后的日期
              if (date.valueOf() > Date.now()) {
                return true;
              }
            }
          }
        }
      }
    },

    methods: {
      onChange(dates) {
        this.choosedDateFrom = moment(dates[0], 'YYYY年MM月DD日').format('YYYY-MM-DD');
        this.choosedDateTo = moment(dates[1], 'YYYY年MM月DD日').format('YYYY-MM-DD');
        services.setSelectedDateRange(this.choosedDateFrom, this.choosedDateTo);
      },

      getSelectedDateRange() {
        return [services.getSelectedDateRangeFrom(), services.getSelectedDateRangeTo()];
      }
    }
  }
</script>
