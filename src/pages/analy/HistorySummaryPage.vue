<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <!-- <FormItem label="查询类型">
        <RadioGroup v-model="formModel.type">
          <Radio label="playerId">玩家ID</Radio>
          <Radio label="tel">手机号</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="玩家id">
        <Input v-model="formModel.roleId" placeholder="请选择需要查询玩家的ID或者手机号"></Input>
      </FormItem> -->
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
          type: 'playerId',
          roleId: ''
        },

        operateList: [],

        tableColumns: [
          {
            title: '日期',
            key: 'CreateTime',
            align: 'center'
          },
          {
            title: '当日总收入U',
            key: 'Diamond',
            align: 'center'
          },
          {
            title: '付费人数',
            key: 'Pay',
            align: 'center'
          },
          {
            title: '付费人次',
            key: 'PayCount',
            align: 'center'
          },
          {
            title: '注册人数',
            key: 'Register',
            align: 'center'
          },
          {
            title: '海洋星球活跃人数',
            key: 'OceanActive',
            align: 'center'
          },
          {
            title: '深海部落活跃人数',
            key: 'DeepActive',
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

      handleSubmit() {

        services.getHttpClient().post({
            url: "/dragon/statisticsList",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:100
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
          tableRow["CreateTime"] = services.getFormattedToDateString(parseInt(row.CreateTime));
          tableRow["Diamond"] = row.Diamond;
          tableRow["Pay"] = row.Pay;
          tableRow["PayCount"] = row.PayCount;
          tableRow["Register"] = row.Register;
          tableRow["OceanActive"] = row.OceanActive;
          tableRow["DeepActive"] = row.DeepActive;

          this.tableRows.push(tableRow);
        });
      },

      onOperateChanged(value) {
        this.formModel.operate = value
      },
    }
  }
</script>

<style scoped>
</style>
