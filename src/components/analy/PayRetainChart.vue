<template>
  <Table border :columns="tableColumns" :data="tableRows"></Table>
</template>

<script>
  import * as services from '@/services'

  export default {
    methods: {
      search(zones, channels) {
        if (!services.checkAnalyAuthor()) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 先把表记录清空
        this.tableRows = [];
        services.getHttpClient().post({
          url: '/xy/analy/pay_retain',
          body: {
            zones: zones,
            channels: channels,
            start_date: services.getSelectedDateRangeFrom(),
            end_date: services.getSelectedDateRangeTo()
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.data || body.data.length === 0) {
            return
          }

          this.fillData(body.data)
        });
      },

      fillData(rows) {
        rows.forEach((row) => {
          var regPayUser = row.reg_payuser;
          var day2Ratio = 0;
          var day3Ratio = 0;
          var day4Ratio = 0;
          var day5Ratio = 0;
          var day6Ratio = 0;
          var day7Ratio = 0;
          var day14Ratio = 0;
          var day21Ratio = 0;
          var day30Ratio = 0;

          if (regPayUser > 0) {
            day2Ratio = row.day2 / regPayUser;
            day3Ratio = row.day3 / regPayUser;
            day4Ratio = row.day4 / regPayUser;
            day5Ratio = row.day5 / regPayUser;
            day6Ratio = row.day6 / regPayUser;
            day7Ratio = row.day7 / regPayUser;
            day14Ratio = row.day14 / regPayUser;
            day21Ratio = row.day21 / regPayUser;
            day30Ratio = row.day30 / regPayUser;
          }

          var tableRow = {};
          tableRow["date"] = row.date;
          tableRow["regPayUser"] = row.reg_payuser;
          tableRow["day2"] = (100 * day2Ratio).toFixed(2) + "%";
          tableRow["day3"] = (100 * day3Ratio).toFixed(2) + "%";
          tableRow["day4"] = (100 * day4Ratio).toFixed(2) + "%";
          tableRow["day5"] = (100 * day5Ratio).toFixed(2) + "%";
          tableRow["day6"] = (100 * day6Ratio).toFixed(2) + "%";
          tableRow["day7"] = (100 * day7Ratio).toFixed(2) + "%";
          tableRow["day14"] = (100 * day14Ratio).toFixed(2) + "%";
          tableRow["day21"] = (100 * day21Ratio).toFixed(2) + "%";
          tableRow["day30"] = (100 * day30Ratio).toFixed(2) + "%";

          this.tableRows.push(tableRow);
        });
      }
    },

    data() {
      return {
        tableColumns: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '新增付费',
            key: 'regPayUser',
            align: 'center'
          },
          {
            title: '次留',
            key: 'day2',
            align: 'center'
          },
          {
            title: '3留',
            key: 'day3',
            align: 'center'
          },
          {
            title: '4留',
            key: 'day4',
            align: 'center'
          },
          {
            title: '5留',
            key: 'day5',
            align: 'center'
          },
          {
            title: '6留',
            key: 'day6',
            align: 'center'
          },
          {
            title: '7留',
            key: 'day7',
            align: 'center'
          },
          {
            title: '14留',
            key: 'day14',
            align: 'center'
          },
          {
            title: '21留',
            key: 'day21',
            align: 'center'
          },
          {
            title: '30留',
            key: 'day30',
            align: 'center'
          }
        ],

        tableRows: []
      }
    }
  }
</script>
