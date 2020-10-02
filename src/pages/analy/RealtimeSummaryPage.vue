<template>
  <div>
    <CommonFilter ref="commonFilter" @on-change="search" showPlayerFilter></CommonFilter>
    <br>
    <div>
      <Row>
        <RealtimeSummaryMetricBlock v-for="metric in metrics" :key="metric.title" :title="metric.title" :value="metric.value">
        </RealtimeSummaryMetricBlock>
      </Row>
    </div>
  </div>
</template>

<script>
  import * as services from '@/services'
  import RealtimeSummaryMetricBlock from '@/components/analy/RealtimeSummaryMetricBlock'
  import CommonFilter from '@/components/CommonFilter'

  export default {
    components: {
      RealtimeSummaryMetricBlock,
      CommonFilter
    },

    created() {
      this.InitZoneIdList();
    },

    data() {
      return {
        selectedZoneIdList: [],

        metrics: {
          "historyRegisterNumber": {
            "title": "历史累计注册",
            "value": ""
          },
          "historyRechargeAmount": {
            "title": "历史累计收入",
            "value": ""
          },
          "todayRechargeAmount": {
            "title": "今日收入",
            "value": ""
          },
          "todayRechargePlayerNumber": {
            "title": "今日付费人数",
            "value": ""
          },
          "todayRegisterNumber": {
            "title": "今日注册",
            "value": ""
          },
          "todayActiveNumber": {
            "title": "今日活跃",
            "value": ""
          }
        }
      }
    },

    methods: {
      search() {
        if (!services.checkAnalyAuthor()) {
          this.$Message.error("权限不足,请联系管理员!");
          return;
        }

        services.getHttpClient().post({
          url: '/dragon/summary',
          body: {
                username: services.getUser().username,
                platform: services.getUser().platform
              },
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          const result = body.msg;

          this.metrics.historyRegisterNumber.value = result.allCount;
          // this.metrics.historyRechargeAmount.value = result.history_pay;
          // this.metrics.todayRegisterNumber.value = result.today_reg;
          // this.metrics.todayRechargeAmount.value = result.today_pay;
          // this.metrics.todayRechargePlayerNumber.value = result.today_pay_user;
          // this.metrics.todayActiveNumber.value = result.today_act;

        });
      },

      InitZoneIdList() {
        // services.getHttpClient().post({
        //   url: '/xy/gmt/query_server_list',
        //   body: {
        //     include_merged: true
        //   }
        // }, (error, response, body) => {
        //   if (error) {
        //     this.$Message.error(error.toString());
        //     return;
        //   }

        //   if (body.code !== 0) {
        //     this.$Message.error(body.msg);
        //     return;
        //   }

        //   if (!body.data || body.data.length === 0) {
        //     return
        //   }

        //   let zones = [];
        //   body.data.forEach((zone) => {
        //     zones.push({"id": zone.id, "name": zone.name})
        //   });
        //   services.saveZoneList(zones);
        // });
      },
    }
  }
</script>
