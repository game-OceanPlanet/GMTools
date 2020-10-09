<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form ref="form" :model="formModel" :label-width="80">
      <FormItem label="发送范围">
        <RadioGroup v-model="formModel.receiverZonesRange">
          <Radio label="some">当前大区内部分服务器</Radio>
          <Radio label="all">当前大区内所有服务器</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="服务器" v-if="formModel.receiverZonesRange === 'some'">
        <ZoneSelect v-model="formModel.selectedZoneIdList" multiple></ZoneSelect>
      </FormItem>
      <MailEditor ref="mailEditor" @on-change="sendMailCb"></MailEditor>
      <FormItem>
        <Button type="primary" :loading="loading" @click="handleSubmit">
          <span v-if="!loading">发送</span>
          <span v-else>发送中...</span>
        </Button>
      </FormItem>
    </Form>
    <Modal v-model="showAlert" width="360" class-name="alert-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>危险操作</span>
      </p>
      <div style="text-align:center">
        <p>确认要将该邮件发给【当前大区内所有服务器】？</p>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" style="margin-right: 20px" @click="handleAlertSure">确认</Button>
        <Button type="error" style="margin-left: 20px" @click="showAlert=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import * as services from '@/services'
  import RegionSelect from '@/components/RegionSelect'
  import ZoneSelect from '@/components/ZoneSelect'
  import MailEditor from '@/components/gmt/MailEditor'

  export default {
    data() {
      return {
        formModel: {
          selectedZoneIdList: [],
          receiverZonesRange: 'some'
        },
        showAlert: false,
        loading: false
      };
    },

    methods: {
      // 此函数的实现暂时留空，在弹警告窗时，会动态修改该函数的实现
      handleAlertSure() {
      },

      handleSubmit() {
        if (!services.checkGmtAuthor(1)) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 获取邮件编辑器组件的数据
        var mailEditorData = this.$refs.mailEditor.getData();
        if (!mailEditorData) {
          return;
        }

        // 邮件标题
        var title = mailEditorData.title;

        // 邮件正文
        var content = mailEditorData.content;

        // 附件列表
        var itemList = mailEditorData.itemList;

        // 待发送到的所有服务器的id
        var zoneIdList = [];

        // 是否要发送给当前大区内所有服务器
        var isToAll = this.formModel.receiverZonesRange === 'all';

        if (isToAll) {
          // 获取当前大区内所有服务器
          services.getHttpClient().post({
            url: '/xy/gmt/query_server_list',
            body: {
              include_merged: false
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

            if (!body.data || body.data.length === 0) {
              return
            }

            var zoneList = body.data;
            for (var i = 0; i < zoneList.length; i++) {
              var zone = zoneList[i];
              zoneIdList.push(zone.id);
            }

            // 注意，不能将这个调用和下面else里的调用提出来合在一起，因为这里是异步获取服务器列表，而下面else里是同步获取
            this.onGetZoneIdList(zoneIdList, isToAll, title, content, itemList);
          });
        } else {
          zoneIdList = this.formModel.selectedZoneIdList;
          this.onGetZoneIdList(zoneIdList, isToAll, title, content, itemList);
        }
      },

      handleReset() {
        this.$refs['form'].resetFields();
      },

      onGetZoneIdList(zoneIdList, isToAll, title, content, itemList) {
        if (zoneIdList.length === 0) {
          this.$Message.error('未选择服务器');
          return;
        }

        // 如果是要发送给当前大区内所有服务器，则显示警告弹窗
        if (isToAll) {
          this.showAlert = true;
          this.handleAlertSure = () => {
            this.showAlert = false;
            this.loading = true;
            this.sendMailToZones(zoneIdList, title, content, itemList);
          };
        } else {
          this.loading = true;
          this.sendMailToZones(zoneIdList, title, content, itemList);
        }
      },

      sendMailToZones(zoneIdList, title, content, itemList, sender, validDays) {
        this.$refs.mailEditor.sendMail(zoneIdList.join(','), 1, 0, title, content, itemList, sender, validDays);
      },

      sendMailCb() {
        this.loading = false
      },
    },

    components: {
      RegionSelect,
      ZoneSelect,
      MailEditor
    }
  };
</script>

<style>
  .alert-modal .ivu-modal {
    top: 40%;
  }
</style>
