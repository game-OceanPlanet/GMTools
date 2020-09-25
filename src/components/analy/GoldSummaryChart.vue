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
          url: '/xy/analy/query_amount',
          body: {
            zones: zones,
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

          let list = body.data;
          list.sort((row1, row2) => {
            if (row1.date !== row2.date) {
              return row2.date.localeCompare(row1.date)
            }

            if (row1.update_type === 1 && row2.update_type === 2) {
              return -1;
            } else if (row1.update_type === 2 && row2.update_type === 1) {
              return 1;
            } else if (row1.update_type === row2.update_type) {
              if (row1.update_num < row2.update_num) {
                return 1;
              } else {
                return -1;
              }
            }
          });

          this.fillData(list)
        });
      },

      fillData(rows) {
        rows.forEach((row) => {
          if (row.update_num <= 0) {
            return;
          }

          var tableRow = {};
          tableRow["date"] = row.date;
          tableRow["operate"] = services.getOperateName(row.operate);
          tableRow["update_type"] = row.update_type === 1 ? "流入" : "流出";
          tableRow["update_role"] = row.update_role;
          tableRow["update_count"] = row.update_count;
          tableRow["update_num"] = row.update_num;

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
            title: '操作内容',
            key: 'operate',
            align: 'center'
          },
          {
            title: '更改类型',
            key: 'update_type',
            align: 'center'
          },
          {
            title: '操作人数',
            key: 'update_role',
            align: 'center'
          },
          {
            title: '操作次数',
            key: 'update_count',
            align: 'center'
          },
          {
            title: '元宝总数',
            key: 'update_num',
            align: 'center'
          }
        ],

        tableRows: []
      }
    }
  }
</script>
