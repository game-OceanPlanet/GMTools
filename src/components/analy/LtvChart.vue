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
          url: '/xy/analy/ltv',
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
          var tableRow = {};
          tableRow["date"] = row.date;
          tableRow["regRole"] = row.reg_role;
          if (row.reg_role > 0) {
            tableRow["pay1"] = (row.pay1 / row.reg_role).toFixed(2);
            tableRow["pay2"] = (row.pay2 / row.reg_role).toFixed(2);
            tableRow["pay3"] = (row.pay3 / row.reg_role).toFixed(2);
            tableRow["pay4"] = (row.pay4 / row.reg_role).toFixed(2);
            tableRow["pay5"] = (row.pay5 / row.reg_role).toFixed(2);
            tableRow["pay6"] = (row.pay6 / row.reg_role).toFixed(2);
            tableRow["pay7"] = (row.pay7 / row.reg_role).toFixed(2);
            tableRow["pay14"] = (row.pay14 / row.reg_role).toFixed(2);
            tableRow["pay21"] = (row.pay21 / row.reg_role).toFixed(2);
            tableRow["pay30"] = (row.pay30 / row.reg_role).toFixed(2);
          }

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
            title: '创角',
            key: 'regRole',
            align: 'center'
          },
          {
            title: 'ltv1',
            key: 'pay1',
            align: 'center'
          },
          {
            title: 'ltv2',
            key: 'pay2',
            align: 'center'
          },
          {
            title: 'ltv3',
            key: 'pay3',
            align: 'center'
          },
          {
            title: 'ltv4',
            key: 'pay4',
            align: 'center'
          },
          {
            title: 'ltv5',
            key: 'pay5',
            align: 'center'
          },
          {
            title: 'ltv6',
            key: 'pay6',
            align: 'center'
          },
          {
            title: 'ltv7',
            key: 'pay7',
            align: 'center'
          },
          {
            title: 'ltv14',
            key: 'pay14',
            align: 'center'
          },
          {
            title: 'ltv21',
            key: 'pay21',
            align: 'center'
          },
          {
            title: 'ltv30',
            key: 'pay30',
            align: 'center'
          }
        ],

        tableRows: []
      }
    }
  }
</script>
