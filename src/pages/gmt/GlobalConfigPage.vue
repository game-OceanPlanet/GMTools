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
            configName:"CommonConfig"
        },

        operateList: [],

        tableColumns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center',
          },
          {
            title: '参数',
            key: 'param',
            align: 'center',
          },
          {
            title: '描述',
            key: 'dec',
            align: 'center'
          },
          {
            title: '原始描述',
            key: 'sdes',
            align: 'center'
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
            url: "/dragon/sysConfigList",
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

          if (!body.msg || !body.msg.value || body.msg.value.length === 0) {
            return
          }

          this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["id"] = row.Id;
          tableRow["param"] = row.Param;
          tableRow["dec"] = row.Dec;
          tableRow["sdes"] = row.SrcDec;


          this.tableRows.push(tableRow);
        });
      },
    }
  }
</script>

<style scoped>
</style>
