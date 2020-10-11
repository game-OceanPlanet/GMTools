<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form ref="formInline" :model="playerModel" inline>
      <FormItem prop="openId">
      </FormItem>
      <FormItem prop="Mobile">
        <Input type="text" v-model="playerModel.Mobile" placeholder="手机号">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="leftDay">
        <Input type="text" v-model="playerModel.leftDay" placeholder="剩余时间(天)">
        </Input>
      </FormItem>
      <FormItem prop="leftHour">
        <Input type="text" v-model="playerModel.leftHour" placeholder="剩余时间(小时)">
        </Input>
      </FormItem>
      <FormItem prop="leftMinute">
        <Input type="text" v-model="playerModel.leftMinute" placeholder="剩余时间(分钟)">
        </Input>
      </FormItem>
      <FormItem prop="waitMinute">
        <Input type="text" v-model="playerModel.waitMinute" placeholder="等待时间(分钟)">
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="addSubmit('playerModel')">增加</Button>
      </FormItem>
      <Button type="primary" @click="handleSubmit('playerModel')">查询</Button>
     
      <Table border :columns="tableColumns" :data="tableRows"></Table>
    </Form>
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
        playerModel: {
          Mobile: "",
          leftDay: "",
          leftHour: "",
          leftMinute: "",
          waitMinute:""
        },

        editable:false,
        editIndex:0,

        tableColumns: [
          {
            title: '手机号',
            key: 'Mobile',
            align: 'center'
          },
          {
            title: '开始排队时间',
            key: 'CreateTime',
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
                        value: params.row.CreateTimeMini,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.CreateTimeMini = event.target.value;
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
                    params.row.CreateTime,
                  ),
              ])
              }
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
          // {
          //   title: '剩余排队时间(分钟)',
          //   key: 'LeftTime',
          //   align: 'center',
          //   render: (h, params) => {
          //     if(params.index != 0){
          //       return;
          //     }
          //     let t = this;
          //     if(t.editable && t.editIndex == params.index){
          //         return h("div", [
          //         h(
          //           "Input",
          //           {
          //             props: {
          //               type: "text",
          //               size: "small",
          //               value: params.row.LeftTime,
                        
          //             },
          //             on: {
          //               'on-change'(event) {
          //                 params.row.LeftTime = event.target.value;
          //                 t.tableRows[parseInt(params.index)] = params.row;
          //               }
          //             }
          //           },
          //         ),
          //       ]);
          //       return;
          //     }
          //     return h("div", [
          //       h(
          //           "span",
          //           {
          //             style: {
          //               color: "#00"
          //             },
          //           },
          //           params.row.LeftTime,
          //         ),
          //     ])
          //     }
          // },
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
            align: 'center'
          },
          {
            title: "操作",
            key: "action",
            width: 250,
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
                    style: {
                      marginRight: "8px"
                    },
                    on: {
                      click: () => {
                        this.onSaveItemHandler(params.index);
                      }
                    }
                  },
                  "保存"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.deleteItem(params.index);
                      }
                    }
                  },
                  "删除"
                ),
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
      handleSubmit() {
        services.getHttpClient().post({
            url: "/dragon/sysDolphinWaitList",
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
          url: '/dragon/sysDolphinWaitEdit',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            endTime: itemData.EndTime,
            mobile: itemData.Mobile,
            state: itemData.State,
            id:itemData.Id,
            createTime:itemData.CreateTimeMini,
            waitTime:itemData.WaitTime
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

          this.$Message.success('保存成功');
          this.handleSubmit();
        });
      },

      fillData(rows) {
        if(rows && rows.length > 0){
          rows.sort((a, b)=>{
            return parseInt(a.CreateTime) - parseInt(b.CreateTime);
          })
        }
          this.tableRows = [];
          let i = 0;
          rows.forEach((row) => {
          var tableRow = {};
          tableRow["Id"] = row.Id;
          tableRow["PlayerId"] = row.PlayerId;
          let startTime = parseInt(row.CreateTime);
          if(startTime > 0){
            tableRow["CreateTime"] = services.getFormattedToDateString(row.CreateTime);
          } else {
              tableRow["CreateTime"] = "";
          }
          tableRow["CreateTimeMini"] = row.CreateTime;
          
          tableRow["EndTime"] =  i == 0 ? services.getFormattedToDateString(row.EndTime) : "";
          tableRow["EndTime2"] = row.EndTime;
          let currTime = new Date().getTime();
          // let leftTime = parseInt(row.EndTime) - currTime;
          // leftTime = leftTime < 0 ? 0 : leftTime;
          // tableRow["LeftTime"] = i == 0? services.formatRemain4(leftTime / 1000) : "";
          tableRow["Mobile"] = row.Mobile;
          tableRow["WaitTime"] = Math.floor(parseInt(row.WaitTime));
          tableRow["State"] = row.State;
          //状态，0排队等待中，1产蛋中,2飞升中，3待孵化，4孵化中，5成为动物待受孕，6受孕中，7挂卖中，8售卖成功结束
          
          i ++;
          this.tableRows.push(tableRow);
        });
      },

      editorItem(index) {
        this.editIndex = index;
        this.editable = true;
      },

      onSaveItemHandler(index){
        let itemData = this.tableRows[index];
        itemData.EndTime = itemData.EndTime2
        if(itemData){
          this.onSaveSubmit(itemData);
        }
        this.editIndex = -1;
        this.editable = false;
      },

      addSubmit(index){
        if(!this.playerModel.Mobile){
          this.$Message.error("请输入手机号");
          return;
        }
        if(!this.playerModel.leftDay){
          this.playerModel.leftDay = 0;
        }
        if(!this.playerModel.leftHour){
          this.playerModel.leftHour = 0;
        }
        if(!this.playerModel.leftMinute){
          this.playerModel.leftMinute = 0;
        }
        if(!this.playerModel.waitMinute){
          this.playerModel.waitMinute = 0;
        }
        let day = parseInt(this.playerModel.leftDay);
        let hour = parseInt(this.playerModel.leftHour);
        let min = parseInt(this.playerModel.leftMinute);
        let wait = parseInt(this.playerModel.waitMinute);
        let curr = new Date().getTime();
        let endTime = curr + day * 24 * 3600 * 1000 + hour * 3600 * 1000 + min * 60 * 1000;
        let Mobile = this.playerModel.Mobile;
        services.getHttpClient().post({
        url: '/dragon/sysDolphinWaitAdd',
        body: {
          username: services.getUser().username,
          platform: services.getUser().platform,
          endTime: endTime,
          mobile: Mobile,
          state: 0,
          waitTime:wait,
          createTime:curr
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

        this.$Message.success('添加成功');
        this.handleSubmit();
      });
      },

    deleteItem(index){
        let itemData = this.tableRows[index];
          services.getHttpClient().post({
          url: '/dragon/sysDolphinWaitDel',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            id: itemData.Id,
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

          this.$Message.success('删除成功');
          this.handleSubmit();
        });
      },
      
  }
  }
</script>

<style scoped>
</style>
