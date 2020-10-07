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

      
    }
  }
</script>

<style scoped>
</style>
