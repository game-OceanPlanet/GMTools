<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="发送范围">
        <RadioGroup v-model="formModel.receiverZonesRange">
          <Radio label="some">当前大区内部分服务器</Radio>
          <Radio label="all">当前大区内所有服务器(包含未来开启的所有服务器)</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="服务器" v-if="formModel.receiverZonesRange === 'some'">
        <ZoneSelect v-model="formModel.selectedZoneIdList" multiple></ZoneSelect>
      </FormItem>
      <FormItem label="间隔时长">
        <Select v-model="formModel.interval" filterable placeholder="请选择间隔时长">
          <Option v-for="item in intervalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
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
        <Button type="primary" @click="handleSubmit">提交</Button>
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
          interval: '', // 跑马灯间隔时长,
          state: "2", // 1-仅系统消息,2-仅跑马灯,3-同时发送跑马灯和系统消息
          sortId: "30", // 消息优先级,越小优先级越高
        },
        intervalList: [
          {value: '5', label: '间隔5分钟'},
          {value: '10', label: '间隔10分钟'},
          {value: '15', label: '间隔15分钟'},
          {value: '30', label: '间隔30分钟'},
          {value: '60', label: '间隔1小时'},
          {value: '120', label: '间隔2小时'},
          {value: '180', label: '间隔3小时'},
          {value: '360', label: '间隔6小时'},
        ]
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
        var interval = this.formModel.interval;
        if (interval.length === 0) {
          this.$Message.error('请选择间隔时长');
          return
        }

        var zoneIdList = [];
        if (this.formModel.receiverZonesRange === 'some') {
          zoneIdList = this.formModel.selectedZoneIdList;
        }

        this.insertMarquee(zoneIdList.join(','), messageContent, state, sortId, interval);
      },

      handleReset() {
        console.log('handleReset');
      },

      /**
       * 定时跑马灯
       * @param zoneIdListStr 服务器id列表，id之间以逗号隔开，比如，'1,2,3'
       * @param messageContent 消息内容
       * @param state 状态
       * @param sortId 优先级
       * @param interval 发送间隔
       */
      insertMarquee(zoneIdListStr, messageContent, state, sortId, interval) {
        // console.log("zone:" + zoneIdListStr + " interval:" + interval)
        services.getHttpClient().post({
          url: '/xy/gmt/insert_marquee',
          body: {
            server_id: zoneIdListStr,
            content: messageContent,
            state: parseInt(state),
            sort_id: parseInt(sortId),
            interval: parseInt(interval),

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

          this.$Message.success('提交成功');
        });
      }
    },

    components: {
      ZoneSelect,
      RegionSelect
    }
  }
</script>
