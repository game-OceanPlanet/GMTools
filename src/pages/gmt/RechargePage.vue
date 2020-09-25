<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="服务器">
        <ZoneSelect v-model="formModel.selectedZoneId"></ZoneSelect>
      </FormItem>
      <FormItem label="玩家id">
        <Input v-model="formModel.roleId" placeholder="输入玩家id（可在“玩家管理-查询”页面通过玩家名称查询到玩家id）"></Input>
      </FormItem>
      <FormItem label="充值项">
        <Cascader v-model="selectedCascaderValue" :data="cascaderData" placeholder="请选择或搜索" trigger="hover"
                  filterable></Cascader>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">确认充值</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import * as services from '@/services'
  import ZoneSelect from '@/components/ZoneSelect'
  import RegionSelect from '@/components/RegionSelect'

  export default {
    data() {
      return {
        formModel: {
          selectedZoneId: '',
          roleId: '',
          rechargeItemId: ''
        },
        cascaderData: [],
        selectedCascaderValue: [],
      }
    },

    created() {
      this.fetchRechargeItemList();
    },

    methods: {
      fetchRechargeItemList() {
        services.getHttpClient().post({
          url: '/xy/gmt/query_recharge_item_list'
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error(body.msg);
            return;
          }

          var rechargeItemList = body.data.list;

          var nonApplePayRechargeItems = [];
          var applePayRechargeItems = [];
          var normalRechargeItems = [];
          for (var i = 0; i < rechargeItemList.length; i++) {
            var rechargeItem = rechargeItemList[i];
            if (rechargeItem.platform_type === 1) {
              nonApplePayRechargeItems.push({value: rechargeItem.id, label: rechargeItem.desc});
            } else if (rechargeItem.platform_type === 2) {
              applePayRechargeItems.push({value: rechargeItem.id, label: rechargeItem.desc});
            } else if (rechargeItem.platform_type === 0) {
              normalRechargeItems.push({value: rechargeItem.id, label: rechargeItem.desc});
            }
          }

          this.cascaderData = [
            {
              value: "nonApplePay",
              label: "安卓支付",
              children: nonApplePayRechargeItems
            },
            {
              value: "applePay",
              label: "苹果支付",
              children: applePayRechargeItems
            },
            {
              value: "normalPay",
              label: "通用礼包",
              children: normalRechargeItems
            }
          ];
        });
      },

      handleSubmit() {
        if (!services.checkGmtAuthor(1)) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 服务器id
        var zoneId = this.formModel.selectedZoneId;
        if (typeof zoneId === 'string') {
          this.$Message.error('请先选择服务器');
          return
        }

        // 玩家id
        var roleId = parseInt(this.formModel.roleId);
        if (!roleId || roleId <= 0) {
          this.$Message.error('请正确填入玩家id');
          return
        }

        // 充值项目id
        if (this.selectedCascaderValue.length === 0) {
          this.$Message.error('请选择充值项');
          return
        }

        var rechargeItemId = this.selectedCascaderValue[this.selectedCascaderValue.length - 1];
        if (!rechargeItemId || rechargeItemId.length <= 0) {
          this.$Message.error('请选择充值项');
          return
        }

        this.recharge(zoneId, roleId, rechargeItemId);
      },

      /**
       * 充值
       * @param zoneId 服务器id
       * @param roleId 角色id
       * @param rechargeItemId 充值项目id
       */
      recharge(zoneId, roleId, rechargeItemId) {
        var uid = roleId % 10000000000;

        services.getHttpClient().post({
          url: '/xy/gmt/recharge',
          body: {
            server_id: zoneId,
            role_id: roleId,
            uid: uid,
            item_id: rechargeItemId
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

          this.$Message.success('充值成功');
        });
      }
    },

    components: {
      ZoneSelect,
      RegionSelect
    }
  }
</script>
