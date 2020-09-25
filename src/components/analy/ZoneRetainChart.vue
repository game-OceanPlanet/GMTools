<template>
  <Table border :columns="tableColumns" :data="tableRows"></Table>
</template>

<script>
  import * as services from '@/services'

  export default {
    props: {
      selectedZoneIdList: {
        type: Array,
        default: []
      }
    },

    watch: {
      selectedZoneIdList: function () {
        this.search();
      }
    },

    methods: {
      search() {
        if (!services.checkAnalyAuthor()) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 先把表记录清空
        this.tableRows = [];
        services.getHttpClient().post({
          url: '/xy/analy/retain',
          body: {
            date: services.getSelectedDate(),
            group_type: 1,
            groups: this.selectedZoneIdList
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
          var regRole = row.reg_role;
          var day2Ratio = 0;
          var day3Ratio = 0;
          var day4Ratio = 0;
          var day5Ratio = 0;
          var day6Ratio = 0;
          var day7Ratio = 0;
          var day14Ratio = 0;
          var day21Ratio = 0;
          var day30Ratio = 0;

          if (regRole > 0) {
            day2Ratio = row.day2 / regRole;
            day3Ratio = row.day3 / regRole;
            day4Ratio = row.day4 / regRole;
            day5Ratio = row.day5 / regRole;
            day6Ratio = row.day6 / regRole;
            day7Ratio = row.day7 / regRole;
            day14Ratio = row.day14 / regRole;
            day21Ratio = row.day21 / regRole;
            day30Ratio = row.day30 / regRole;
          }

          var tableRow = {}
          tableRow["date"] = row.date;
          tableRow["zone"] = services.getZoneNameByZoneId(row.id);
          tableRow["regRole"] = row.reg_role;
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
            title: '区服',
            key: 'zone',
            align: 'center'
          },
          {
            title: '创角',
            key: 'regRole',
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
