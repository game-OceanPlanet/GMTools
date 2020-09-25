<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="操作时间">
        <DatePicker></DatePicker>
      </FormItem>
      <FormItem label="服务器">
        <ZoneSelect v-model="formModel.zone"></ZoneSelect>
      </FormItem>
      <FormItem label="角色名">
        <Input v-model="formModel.roleName" placeholder="输入玩家名称"></Input>
      </FormItem>
      <FormItem label="操作内容">
        <Select @on-change="onOperateChanged" filterable placeholder="请选择或直接输入关键字">
          <Option v-for="operate in operateList" :value="operate.id" :key="operate.id">{{ operate.name }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
      </FormItem>
      <ChartTitle text="查询结果"></ChartTitle>
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
          zone: '',
          roleName: '',
          operate: ''
        },

        operateList: [],

        tableColumns: [
          {
            title: '角色名',
            key: 'roleName',
            align: 'center'
          },
          {
            title: '角色id',
            key: 'roleId',
            align: 'center'
          },
          {
            title: '操作类型',
            key: 'operate',
            align: 'center'
          },
          {
            title: '更改类型',
            key: 'updateType',
            align: 'center'
          },
          {
            title: '更改数量',
            key: 'updateNum',
            align: 'center'
          },
          {
            title: '剩余数量',
            key: 'currentNum',
            align: 'center'
          },
          {
            title: '日期',
            key: 'date',
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
      fetchOperateList() {
        this.operateList = [];
        for (var key in services.operateMap) {
          if (services.operateMap.hasOwnProperty(key)) {
            this.operateList.push({"id": key, "name": services.operateMap[key]})
          }
        }
      },

      handleSubmit() {
        var zoneId = this.formModel.zone;
        if (typeof zoneId === 'string') {
          this.$Message.error('请先选择服务器');
          return
        }

        var roleName = this.formModel.roleName;
        if (roleName.length === 0) {
          this.$Message.error('请正确填入玩家名称');
          return
        }

        var operate = parseInt(this.formModel.operate);

        services.getHttpClient().post({
          url: '/xy/analy/query_role_amount',
          body: {
            zone: zoneId,
            role_name: roleName,
            operate: operate,
            date: services.getSelectedDate()
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

          if (!body.data || body.data.length === 0) {
            return
          }

          this.fillData(body.data)
        });
      },

      fillData(rows) {
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["roleName"] = row.role_name;
          tableRow["roleId"] = row.role_id;
          tableRow["operate"] = services.getOperateName(row.operate);
          tableRow["updateType"] = row.update_type === 1 ? "流入" : "流出";
          tableRow["updateNum"] = row.update_num;
          tableRow["currentNum"] = row.current_num;
          tableRow["date"] = row.date;

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
