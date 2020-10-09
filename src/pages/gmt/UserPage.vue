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
            title: '编号',
            key: 'PlayerId',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'Username',
            align: 'center'
          },
          {
            title: '权限等级',
            key: 'Authority',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'CreateTime',
            align: 'center'
          },
          {
            title: '创建者',
            key: 'CreateBy',
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
            url: "/dragon/adminPlayerList",
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
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["Username"] = row.Username;
          tableRow["Authority"] = row.Authority;
          tableRow["CreateTime"] = services.getFormattedToDateString(row.CreateTime);
          tableRow["CreateBy"] = row.CreateBy;

          this.tableRows.push(tableRow);
        });
      },
    }
  }
</script>

<style scoped>
</style>
