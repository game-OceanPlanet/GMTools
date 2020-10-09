<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="配置名称">
        <Input v-model="formModel.configName" placeholder="配置表名称"></Input>
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
            configName:"Pet"
        },
        editable:false,
        editIndex:0,

        operateList: [],

        tableColumns: [
          {
            title: '宠物ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '宠物名称',
            key: 'name',
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
                        value: params.row.name,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.name = event.target.value;
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
                    params.row.name,
                  ),
              ])
              }
          },
          {
            title: '等级',
            key: 'level',
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
                        value: params.row.level,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.level = event.target.value;
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
                    params.row.level,
                  ),
              ])
              }
          },
          {
            title: '周期',
            key: 'limitTime',
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
                        value: params.row.limitTime,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.limitTime = event.target.value;
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
                    params.row.limitTime,
                  ),
              ])
              }
          },
          {
            title: '月化',
            key: 'monthly',
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
                        value: params.row.monthly,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.monthly = event.target.value;
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
                    params.row.monthly,
                  ),
              ])
              }
          },
          {
            title: '总产出',
            key: 'produce',
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
                        value: params.row.produce,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.produce = event.target.value;
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
                    params.row.produce,
                  ),
              ])
              }
          },
          {
            title: 'U购买需要直推人数',
            key: 'directPerson',
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
                        value: params.row.directPerson,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.directPerson = event.target.value;
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
                    params.row.directPerson,
                  ),
              ])
              }
          },
          {
            title: 'U购买需要团队规模',
            key: 'teamPerson',
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
                        value: params.row.teamPerson,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.teamPerson = event.target.value;
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
                    params.row.teamPerson,
                  ),
              ])
              }
          },
          {
            title: 'U购买价格',
            key: 'UBuyPrice',
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
                        value: params.row.UBuyPrice,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.UBuyPrice = event.target.value;
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
                    params.row.UBuyPrice,
                  ),
              ])
              }
          },
          {
            title: 'U购买限制数量',
            key: 'UBuyLimit',
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
                        value: params.row.UBuyLimit,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.UBuyLimit = event.target.value;
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
                    params.row.UBuyLimit,
                  ),
              ])
              }
          },
          {
            title: 'U购买星级',
            key: 'UBuyStar',
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
                        value: params.row.UBuyStar,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.UBuyStar = event.target.value;
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
                    params.row.UBuyStar,
                  ),
              ])
              }
          },
          {
            title: '购买价格',
            key: 'price',
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
                        value: params.row.price,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.price = event.target.value;
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
                    params.row.price,
                  ),
              ])
              }
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
      handleSubmit() {
        services.getHttpClient().post({
            url: "/dragon/fishConfigList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
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

          this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        this.tableRows.length = 0;
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["id"] = row.Id;
          tableRow["name"] = row.Name;
          tableRow["level"] = row.Level;
          tableRow["limitTime"] = row.LimitTime;
          tableRow["monthly"] = row.Monthly;
          tableRow["produce"] = row.Produce;
          tableRow["directPerson"] = row.DirectPerson;
          tableRow["teamPerson"] = row.TeamPerson;
          tableRow["UBuyPrice"] = row.UbuyPrice;
          tableRow["UBuyLimit"] = row.UbuyLimit;
          tableRow["UBuyStar"] = row.UbuyStar;
          tableRow["price"] = row.Price;

          this.tableRows.push(tableRow);
        });
      },

      editorItem(index) {
        this.editIndex = index;
        this.editable = true;
      },

      onSaveItemHandler(index){
        let itemData = this.tableRows[index];
        if(itemData){
          this.onSaveSubmit(itemData);
        }
        this.editIndex = -1;
        this.editable = false;
      },

      onSaveSubmit(itemData) {
        services.getHttpClient().post({
          url: '/dragon/fishConfigEdit',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            id: itemData.id,
            name: itemData.name,
            level: itemData.level,
            limitTime: itemData.limitTime,
            monthly: itemData.monthly,
            produce: itemData.produce,
            directPerson: itemData.directPerson,
            teamPerson: itemData.teamPerson,
            ubuyPrice: itemData.UBuyPrice,
            ubuyLimit: itemData.UBuyLimit,
            ubuyStar: itemData.UBuyStar,
            price: itemData.price
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
        });
      },
    }
  }
</script>

<style scoped>
</style>
