<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="查询类型">
        <RadioGroup v-model="formModel.type">
         <Radio label="tel">手机号</Radio>
          <Radio label="playerId">玩家ID</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="查询编号">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem>
      <FormItem label="货币类型">
        <Select @on-change="onOperateChanged" v-model="formModel.currencyType"> filterable placeholder="请选择或直接输入关键字">
          <Option v-for="operate in operateList" :key="operate.name" :value="operate.type">{{ operate.name }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
      </FormItem>
      <Table border :columns="tableColumns" :data="tableRows"></Table>
    </Form>
  </div>
</template>

<script>
  import * as services from '@/services'
  import ZoneSelect from '@/components/ZoneSelect'
  import DatePicker from '@/components/DatePicker'
  import RegionSelect from '@/components/RegionSelect'
  import ChartTitle from '@/components/ChartTitle'
  export default {
    components: {
      ZoneSelect,
      DatePicker,
      RegionSelect,
      ChartTitle
    },

    data() {
      return {
        formModel: {
          type: 'tel',
          roleId: '',
          currencyType:1
        },

        operateList: [],

        tableColumns: [
          // {
          //   title: '货币类型',
          //   key: 'moneyType',
          //   align: 'center',
          //   width:110
          // },
          {
            title: '玩家ID',
            key: 'PlayerId',
            align: 'center',
            width:110
          },
          {
            title: '时间',
            key: 'LogTime',
            align: 'center'
          },
          {
            title: '操作类型',
            key: 'Type',
            align: 'center'
          },
          {
            title: '操作之前数量',
            key: 'BeforeMoney',
            align: 'center'
          },
          {
            title: '操作之后数量',
            key: 'AfterMoney',
            align: 'center'
          },
          {
            title: '改变数量',
            key: 'ChangeMoney',
            align: 'center'
          },
          {
            title: '鱼ID',
            key: 'FishId',
            align: 'center'
          },
          {
            title: '鱼配置ID',
            key: 'FishConfigId',
            align: 'center'
          },
          {
            title: '描述',
            key: 'Info',
            align: 'center'
          }
        ],

        tableRows: []
      }
    },

    created() {
      this.fetchOperateList()
    },

    methods: {
      onOperateChanged(value) {
        this.formModel.currencyType = value
      },
      fetchOperateList() {
        this.operateList = [];
        let moneyNames = ["金币","USDT","KAD","激活码","购买名额","加速积分","海豚金币"];
        for(var i = 0; i < moneyNames.length; i ++){
          this.operateList.push({"name": moneyNames[i], "type": i + 1})      
        }
      },

      handleSubmit() {
        var type = this.formModel.type;

        var id = this.formModel.roleId;
        if (id.length === 0) {
          this.$Message.error('请正确填入查询编号');
          return
        }

        let playerId = 0;
        let mobile = 0;
        if(type == "playerId"){
          playerId = id;
        } else if(type == "tel"){
          mobile = id;
        }

        let moneyType = this.formModel.currencyType;

        services.getHttpClient().post({
            url: "/dragon/currencyLog",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:100,
            currencyType:moneyType,
            playerId:playerId,
            mobile:mobile
          }
        }, (error, response, body) => {
          if (error) {
            return;
          }

          if (body.code != 0) {
            // this.$Message.error("查询错误"+body.code);
            return;
          }

          this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        this.tableRows.length = 0;
        rows.forEach((row) => {
          var tableRow = {};
          // let moneyType = this.formModel.currencyType;
          // tableRow["moneyType"] = this.operateList[moneyType - 1];
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["LogTime"] = row.LogTime;
          tableRow["Type"] = this.getType(row.Type);
          tableRow["BeforeMoney"] = row.BeforeMoney;
          tableRow["AfterMoney"] = row.AfterMoney;
          tableRow["ChangeMoney"] = row.ChangeMoney;
          tableRow["FishId"] = row.FishId;
          tableRow["FishConfigId"] = row.FishConfigId;
          tableRow["Info"] = row.Info;

          this.tableRows.push(tableRow);
        });
      },

      getType(s) {
            //类型,1=领取鱼日产金币,2=金币买鱼,101=U买鱼
            let msg;
            switch (s) {
                case services.MONEY_REWARD:
                    msg = "领取HK"
                    break;
                case services.MONEY_BUY_FISH:
                    msg = "KAD买鱼"
                    break;
                case services.OCT_SELL_MONEY:
                    msg = "交易卖出"//"OTC-卖给Ta"
                    break;
                case services.OCT_SOMEONE_SELL_ME:
                    msg = "交易购买"//"OTC-卖给我"
                    break;
                case services.MONEY_EXCHANGE_KAD:
                    msg = "兑换消耗HK"//"KAD-用金币兑换KAD，消耗金币"
                    break;
                case services.DIRECT_MONEY_REWARD:
                    msg = "直推奖励"//"KAD-直推成员领取金币，得到金币"
                    break;
                case services.TEAM_MONEY_REWARD:
                    msg = "团队奖励"//"KAD-非直推成员领取金币，得到金币"
                    break;
                case services.DIAMOND_BUY_FISH:
                    msg = "USDT买鱼"//"U买鱼"
                    break;
                case services.OCT_BUY_MONEY_COST_U:
                    msg = "买入金币"//"OTC-买入金币（挂单）"
                    break;
                case services.OCT_SELL_MONEY_GOT_U:
                    msg = "卖出金币"//"OTC-卖给Ta，获得U"
                    break;
                case services.OCT_CANCEL_GOT_U:
                    msg = "撤单"//"OTC-撤单，获得U"
                    break;
                case services.KAD_BONUS_GOT_U:
                    msg = "分红"//"KAD-注入每日分红，获得U"
                    break;
                case services.RECHARGE_GOT_U:
                    msg = "充值"//"玩家充值，获得U"
                    break;
                case services.DOLPHIN_SELL_OUT_GOT_U:
                    msg = "出售海豚"//"海豚卖出，获得U"
                    break;
                case services.DOLPHIN_BUY_COST_U:
                    msg = "购买海豚"//"购买海豚，消耗U"
                    break;
                case services.DOLPHIN_HATCH_COST_U:
                    msg = "孵化海豚，消耗U"//"孵化海豚，消耗U"
                    break;
                case services.CASH_OUT_COST_U:
                    msg = "提现，消耗u"//"提现，消耗u"
                    break;
                 case services.CASH_OUT_REFUSE_GOT_U:
                    msg = "提现失败返还U"//"玩家提现被拒绝，返还U和手续费，获得U"
                    break;
                case services.EXCHANGE_GOT_KAD:
                    msg = "兑换获得KAD"//"KAD-用金币兑换KAD，得到KAD"
                    break;
                case services.INJECT_COST_KAD:
                    msg = "注入KAD"//"KAD-注入，消耗KAD"
                    break;
                case services.INJECT_EXPIRE_GOT_KAD:
                    msg = "注入返还"//"KAD-注入到期，返还KAD"
                    break;

                case services.USE_KEY:
                    msg = "激活账号"//"K激活秘钥-自己使用"
                    break;
                case services.KEY_GIVE:
                    msg = "赠送秘钥"//"激活秘钥-赠送给他人"
                    break;
                case services.KEY_BE_GIVE:
                    msg = "收到秘钥"//"激活秘钥-被赠送"
                    break;
                case services.DOLPHIN_BUY_COUNT_BE_GIVE:
                    msg = "实名认证获得领养名额"//"实名验证系统赠送， 获得领养名额"
                    break;
                case services.DOLPHIN_BUY_COST_BUY_COUNT:
                    msg = "购买海豚"//"购买海豚，消耗领养名额"
                    break;
                case services.DOLPHIN_EXCHANGE_GOT_COUNT:
                    msg = "兑换名额"//"用海豚金币兑换， 获得领养名额"
                    break;
                case services.DOLPHIN_EXCHANGE_COST_MONEY:
                    msg = "兑换名额"//"用海豚金币兑换领养名额, 消耗海豚金币"
                    break;
                case services.DOLPHIN_FERTILIZE_COST_MONEY:
                    msg = "海豚受孕"//"受孕海豚, 消耗海豚金币"
                    break;
                case services.DOLPHIN_SIGN_IN_GOT_MONEY:
                    msg = "签到"//"签到, 获得海豚金币"
                    break;
                case services.DOLPHIN_SPEED_COST_SPEED_COUNT:
                    msg = "直推下级购买海豚, 直推用户获得加速积分"//"直推下级购买海豚, 直推用户获得加速积分"
                    break;
                case services.DOLPHIN_DIRECT_BUY_GOT_SPEED_COUNT:
                    msg = "加速消耗积分"//"加速海豚状态, 消耗加速积分"
                    break;
                case services.DOLPHIN_TEAM_BUY_GOT_SPEED_COUNT:
                    msg = "非直推下级购买海豚, 团队用户获得加速积分"//"非直推下级购买海豚, 团队用户获得加速积分"
                    break;
                case 1000:
                    msg = "管理后台操作"//"管理后台操作"
                    break;
            }
            return msg;
        }
    }
  }
</script>

<style scoped>
</style>
