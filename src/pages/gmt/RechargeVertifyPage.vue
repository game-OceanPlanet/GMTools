<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="查询类型" v-if="formModel.inputVis">
        <RadioGroup v-model="formModel.type">
          <Radio label="playerId">玩家ID</Radio>
          <Radio label="tel">手机号</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="查询编号" v-if="formModel.inputVis">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem>
      <FormItem label="审核类型">
        <Select @on-change="onOperateChanged" v-model="formModel.currencyType"> filterable placeholder="请选择或直接输入关键字">
          <Option v-for="operate in operateList" :key="operate.name" :value="operate.type">{{ operate.name }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
      </FormItem>
      <Table border :columns="tableColumns" :data="tableRows"></Table>
    </Form>

    <Modal v-model="showAlert" width="360" class-name="alert-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提现审核</span>
      </p>
      <div style="text-align:center">
        <Input v-model="verPasswd" placeholder="请输入审核提现的密码"></Input>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" style="margin-right: 20px" @click="handleAlertSure">确认</Button>
        <Button type="error" style="margin-left: 20px" @click="refreshApplyCon">取消</Button>
      </div>
    </Modal>
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
          type: 'playerId',
          roleId: '',
          currencyType:1,
          inputVis:false
        },

        showAlert: false,
        verPasswd:"",
        currSelectedIndex:0,

        operateList: [],

        tableColumns: [
          {
            title: '玩家ID',
            key: 'PlayerId',
            align: 'center',
          },
          {
            title: 'ID',
            key: 'Id',
            align: 'center',
          },
          {
            title: '手机',
            key: 'Mobile',
            align: 'center',
          },
          {
            title: '提取数量',
            key: 'Money',
            align: 'center'
          },
          {
            title: '手续费',
            key: 'Fee',
            align: 'center'
          },
          {
            title: '提取地址',
            key: 'FromAddress',
            align: 'center'
          },
          {
            title: '到账地址',
            key: 'ToAddress',
            align: 'center'
          },
          {
            title: 'Hash值',
            key: 'Hash',
            align: 'center'
          },
          {
            title: '审核时间',
            key: 'CheckTime',
            align: 'center'
          },
          {
            title: '提取时间',
            key: 'CreateTime',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'State',
            align: 'center'
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.passApply(params.index);
                      }
                    }
                  },
                  "通过"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.refuseApply(params.index);
                      }
                    }
                  },
                  "拒绝"
                )
              ]);
            }
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


       handleAlertSure() {
         this.showAlert = false;
         let index = this.currSelectedIndex;
         if(!this.verPasswd){
            this.$Message.error('请输入审核密码');
            return;
         }
         let pwd = this.verPasswd;
         let itemData = this.tableRows[index];
            services.getHttpClient().post({
            url: '/dragon/cashOutOrderCheck',
            body: {
                username: services.getUser().username,
                platform: services.getUser().platform,
                id: itemData.Id,
                playerId: itemData.PlayerId,
                check: 1,
                password:pwd
            }
            }, (error, response, body) => {
            if (error) {
                this.$Message.error(error.toString());
                return;
            }

            if (body.code != 0) {
                this.$Message.error("提交失败，请检查配置,错误码："+body.code);
                return;
            }

            this.$Message.success('通过审核成功');
            this.handleSubmit();
            });
      },

        passApply(index){
          this.showAlert = true;
          this.currSelectedIndex = index;
        },

        refuseApply(index){
            this.showAlert = true;
          this.currSelectedIndex = index;
        },

        refreshApplyCon(){
          this.showAlert = false;
          let index = this.currSelectedIndex;
        //  if(!this.verPasswd){
        //     this.$Message.error('请输入审核密码');
        //     return;
        //  }
          let itemData = this.tableRows[index];
            services.getHttpClient().post({
            url: '/dragon/cashOutOrderCheck',
            body: {
                username: services.getUser().username,
                platform: services.getUser().platform,
                id: itemData.Id,
                playerId: itemData.PlayerId,
                check: 0,
                password:"1"
            }
            }, (error, response, body) => {
            if (error) {
                this.$Message.error(error.toString());
                return;
            }

            if (body.code != 0) {
                this.$Message.error("提交失败，请检查配置,错误码："+body.code);
                return;
            }

            this.$Message.success('拒绝审核成功');
            });
        },


      onOperateChanged(value) {
          this.formModel.currencyType = value;
          this.formModel.inputVis = this.formModel.currencyType == 5;
      },
      fetchOperateList() {
        this.operateList = [];
        let moneyNames = ["待审核","已操作的","已拒绝的","已通过的","指定玩家","全部"];
        for(var i = 0; i < moneyNames.length; i ++){
          this.operateList.push({"name": moneyNames[i], "type": i + 1})      
        }
      },

      handleSubmit() {
        var type = this.formModel.type;

        var id = this.formModel.roleId;
        if (this.formModel.currencyType == 5 && id.length === 0) {
          this.$Message.error('请正确填入查询编号');
          return
        }

        this.tableRows.length = 0;

        let playerId = "";
        let mobile = "";
        if(type == "playerId"){
          playerId = id;
        } else if(type == "tel"){
          mobile = id;
        }

        let moneyType = this.formModel.currencyType - 1;

        services.getHttpClient().post({
            url: "/dragon/cashOutOrderList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:this.pageModel.currentPage,
            pageSize:this.pageModel.pageCount,
            type:moneyType,
            playerId:playerId,
            mobile:mobile
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error("参数输入错误，请重新输入。错误码："+body.code);
            return;
          }

          this.fillData(body.msg.value);
        });
      },



      fillData(rows) {
          this.tableRows = [];
        rows.forEach((row) => {
          var tableRow = {};
          // let moneyType = this.formModel.currencyType;
          // tableRow["moneyType"] = this.operateList[moneyType - 1];
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["Id"] = row.Id;
          tableRow["Mobile"] = row.Mobile;
          tableRow["Money"] = row.Money;
          tableRow["Fee"] = row.Fee;
          tableRow["FromAddress"] = row.FromAddress;
          tableRow["ToAddress"] = row.ToAddress;
          tableRow["Hash"] = row.Hash;
          tableRow["CheckTime"] = services.getFormattedToDateString(row.CheckTime);
          tableRow["CreateTime"] = services.getFormattedToDateString(row.CreateTime);
          tableRow["State"] = this.getState(row.State);//0提交成功待审核，2拒绝，3审核通过

          this.tableRows.push(tableRow);
        });
      },

      getState(s){
        switch(s){
          case 0:
            return "待审核";
          case 2:
            return "拒绝";
          case 3:
            return "审核通过";
        }
        return s;
      },

      getType(s) {
            let msg;
            // switch (s) {
            //     case 0:
            //         msg = "待审核"
            //         break;
            //     case 1:
            //         msg = "已操作的"
            //         break;
            //     case 2:
            //         msg = "交易卖出"
            //         break;
            //     case 3:
            //         msg = "交易购买"
            //         break;
            //     case 4:
            //         msg = "交易购买"
            //         break;
            //     case 5:
            //         msg = "交易购买"
            //         break;
            // }
            // return msg;["","","","已通过的","指定玩家","全部"];
        }
    }
  }
</script>

<style scoped>
</style>
