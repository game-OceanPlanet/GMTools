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
            configName:"团队收益_TeamRate"
        },

        operateList: [],

        tableColumns: [
          {
            title: '编号',
            key: 'id',
            align: 'center',
          },
          {
            title: '团队人数',
            key: 'allCount',
            align: 'center',
          },
          {
            title: '直推人数',
            key: 'directCount',
            align: 'center'
          },
          {
            title: '非直推人数',
            key: 'otherCount',
            align: 'center'
          },
          {
            title: '团队收益',
            key: 'precent',
            align: 'center'
          },
        ],

        tableRows: []
      }
    },

    created() {
    },

    methods: {
      handleSubmit() {
        services.getHttpClient().post({
            url: "/dragon/teamRateList",
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
          tableRow["allCount"] = row.AllCount;
          tableRow["directCount"] = row.DirectCount;
          tableRow["otherCount"] = row.OtherCount;
          tableRow["precent"] = row.Precent;


          this.tableRows.push(tableRow);
        });
      },
    }
  }
</script>

<style scoped>
</style>
