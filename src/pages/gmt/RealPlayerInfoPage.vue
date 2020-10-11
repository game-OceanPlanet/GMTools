<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="查询类型">
        <RadioGroup v-model="formModel.type">
          <Radio label="playerId">玩家ID</Radio>
          <Radio label="tel">手机号</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="玩家id">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit2">指定玩家</Button>
        <Button type="primary" @click="handleSubmit">全部玩家</Button>
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
            title: '角色id',
            key: 'PlayerId',
            align: 'center'
          },
          {
            title: '用户来源',
            key: 'From',
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

        // let playerId= 0;
        // let mobile;
        // if(type == "playerId"){
        //   playerId = id;
        // } else if(type == "tel"){
        //   mobile = id;
        // }
        

        services.getHttpClient().post({
            url: "/dragon/realNamePlayerList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:500,
            type:0,
            roleId:0
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error(body.msg);
            return;
          }

          this.fillData(body.msg.value);
        });
      },
      handleSubmit2() {
       var roleId = this.formModel.roleId;

       if (roleId.length === 0) {
          this.$Message.error('请正确填入查询编号');
          return
        }
        

        services.getHttpClient().post({
            url: "/dragon/realNamePlayerList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
             page:1,
            pageSize:1,
            type:1,
            roleId:roleId
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error(body.msg);
            return;
          }

           this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        this.tableRows = [];
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["Mobile"] = row.Mobile;
          tableRow["Name"] = row.Name;
          tableRow["IdNum"] = row.IdNum;
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["From"] = this.getStateMsg(row.From);


          this.tableRows.push(tableRow);
        });
      },

      fillData2(row) {
        this.tableRows = [];
        var tableRow = {};
          tableRow["Mobile"] = row.Mobile;
          tableRow["Name"] = row.Name;
          tableRow["IdNum"] = row.IdNum;
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["From"] = this.getStateMsg(row.From);


          this.tableRows.push(tableRow);
      },

      getStateMsg(s) {
            //激活+实名状态,0未实名，1已激活，2已实名
            let msg;
            switch (s) {
                case 0:
                    msg = "实名接口"
                    break;
                case 1:
                    msg = "管理后台"
                    break;
            }
            return msg;
        },
      onOperateChanged(value) {
        this.formModel.operate = value
      },
    }
  }
</script>

<style scoped>
</style>
