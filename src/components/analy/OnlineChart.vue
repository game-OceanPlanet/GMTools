<template>
  <Table border :columns="tableColumns" :data="tableRows"></Table>
</template>

<script>
  import * as services from '@/services'

  export default {
    methods: {
      search(zones) {
        if (!services.checkAnalyAuthor()) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 先把表记录清空
        this.tableRows = [];
        services.getHttpClient().post({
          url: '/xy/analy/online',
          body: {
            zones: zones
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
          tableRow["zone"] = services.getZoneNameByZoneId(row.zone);
          tableRow["count"] = row.count;
          tableRow["date"] = row.event_time;

          this.tableRows.push(tableRow);
        });
      }
    },

    data() {
      return {
        tableColumns: [
          {
            title: '区服',
            key: 'zone',
            align: 'center'
          },
          {
            title: '在线人数',
            key: 'count',
            align: 'center'
          },
          {
            title: '记录时间',
            key: 'date',
            align: 'center'
          }
        ],

        tableRows: []
      }
    }
  }
</script>
