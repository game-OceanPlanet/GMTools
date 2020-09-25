<template>
  <Table border :columns="tableColumns" :data="tableRows"></Table>
</template>

<script>
  import * as services from '@/services'

  export default {
    props: {
      selectedChannelList: {
        type: Array,
        default: []
      }
    },

    watch: {
      selectedChannelList: function () {
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
          url: '/xy/analy/base',
          body: {
            date: services.getSelectedDate(),
            group_type: 2,
            groups: this.selectedChannelList
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
            if (services.isChannelUnknown(row1.id) && !services.isChannelUnknown(row2.id)) {
              return 1;
            } else if (!services.isChannelUnknown(row1.id) && services.isChannelUnknown(row2.id)) {
              return -1;
            } else {
              return services.getChannelNameByChannelId(row1).localeCompare(services.getChannelNameByChannelId(row2));
            }
          });

          this.fillData(list)
        });
      },

      fillData(rows) {
        var totalRegUser = 0;
        var totalRegRole = 0;
        var totalValidRole = 0;
        var totalRegPayUser = 0;
        var totalRegPayMoney = 0;
        var totalPayMoney = 0;

        rows.forEach((row) => {
          totalRegUser += row.reg_user;
          totalRegRole += row.reg_role;
          totalValidRole += row.valid_role;
          totalRegPayUser += row.reg_payuser;
          totalRegPayMoney += row.reg_paymoney;
          totalPayMoney += row.pay_money;

          // 新增付费率
          var regPayRatio = 0;
          if (row.reg_user > 0) {
            regPayRatio = row.reg_payuser / row.reg_user
          }

          // 新增arpu
          var regArpu = 0;
          if (row.reg_user > 0) {
            regArpu = row.reg_paymoney / row.reg_user
          }

          // 新增arppu
          var regArppu = 0;
          if (row.reg_payuser > 0) {
            regArppu = row.reg_paymoney / row.reg_payuser
          }

          // 二次付费率
          var secondPayRatio = 0;
          if (row.reg_payuser > 0) {
            secondPayRatio = row.second_pay / row.reg_payuser
          }

          // 活跃付费率
          var actPayRatio = 0;
          if (row.act_user > 0) {
            actPayRatio = row.pay_user / row.act_user
          }

          // arpu
          var arpu = 0;
          if (row.act_user > 0) {
            arpu = row.pay_money / row.act_user
          }

          // arppu
          var arppu = 0;
          if (row.pay_user > 0) {
            arppu = row.pay_money / row.pay_user
          }

          var tableRow = {};
          tableRow["date"] = row.date;
          tableRow["channel"] = services.getChannelNameByChannelId(row.id);
          tableRow["regUser"] = row.reg_user;
          tableRow["regRole"] = row.reg_role;
          tableRow["validRole"] = row.valid_role;
          tableRow["regPayUser"] = row.reg_payuser;
          tableRow["regPayMoney"] = row.reg_paymoney;
          tableRow["regPayRatio"] = (100 * regPayRatio).toFixed(2) + "%";
          tableRow["regArpu"] = regArpu.toFixed(2);
          tableRow["regArppu"] = regArppu.toFixed(2);
          tableRow["payMoney"] = row.pay_money;
          tableRow["payUser"] = row.pay_user;
          tableRow["secondPayRatio"] = (100 * secondPayRatio).toFixed(2) + "%";
          tableRow["actUser"] = row.act_user;
          tableRow["actPayRatio"] = (100 * actPayRatio).toFixed(2) + "%";
          tableRow["arpu"] = arpu.toFixed(2);
          tableRow["arppu"] = arppu.toFixed(2);

          this.tableRows.push(tableRow);
        });

        var tableRow = {};
        tableRow["date"] = "汇总";
        tableRow["channel"] = "---";
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
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '渠道',
            key: 'channel',
            align: 'center'
          },
          {
            title: '注册',
            key: 'regUser',
            align: 'center'
          },
          {
            title: '创角',
            key: 'regRole',
            align: 'center'
          },
          {
            title: '有效创角',
            key: 'validRole',
            align: 'center'
          },
          {
            title: '新增付费帐号',
            key: 'regPayUser',
            align: 'center'
          },
          {
            title: '新增付费额',
            key: 'regPayMoney',
            align: 'center'
          },
          {
            title: '新增付费率',
            key: 'regPayRatio',
            align: 'center'
          },
          {
            title: '新增arpu',
            key: 'regArpu',
            align: 'center'
          },
          {
            title: '新增arppu',
            key: 'regArppu',
            align: 'center'
          },
          {
            title: '付费帐号',
            key: 'payUser',
            align: 'center'
          },
          {
            title: '付费额',
            key: 'payMoney',
            align: 'center'
          },
          {
            title: '二次付费率',
            key: 'secondPayRatio',
            align: 'center'
          },
          {
            title: '活跃用户',
            key: 'actUser',
            align: 'center'
          },
          {
            title: '活跃付费率',
            key: 'actPayRatio',
            align: 'center'
          },
          {
            title: 'arpu',
            key: 'arpu',
            align: 'center'
          },
          {
            title: 'arppu',
            key: 'arppu',
            align: 'center'
          }
        ],

        tableRows: []
      }
    }
  }
</script>
