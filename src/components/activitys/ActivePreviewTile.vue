<template>
  <Table border :columns="tableColumns" :data="tableRows"></Table>
</template>

<script>
  import * as services from '@/services'

  export default {
    methods: {
      search() {
        if (!services.checkAnalyAuthor()) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 先把表记录清空
        this.tableRows = [];
        services.getHttpClient().post({
          url: '/xy/analy/base_sum',
          body: {
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
        var activeName = "";
        var activeType = 0;
        var subType = 0;
        var clientExt = 0;
        var clientModel = 0;
        var startDay = 0;
        var endDay = 0;
        var startTime = 0;
        var endTime = 0;

        rows.forEach((row) => {
          activeName = row.name;// 活动名
          activeType = row.type;// 活动类型
          subType = row.sub_type;// 活动子类型 
          clientExt = row.client_ext;// 客户端扩展字段 
          clientModel = row.client_model;// 客户端模型 
          startDay = row.start_server;// 开服第几天开始 
          endDay = row.end_server;// 开服第几天结束 
          startTime = row.start_time;// 活动开启时间  
          endTime = row.end_time;// 活动结束时间

          var tableRow = {};
          tableRow["activeName"] = activeName;
          tableRow["activeType"] = activeType;
          tableRow["subType"] = subType;
          tableRow["clientExt"] = clientExt;
          tableRow["clientModel"] = clientModel;
          tableRow["startDay"] = startDay;
          tableRow["endDay"] = endDay;
          tableRow["startTime"] = startTime;
          tableRow["endTime"] = endTime;
          this.tableRows.push(tableRow);
        });

        var tableRow = {};
        tableRow["date"] = "汇总";
        tableRow["regUser"] = totalRegUser;
        tableRow["regRole"] = totalRegRole;
        tableRow["validRole"] = totalValidRole;
        tableRow["regPayUser"] = totalRegPayUser;
        tableRow["regPayMoney"] = totalRegPayMoney;
        tableRow["regPayRatio"] = "---";
        tableRow["regArpu"] = "---";
        tableRow["regArppu"] = "---";
        tableRow["payMoney"] = totalPayMoney;
        tableRow["payUser"] = "---";
        tableRow["secondPayRatio"] = "---";
        tableRow["actUser"] = "---";
        tableRow["actPayRatio"] = "---";
        tableRow["arpu"] = "---";
        tableRow["arppu"] = "---";
        this.tableRows.push(tableRow);
      }
    },

    data() {
      return {
        tableColumns: [
          {
            title: '活动名称',
            key: 'activeName',
            align: 'center'
          },
          {
            title: '活动类型',
            key: 'activeType',
            align: 'center'
          },
          {
            title: '活动子类型',
            key: 'subType',
            align: 'center'
          },
          {
            title: '客户端扩展字段',
            key: 'clientExt',
            align: 'center'
          },
          {
            title: '客户端模型',
            key: 'clientModel',
            align: 'center'
          },
          {
            title: '开服第几天开始',
            key: 'startDay',
            align: 'center'
          },
          {
            title: '开服第几天结束',
            key: 'endDay',
            align: 'center'
          },
          {
            title: '活动开启时间',
            key: 'startTime',
            align: 'center'
          },
          {
            title: '活动结束时间',
            key: 'endTime',
            align: 'center'
          },
        ],

        tableRows: []
      }
    }
  }
</script>

<style>
  .ivu-table .table-info-cell-name {
    background-color: #2db7f5;
    color: #fff;
  }
</style>>
