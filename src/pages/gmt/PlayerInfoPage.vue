<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="游戏名称">
        <ZoneSelect v-model="formModel.zone"></ZoneSelect>
      </FormItem>
      <FormItem label="服务器">
        <ZoneSelect v-model="formModel.zone"></ZoneSelect>
      </FormItem>
      <FormItem label="玩家ID">
        <Input v-model="formModel.roleName" placeholder="输入玩家名称"></Input>
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
            title: '手机号',
            key: 'roleName',
            align: 'center'
          },
          {
            title: '真实姓名',
            key: 'operate',
            align: 'center'
          },
          {
            title: '身份证号',
            key: 'operate',
            align: 'center'
          },
          {
            title: '注册时间',
            key: 'operate',
            align: 'center'
          },
          {
            title: '角色id',
            key: 'roleId',
            align: 'center'
          },
          {
            title: '最近登录',
            key: 'updateType',
            align: 'center'
          },
          {
            title: '最近离线',
            key: 'updateNum',
            align: 'center'
          },
          {
            title: '累计充值金额',
            key: 'currentNum',
            align: 'center'
          },
          {
            title: '累计充值次数',
            key: 'date',
            align: 'center'
          },
          {
            title: 'USDT',
            key: 'date',
            align: 'center'
          },
          {
            title: '金币',
            key: 'date',
            align: 'center'
          },
          {
            title: '平台币',
            key: 'date',
            align: 'center'
          },
          {
            title: '积分',
            key: 'date',
            align: 'center'
          },
          {
            title: '我的上级ID',
            key: 'date',
            align: 'center'
          },
          {
            title: '直推规模',
            key: 'date',
            align: 'center'
          },
          {
            title: '团队规模',
            key: 'date',
            align: 'center'
          },
          {
            title: '账号状态',
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
