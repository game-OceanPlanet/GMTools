<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <!-- <FormItem label="查询类型">
        <RadioGroup v-model="formModel.type">
          <Radio label="playerId">玩家ID</Radio>
          <Radio label="tel">手机号</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="玩家id">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem> -->
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
          type: 'playerId',
          roleId: ''
        },

        operateList: [],

        tableColumns: [
          {
            title: '手机号',
            key: 'Mobile',
            align: 'center'
          },
          {
            title: '真实姓名',
            key: 'Name',
            align: 'center'
          },
          {
            title: '身份证号',
            key: 'IdNum',
            align: 'center'
          },
          {
            title: '注册时间',
            key: 'CreateTime',
            align: 'center'
          },
          {
            title: '角色id',
            key: 'PlayerId',
            align: 'center'
          },
          {
            title: '最近登录',
            key: 'LoginTime',
            align: 'center'
          },
          {
            title: '最近离线',
            key: 'LastLoginTime',
            align: 'center'
          },
          {
            title: '累计充值金额',
            key: 'TotalRechargeValue',
            align: 'center'
          },
          {
            title: 'USDT',
            key: 'Diamond',
            align: 'center'
          },
          {
            title: '金币',
            key: 'Money',
            align: 'center'
          },
          {
            title: '平台币',
            key: 'KAD',
            align: 'center'
          },
          {
            title: '邀请码',
            key: 'InviteCode',
            align: 'center'
          },
          {
            title: '激活码',
            key: 'KeyCount',
            align: 'center'
          },
          {
            title: '加速积分',
            key: 'DolphinSpeedCount',
            align: 'center'
          },
          {
            title: '海豚币',
            key: 'DolphinMoney',
            align: 'center'
          },
          {
            title: '我的上级ID',
            key: 'SuperPlayerId',
            align: 'center'
          },
          {
            title: '直推规模',
            key: 'DirectEffectNum',
            align: 'center'
          },
          {
            title: '激活状态',
            key: 'State',
            align: 'center'
          },
          {
            title: '实名状态',
            key: 'GameState',
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
        let moneyNames = ["金币","USDT","KAD","KEY","购买名额","加速积分","海豚金币"];
        for(var i = 0; i < moneyNames.length; i ++){
          this.operateList.push({"name": moneyNames[i], "type": i + 1})      
        }
      },

      handleSubmit() {
        // var type = this.formModel.type;

        // var id = this.formModel.roleId;
        // if (id.length === 0) {
        //   this.$Message.error('请正确填入查询编号');
        //   return
        // }

        // let playerId;
        // let mobile;
        // if(type == "playerId"){
        //   playerId = id;
        // } else if(type == "tel"){
        //   mobile = id;
        // }

        services.getHttpClient().post({
            url: "/dragon/playerList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:100
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.msg || !body.msg.value || body.msg.value.length === 0) {
            return
          }

          this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["Mobile"] = row.Mobile;
          tableRow["Name"] = row.Name;
          tableRow["IdNum"] = row.IdNum;
          tableRow["CreateTime"] = row.CreateTime;
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["LoginTime"] = row.LoginTime;
          tableRow["LastLoginTime"] = row.LastLoginTime;
          tableRow["TotalRechargeValue"] = row.TotalRechargeValue;
          tableRow["Diamond"] = row.Diamond;
          tableRow["Money"] = row.Money;
          tableRow["KAD"] = row.KAD;
          tableRow["InviteCode"] = row.InviteCode;
          tableRow["KeyCount"] = row.KeyCount;
          tableRow["DolphinSpeedCount"] = row.DolphinSpeedCount;
          tableRow["DolphinMoney"] = row.DolphinMoney;
          tableRow["SuperPlayerId"] = row.SuperPlayerId;
          tableRow["DirectEffectNum"] = row.DirectEffectNum;
          tableRow["State"] = row.State;
          tableRow["GameState"] = row.GameState;

          this.tableRows.push(tableRow);
        });
      },

      onOperateChanged(value) {
        this.formModel.operate = value
      },
    }
  }
</script>

<style scoped>
</style>
