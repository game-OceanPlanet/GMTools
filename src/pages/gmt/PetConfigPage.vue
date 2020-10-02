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

        operateList: [],

        tableColumns: [
          {
            title: '宠物ID',
            key: 'id',
            align: 'center',
          },
          {
            title: '宠物名称',
            key: 'name',
            align: 'center',
          },
          {
            title: '等级',
            key: 'level',
            align: 'center'
          },
          {
            title: '周期',
            key: 'limitTime',
            align: 'center'
          },
          {
            title: '月化',
            key: 'monthly',
            align: 'center'
          },
          {
            title: '总产出',
            key: 'produce',
            align: 'center'
          },
          {
            title: 'U购买需要直推人数',
            key: 'directPerson',
            align: 'center'
          },
          {
            title: 'U购买需要团队规模',
            key: 'teamPerson',
            align: 'center'
          },
          {
            title: 'U购买价格',
            key: 'UBuyPrice',
            align: 'center'
          },
          {
            title: 'U购买限制数量',
            key: 'UBuyLimit',
            align: 'center'
          },
          {
            title: '购买价格',
            key: 'price',
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
          tableRow["name"] = row.Name;
          tableRow["level"] = row.Level;
          tableRow["limitTime"] = row.LimitTime;
          tableRow["monthly"] = row.Monthly;
          tableRow["produce"] = row.Produce;
          tableRow["directPerson"] = row.DirectPerson;
          tableRow["teamPerson"] = row.TeamPerson;
          tableRow["UBuyPrice"] = row.UbuyPrice;
          tableRow["UBuyLimit"] = row.UbuyLimit;
          tableRow["price"] = row.Price;

          this.tableRows.push(tableRow);
        });
      },
    }
  }
</script>

<style scoped>
</style>
