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
    },

    data() {
      return {
        selectedZoneIdList: [],

        metrics: this.getGameTotalData(),
      }
    },

    methods: {
      getGameTotalData(){
        let isShow = services.checkPayTotalAuthor();
        if(isShow){
            return {
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
              "title": "星球活跃",
              "value": ""
            },
            "todayActiveNumber2": {
              "title": "部落活跃",
              "value": ""
            }
          }
        } else {
          return {
          "historyRegisterNumber": {
            "title": "历史累计注册",
            "value": ""
          },
          "todayRegisterNumber": {
            "title": "今日注册",
            "value": ""
          },
          "todayActiveNumber": {
            "title": "星球活跃",
            "value": ""
          },
            "todayActiveNumber2": {
              "title": "部落活跃",
              "value": ""
            }
        }
        }
      },


      search() {
        if(services.checkPayTotalAuthor()){
          this.getTotalPay();
        }
        if(services.checkPayPartAuthor()){
          this.getAll();
        }
        
        this.getTotalRegister();
        this.getPart();
      },

      getTotalRegister(){
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
             this.$Message.error("提交失败，请检查配置,错误码："+body.code);
            return;
          }

          this.metrics.historyRegisterNumber.value = body.msg.allCount;
        });
      },

      getTotalPay(){
        services.getHttpClient().post({
            url: "/dragon/statisticsList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:1
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error("查询失败："+body.code);
            return;
          }

          let list = body.msg.value;
          if(list && list.length > 0){
            let todayTotalPay = list[0].Diamond;
            let todayPayCount = list[0].Pay;
            this.metrics.todayRechargeAmount.value = todayTotalPay;
            this.metrics.todayRechargePlayerNumber.value = todayPayCount;
          }
        });
      },

      getAll(){
        services.getHttpClient().post({
          url: '/dragon/statisticsSummary',
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
             this.$Message.error("提交失败，请检查配置,错误码："+body.code);
            return;
          }

          this.metrics.historyRechargeAmount.value = body.msg.totalDiamond;
        });
      },

      getPart(){
        services.getHttpClient().post({
            url: "/dragon/statisticsSimpleList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:1
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error(body.code);
            return;
          }

          let list = body.msg.value;
          if(list && list.length > 0){
            let todayRegister = list[0].Register;
            this.metrics.todayActiveNumber.value = list[0].OceanActive;
            this.metrics.todayActiveNumber2.value = list[0].DeepActive;
            this.metrics.todayRegisterNumber.value = todayRegister;
          }
        });

          // this.metrics.historyRegisterNumber.value = result.allCount;
          // this.metrics.historyRechargeAmount.value = result.history_pay;
          // this.metrics.todayRegisterNumber.value = result.today_reg;
          // this.metrics.todayRechargeAmount.value = result.today_pay;
          // this.metrics.todayRechargePlayerNumber.value = result.today_pay_user;
          // this.metrics.todayActiveNumber.value = result.today_act;

      },
    }
  }
</script>
