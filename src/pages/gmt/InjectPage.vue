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
            configName:"OTC_InjectCycle"
        },

        editable:false,
        editIndex:0,

        operateList: [],
			
        tableColumns: [
          {
            title: '周期ID',
            key: 'id',
            align: 'center',
          },
          {
            title: '权重',
            key: 'weights',
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
                        value: params.row.weights,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.weights = event.target.value;
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
                    params.row.weights,
                  ),
              ])
              }
          },
          {
            title: '周期时长',
            key: 'cycle',
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
                        value: params.row.cycle,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.cycle = event.target.value;
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
                    params.row.cycle,
                  ),
              ])
              }
          },
          {
            title: '周期描述',
            key: 'des',
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
                        value: params.row.des,
                        
                      },
                      on: {
                        'on-change'(event) {
                          params.row.des = event.target.value;
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
                    params.row.des,
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
            url: "/dragon/injectCycleList",
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
          tableRow["weights"] = row.Weights;
          tableRow["cycle"] = row.Cycle;
          tableRow["des"] = row.Dec;


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
          url: '/dragon/injectCycleEdit',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            id: itemData.id,
            weights: itemData.weights,
            cycle: itemData.cycle,
            dec: itemData.des
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
