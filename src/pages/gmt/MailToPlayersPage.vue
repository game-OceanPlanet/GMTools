<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="服务器">
        <ZoneSelect ref="zoneSelect" v-model="formModel.selectedZoneId"></ZoneSelect>
      </FormItem>
      <FormItem label="发送范围">
        <RadioGroup v-model="formModel.receiverRolesRange">
          <Radio label="some">选定服务器内部分玩家</Radio>
          <Radio label="all">选定服务器内所有玩家</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="玩家id列表" v-if="formModel.receiverRolesRange === 'some'">
        <Input v-model="formModel.receiverRoleIdList" type="textarea" :rows="5" placeholder="可输入多行，每行一个玩家id..."></Input>
      </FormItem>
      <MailEditor ref="mailEditor"></MailEditor>
      <FormItem>
        <Button type="primary" @click="handleSubmit">发送</Button>
      </FormItem>
    </Form>
    <Modal v-model="showAlert" width="360" class-name="alert-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>危险操作</span>
      </p>
      <div style="text-align:center">
        <p>确认要将该邮件发给【选定服务器内所有玩家】？</p>
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
          selectedZoneId: '',
          receiverRolesRange: 'some',
          receiverRoleIdList: ''
        },
        showAlert: false,
      }
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

        // 服务器id
        var zoneId = this.formModel.selectedZoneId;
        if (typeof zoneId === 'string') {
          this.$Message.error('请先选择服务器');
          return
        }

        // 是否发送给选定服务器内所有玩家
        var isToAll = (this.formModel.receiverRolesRange === 'all');

        if (isToAll) { // 将邮件发送给选定服务器内的所有玩家
          // 显示警告弹窗
          this.showAlert = true;
          this.handleAlertSure = () => {
            this.showAlert = false;
            this.$refs.mailEditor.sendMail(zoneId.toString(), 1, 0, title, content, itemList);
          }
        } else { // 将邮件发送给选定服务器内的部分玩家
          // 解析输入框获取玩家id列表
          var roleIdList = [];
          var roleIdStrList = this.formModel.receiverRoleIdList.split(/\s+/);
          roleIdStrList.forEach((str) => {
            var id = str.trim();
            if (id.length > 0) {
              id = parseInt(id);
              roleIdList.push(id);
            }
          });

          // 确保玩家id列表不为空
          if (roleIdList.length === 0) {
            this.$Message.error('玩家id列表不能为空');
            return;
          }

          // 发送邮件
          for (var i = 0; i < roleIdList.length; i++) {
            var roleId = roleIdList[i];
            this.$refs.mailEditor.sendMail(zoneId.toString(), 2, roleId, title, content, itemList);
          }
        }
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
