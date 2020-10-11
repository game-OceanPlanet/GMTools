<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
         <Button type="error" @click="completeSubmit">一键领养</Button>
      </FormItem>
      <Table border :columns="tableColumns" :data="tableRows"></Table>
    </Form>

    <Modal v-model="showAlert" width="360" class-name="alert-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>危险操作</span>
      </p>
      <div style="text-align:center">
        <p>确认要让所有玩家立即结束排队等待？</p>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" style="margin-right: 20px" @click="handleAlertSure">确认</Button>
        <Button type="error" style="margin-left: 20px" @click="showAlert=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import * as services from '@/services'
  import RegionSelect from '@/components/RegionSelect'
  import ChartTitle from '@/components/ChartTitle'

  export default {
    components: {
      RegionSelect,
      ChartTitle
    },

    data() {
      return {
        formModel: {
          type: 'playerId',
          roleId: ''
        },

        editable:false,
        editIndex:0,
        showAlert: false,

        tableColumns: [
          {
            title: '角色id',
            key: 'PlayerId',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'Mobile',
            align: 'center'
          },
          {
            title: '开始排队时间',
            key: 'CreateTime',
            align: 'center'
          },
          {
            title: '排队结束时间',
            key: 'EndTime',
            align: 'center',
            // render: (h, params) => {
            //   let t = this;
            //   if(t.editable && t.editIndex == params.index){
            //       return h("div", [
            //       h(
            //         "Input",
            //         {
            //           props: {
            //             type: "text",
            //             size: "small",
            //             value: params.row.EndTime,
                        
            //           },
            //           on: {
            //             'on-change'(event) {
            //               params.row.EndTime = event.target.value;
            //               t.tableRows[parseInt(params.index)] = params.row;
            //             }
            //           }
            //         },
            //       ),
            //     ]);
            //     return;
            //   }
            //   return h("div", [
            //     h(
            //         "span",
            //         {
            //           style: {
            //             color: "#00"
            //           },
            //         },
            //         params.row.EndTime,
            //       ),
            //   ])
            //   }
          },
          {
            title: '剩余排队时间(分钟)',
            key: 'LeftTime',
            align: 'center',
            render: (h, params) => {
              let t = this;
              if(t.editable && t.editIndex == params.index){
                  return h("div", [
                  h(
                    "Input",
                    {
                      props: {
                        type: "text",
                        size: "small",
                        value: params.row.LeftTime,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.LeftTime = event.target.value;
                          t.tableRows[parseInt(params.index)] = params.row;
                        }
                      }
                    },
                  ),
                ]);
                return;
              }
              return h("div", [
                h(
                    "span",
                    {
                      style: {
                        color: "#00"
                      },
                    },
                    params.row.LeftTime,
                  ),
              ])
              }
          },
          {
            title: '等待时间(分钟)',
            key: 'WaitTime',
            align: 'center',
            render: (h, params) => {
              let t = this;
              if(t.editable && t.editIndex == params.index){
                  return h("div", [
                  h(
                    "Input",
                    {
                      props: {
                        type: "text",
                        size: "small",
                        value: params.row.WaitTime,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.WaitTime = event.target.value;
                          t.tableRows[parseInt(params.index)] = params.row;
                        }
                      }
                    },
                  ),
                ]);
                return;
              }
              return h("div", [
                h(
                    "span",
                    {
                      style: {
                        color: "#00"
                      },
                    },
                    params.row.WaitTime,
                  ),
              ])
              }
          },
          {
            title: '状态',
            key: 'State',
            align: 'center',
            // render: (h, params) => {
            //   let t = this;
            //   if(t.editable && t.editIndex == params.index){
            //       return h("div", [
            //       h(
            //         "Input",
            //         {
            //           props: {
            //             type: "text",
            //             size: "small",
            //             value: params.row.State,
                        
            //           },
            //           on: {
            //             'on-change'(event) {
            //               params.row.State = event.target.value;
            //               t.tableRows[parseInt(params.index)] = params.row;
            //             }
            //           }
            //         },
            //       ),
            //     ]);
            //     return;
            //   }
            //   return h("div", [
            //     h(
            //         "span",
            //         {
            //           style: {
            //             color: "#00"
            //           },
            //         },
            //         params.row.State,
            //       ),
            //   ])
            //   }
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
                      type: "warning",
                      size: "small"
                    },
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.editorItem(params.index);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.onSaveItemHandler(params.index);
                      }
                    }
                  },
                  "保存"
                )
              ]);
            }
          }
        ],

        tableRows: []
      }
    },

    created() {
    },

    methods: {
      handleAlertSure(){
        this.showAlert = false;
        let datas = this.tableRows;
        if(datas && datas.length > 0){
          let len = datas.length;
          let completeIds = "";
          for(var i = 0; i < len; i ++){
            let item = datas[i];
            if(item.State == 0){
              if(i == len - 1){
                completeIds += item.Id + "," + item.PlayerId;
              } else {
                completeIds += item.Id + "," + item.PlayerId + ";";
              }
            }
          }

          let curr = new Date().getTime();
          services.getHttpClient().post({
            url: '/dragon/dolphinWaitBatchEdit',
            body: {
              username: services.getUser().username,
              platform: services.getUser().platform,
              idStr: completeIds,
              waitTime:0,
              endTime:curr,
              state:0
            }
          }, (error, response, body) => {
            if (error) {
              this.$Message.error(error.toString());
              return;
            }

            if (body.code != 0) {
              // this.$Message.error("提交失败，请检查配置,错误码："+body.code);
              return;
            }

            this.$Message.success('修改成功');
            this.handleSubmit();
          });
        }
      },

      handleSubmit() {
        services.getHttpClient().post({
            url: "/dragon/dolphinWaitList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:300,
            state:0
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

      onSaveSubmit(itemData) {
        services.getHttpClient().post({
          url: '/dragon/dolphinWaitEdit',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            id: itemData.Id,
            playerId: itemData.PlayerId,
            endTime: itemData.EndTime,
            state: 0,
            waitTime:itemData.WaitTime
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error("提交失败，请检查配置,错误码："+body.code);
            return;
          }

          this.$Message.success('保存成功');
        });
      },

      fillData(rows) {
        if(rows && rows.length > 0){
          rows.sort((a, b)=>{
             return parseInt(a.CreateTime) - parseInt(b.CreateTime);
          })
        }
          this.tableRows.length = 0;
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["Id"] = row.Id;
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["CreateTime"] = services.getFormattedToDateString(row.CreateTime);
          tableRow["EndTime"] = services.getFormattedToDateString(row.EndTime);
          let currTime = new Date().getTime();
          let leftTime = parseInt(row.EndTime) - currTime;
          leftTime = leftTime < 0 ? 0 : leftTime;
          tableRow["LeftTime"] = Math.floor(leftTime / 60 / 1000);
          tableRow["Mobile"] = row.Mobile;
          tableRow["State"] = this.getState(row.State);
          tableRow["WaitTime"] = row.WaitTime;
          tableRow["WaitTimeMini"] = parseInt(row.WaitTime) * 60 * 1000;
          //状态，0排队等待中，1产蛋中,2飞升中，3待孵化，4孵化中，5成为动物待受孕，6受孕中，7挂卖中，8售卖成功结束
          
          this.tableRows.push(tableRow);
        });
      },

      getState(state){
        switch(state){
          case 0:
            return "等待排队中"
            break;
            case 1:
            return "产蛋中"
            break;
            case 2:
            return "飞升中"
            break;
            case 3:
            return "待孵化"
            break;
            case 4:
            return "孵化中"
            break;
            case 5:
            return "成为动物待受孕"
            break;
             case 6:
            return "受孕中"
            break;
             case 7:
            return "挂卖中"
            break;
             case 8:
            return "售卖成功结束"
            break;
        }
        return "状态错误"
      },

      editorItem(index) {
        this.editIndex = index;
        this.editable = true;
      },

      onSaveItemHandler(index){
        let itemData = this.tableRows[index];
        let leftTime = parseInt(itemData.LeftTime);
        let currTime = new Date().getTime();
        itemData.EndTime = currTime + leftTime * 60 * 1000;
        itemData.EndTime = itemData.EndTime < currTime ? currTime : itemData.EndTime;
        itemData.WaitTimeMini = parseInt(itemData.WaitTime) * 60 * 1000;
        if(itemData){
          this.onSaveSubmit(itemData);
        }
        this.editIndex = -1;
        this.editable = false;
      },

      completeSubmit(){
        this.showAlert = true;
      },

    }
  }
</script>

<style scoped>
</style>
