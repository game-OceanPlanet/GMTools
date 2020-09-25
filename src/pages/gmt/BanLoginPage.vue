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
      <FormItem label="操作类型">
        <RadioGroup v-model="formModel.type">
          <Radio label="ban">封号</Radio>
          <Radio label="allow">解禁</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="时长(小时)" v-if="formModel.type === 'ban'">
        <Input v-model="formModel.duration" placeholder=""></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">确认修改</Button>
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
          type: 'ban',
          duration: '',
        }
      }
    },

    methods: {
      handleSubmit() {
        if (!services.checkGmtAuthor(2)) {
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
        if (!roleId || roleId < 0) {
          this.$Message.error('请正确填入玩家id');
          return
        }

        // 禁言时长（小时）
        var duration = 0;
        if (this.formModel.type === 'ban') {
          duration = parseInt(this.formModel.duration);
          if ((duration !== 0 && !duration) || duration <= 0) {
            this.$Message.error('请正确填入封停时长');
            return
          }
        }

        this.banLogin(zoneId, roleId, duration);
      },

      /**
       * 封停登录
       * @param zoneId 服务器id
       * @param roleId 角色id
       * @param duration 封停时长（小时）
       */
      banLogin(zoneId, roleId, duration) {
        services.getHttpClient().post({
          url: '/xy/gmt/ban',
          body: {
            ban_type: 2,
            role_id: roleId,
            server_id: zoneId,
            ban_duration: duration
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

          this.$Message.success('操作成功');
        });
      }
    },

    components: {
      ZoneSelect,
      RegionSelect
    }
  }
</script>
