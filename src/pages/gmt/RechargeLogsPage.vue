<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="查询类型">
        <RadioGroup v-model="formModel.type" @on-change="onOperateChanged">
        <Radio label="all">全部</Radio>
          <Radio label="playerId">玩家ID</Radio>
          <Radio label="tel">手机号</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="查询编号" v-if="formModel.inputVis">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem>
      <!-- <FormItem label="货币类型">
        <Select @on-change="onOperateChanged" v-model="formModel.currencyType"> filterable placeholder="请选择或直接输入关键字">
          <Option v-for="operate in operateList" :key="operate.name" :value="operate.type">{{ operate.name }}</Option>
        </Select>
      </FormItem> -->
       <Button type="primary" @click="handleSubmit">查询</Button>
       <br>
       <br>
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
          type: 'all',
          roleId: '',
          currencyType:1,
          changeCount:0,
          inputVis:true
        },

        operateList: [],

        tableColumns: [
          {
            title: '玩家ID',
            key: 'PlayerId',
            align: 'center',
            width:110
          },
          {
            title: '编号',
            key: 'Id',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'Mobile',
            align: 'center'
          },
          {
            title: '充值地址',
            key: 'Address',
            align: 'center'
          },
          {
            title: '充值数量',
            key: 'Number',
            align: 'center'
          },
          {
            title: '货币单位',
            key: 'CurrencyName',
            align: 'center'
          },
          {
            title: 'Hash值',
            key: 'Hash',
            align: 'center'
          },
          {
            title: '时间',
            key: 'Time',
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
      fetchOperateList() {
        this.operateList = [];
        let moneyNames = ["金币","USDT","KAD","KEY","购买名额","加速积分","海豚金币"];
        for(var i = 0; i < moneyNames.length; i ++){
          this.operateList.push({"name": moneyNames[i], "type": i + 1})      
        }
      },

      handleSubmit() {
        var type = this.formModel.type;

        var id = this.formModel.roleId;

        let selectType = 0;
        let playerId= 0;
        let mobile= 0;
        if(type == "all"){
            playerId = 0;
            mobile = 0;
            selectType = 0;
        }
        else if(type == "playerId"){
          playerId = id;
          selectType = 1;
        } else if(type == "tel"){
          mobile = id;
          selectType = 1;
        }

        if(selectType == 1){
            if (id.length === 0) {
            this.$Message.error('请正确填入查询编号');
            return
        }
        }

        services.getHttpClient().post({
            url: "/dragon/rechargeOrderList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:300,
            type:selectType,
            playerId:playerId,
            mobile:mobile
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error('操作失败');
            return;
          }

          this.$Message.success('操作成功');

          this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        this.tableRows.length = 0;
        rows.forEach((row) => {
          var tableRow = {};

          tableRow["PlayerId"] = row.PlayerId;
          tableRow["Id"] = row.Id;
          tableRow["Mobile"] = row.Mobile;
          tableRow["Address"] = row.Address;
          tableRow["CurrencyName"] = row.CurrencyName;
          tableRow["Hash"] = row.Hash;
          tableRow["Time"] = row.Time;
          tableRow["Number"] = row.Number;

          this.tableRows.push(tableRow);
        });
      },

      onOperateChanged(value) {
        this.formModel.operate = value;
        this.formModel.inputVis = this.formModel.type == "all";
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
                    msg = "孵化"//"孵化海豚，消耗U"
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
                    msg = "加速"//"加速海豚状态, 消耗加速积分"
                    break;
            }
            return msg;
        }
    }
  }
</script>

<style scoped>
</style>
