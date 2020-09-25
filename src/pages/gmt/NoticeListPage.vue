<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="公告标题">
        <Input v-model="formModel.gameTitle" placeholder="标题"></Input>
      </FormItem>
      <FormItem label="公告内容">
        <Input v-model="formModel.gameContent" type="textarea" :rows="8" placeholder="公告内容..."></Input>
      </FormItem>
      <FormItem label="福利公告">
        <Input v-model="formModel.welfareContent" type="textarea" :rows="8" placeholder="公告内容..."></Input>
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
          gameTitle: '',
          gameContent: '',
          welfareContent: '',
        },
        noticeIds: []
      }
    },

    created() {
      this.queryNoticeList();
    },

    methods: {
      queryNoticeList() {
        services.getHttpClient().post({
          url: '/xy/gmt/query_notice'
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (body.data.length != 3) {
            this.$Message.error("服务器错误，联系管理员");
            return;
          }

          var gameTitleNotice = body.data[0];
          var gameContentNotice = body.data[1];
          var welfareContentNotice = body.data[2];

          if (!gameTitleNotice || !gameContentNotice || !welfareContentNotice) {
            this.$Message.error("服务器错误，联系管理员");
            return;
          }

          this.formModel.gameTitle = gameTitleNotice.content;
          this.formModel.gameContent = gameContentNotice.content;
          this.formModel.welfareContent = welfareContentNotice.content;

          this.noticeIds[0] = gameTitleNotice.id;
          this.noticeIds[1] = gameContentNotice.id;
          this.noticeIds[2] = welfareContentNotice.id;
        });
      },

      handleSubmit() {
        if (!services.checkGmtAuthor(1)) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        var datas = [];
        datas.push({"id": this.noticeIds[0], "content": this.formModel.gameTitle});
        datas.push({"id": this.noticeIds[1], "content": this.formModel.gameContent});
        datas.push({"id": this.noticeIds[2], "content": this.formModel.welfareContent});

        services.getHttpClient().post({
          url: '/xy/gmt/update_notice',
          body: {
            datas: datas
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
      },

    },

    components: {
      ZoneSelect,
      RegionSelect
    }
  }
</script>
