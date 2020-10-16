<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="查询类型">
        <RadioGroup v-model="formModel.type">
          <Radio label="allEffect">所有有效</Radio>
          <Radio label="ocean">海洋星球有效</Radio>
          <Radio label="deep">深海部落有效</Radio>
          <Radio label="notEffect">无效</Radio>
          <Radio label="all">所有</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="查询编号">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
      </FormItem>
      <Table border :columns="tableColumns" :data="tableRows"></Table>
    </Form>
    <br>
    <Row style="text-align: center">
        <Page
          ref="pageView"
          :page-size-opts="this.pageModel.pageNums"
          :total="this.pageModel.totalCount"
          :current="this.pageModel.currentPage"
          :page-size="this.pageModel.pageCount"
          placement="top"
          @on-change="onPageChange()"
          @on-page-size-change="onPageChange()"
          show-sizer
        />
    </Row>
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
        pageModel: {
          totalCount: 100,
          pageCount: 20,
          currentPage: 1,
          pageNums: [20, 30, 50, 80, 100]
        },

        formModel: {
          type: 'allEffect',
          roleId: '',
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
            title: '直推有效规模',
            key: 'DirectEffectNum',
            align: 'center'
          },
          {
            title: '团队有效规模',
            key: 'EffectNum',
            align: 'center'
          },
          {
            title: '激活实名状态',
            key: 'State',
            align: 'center'
          },
          {
            title: '游戏激活状态',
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
      onPageChange() {
        this.pageModel.currentPage = this.$refs.pageView.currentPage;
        this.pageModel.pageCount = this.$refs.pageView.currentPageSize;
        this.handleSubmit();
      },

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

        var type = this.formModel.type;
        var typeValue = 0;
        if(type == "allEffect"){
          typeValue = 0;
        } else if(type == "ocean"){
          typeValue = 1;
        }else if(type == "deep"){
          typeValue = 2;
        }else if(type == "notEffect"){
          typeValue = 3;
        }else if(type == "all"){
           typeValue = 4;
         }

      var id = this.formModel.roleId;
       if (id.length === 0) {
         this.$Message.error('请正确填入查询编号');
         return
       }

        services.getHttpClient().post({
            url: "/dragon/teamPlayerList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:this.pageModel.currentPage,
            pageSize:this.pageModel.pageCount,
            type:typeValue,
            roleId:id
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
          tableRow["CreateTime"] = services.getFormattedToDateString(parseInt(row.CreateTime));
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["LoginTime"] = services.getFormattedToDateString(parseInt(row.LoginTime)  * 1000);
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
          tableRow["EffectNum"] = row.EffectNum;
          tableRow["State"] = this.getStateMsg(row.State);
          tableRow["GameState"] = this.getGameStateMsg(row.GameState);

          this.tableRows.push(tableRow);
        });
      },

      getStateMsg(s) {
            //激活+实名状态,0未实名，1已激活，2已实名
            let msg;
            switch (s) {
                case 0:
                    msg = "未实名"
                    break;
                case 1:
                    msg = "已激活"
                    break;
                case 2:
                    msg = "已实名"
                    break;
            }
            return msg;
        },
      getGameStateMsg(s) {
            //A游戏激活，2:B游戏激活,所以3表示两个都激活了
            let msg;
            switch (s) {
                case 0:
                    msg = "未激活"
                    break;
                case 1:
                    msg = "已激活海洋星球"
                    break;
                case 2:
                    msg = "已激活深海部落"
                    break;
                case 3:
                    msg = "都已激活"
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
