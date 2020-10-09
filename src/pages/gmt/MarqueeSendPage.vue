<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="发送范围">
        <RadioGroup v-model="formModel.receiverZonesRange">
          <Radio label="some">当前大区内部分服务器</Radio>
          <Radio label="all">当前大区内所有服务器</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="服务器" v-if="formModel.receiverZonesRange === 'some'">
        <ZoneSelect v-model="formModel.selectedZoneIdList" multiple></ZoneSelect>
      </FormItem>
      <FormItem label="消息内容">
        <Input v-model="formModel.messageContent" placeholder="输入消息内容（不宜过长）..."></Input>
      </FormItem>
      <FormItem label="优先级">
        <RadioGroup v-model="formModel.sortId">
          <Radio label="30">低</Radio>
          <Radio label="20">中</Radio>
          <Radio label="10">高</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="消息类型">
        <RadioGroup v-model="formModel.state">
          <Radio label="2">跑马灯</Radio>
          <Radio label="1">系统消息</Radio>
          <Radio label="3">跑马灯和系统消息</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">发送</Button>
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
          receiverZonesRange: 'some',
          selectedZoneIdList: [],
          messageContent: '', // 消息内容
          state: "2", // 1-仅系统消息,2-仅跑马灯,3-同时发送跑马灯和系统消息
          sortId: "30", // 消息优先级,越小优先级越高
        }
      };
    },

    methods: {
      handleSubmit() {
        if (!services.checkGmtAuthor(1)) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        // 消息内容
        var messageContent = this.formModel.messageContent.trim();
        if (messageContent.length === 0) {
          this.$Message.error('消息内容不能为空');
          return
        }

        var state = this.formModel.state;
        var sortId = this.formModel.sortId;

        // 待发送到的所有服务器的id
        var zoneIdList = [];

        // 是否要发送给当前大区内所有服务器
        var isToAll = (this.formModel.receiverZonesRange === 'all');

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
            this.onGetZoneIdList(zoneIdList, messageContent, state, sortId);
          });
        } else {
          zoneIdList = this.formModel.selectedZoneIdList;
          this.onGetZoneIdList(zoneIdList, messageContent, state, sortId);
        }
      },

      onGetZoneIdList(zoneIdList, messageContent, state, sortId) {
        if (zoneIdList.length === 0) {
          this.$Message.error('未选择服务器');
          return
        }

        // 向服务器发送消息
        this.sendMarquee(zoneIdList.join(','), messageContent, state, sortId);
      },

      handleReset() {
        console.log('handleReset');
      },

      /**
       * 发送走马灯消息
       * @param zoneIdListStr 服务器id列表，id之间以逗号隔开，比如，'1,2,3'
       * @param messageContent 消息内容
       * @param state 状态
       * @param sortId 优先级
       */
      sendMarquee(zoneIdListStr, messageContent, state, sortId) {
        console.log(state + "-" + sortId)
        services.getHttpClient().post({
          url: '/xy/gmt/send_marquee',
          body: {
            server_id: zoneIdListStr,
            content: messageContent,
            state: parseInt(state),
            sort_id: parseInt(sortId)
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

          this.$Message.success('发送成功');
        });
      }
    },

    components: {
      ZoneSelect,
      RegionSelect
    }
  }
</script>
