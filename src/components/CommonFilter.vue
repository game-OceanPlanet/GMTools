<template>
  <div class="filter-area">
    <div class="region-select-area">
      <RadioGroup :value="region" type="button" size="large" @on-change="onChangeRegion">
        <div class="radio-wrap">
          <div v-if="checkPlatform(3)">
            <Radio label="jh-wb">君海-玩吧</Radio>
          </div>
          <div v-if="checkPlatform(4)">
            <Radio label="xd-wx">炫动-小游戏</Radio>
          </div>
          <div v-if="checkPlatform(5)">
            <Radio label="jh-9130">君海-9130</Radio>
          </div>
          <div v-if="checkPlatform(6)">
            <Radio label="jh-fk">君海-疯狂</Radio>
          </div>
          <div v-if="checkPlatform(7)">
            <Radio label="jh-hf">君海-混服</Radio>
          </div>
        </div>
      </RadioGroup>
      <DatePicker :style="{marginLeft: '30px'}" v-if="showDatePicker"></DatePicker>
      <DateRangePicker :style="{marginLeft: '30px'}" v-if="showDateRangePicker"></DateRangePicker>
    </div>

    <div class="channel-select-area" v-if="showChannelSelect">
      <Collapse>
        <Panel>
          <span>筛选渠道【{{selectedChannelIdList.length === 0 ? "未选择" : (isCheckAllChannels ? "全部" : "部分")}}】</span>
          <div slot="content">
            <div class="checkBoxArea">
              <div class="checkAllBox">
                <Checkbox size="large" :indeterminate="channelIndeterminate" :value="isCheckAllChannels"
                          @click.prevent.native="handleClickCheckAllChannels">全选
                </Checkbox>
              </div>
              <CheckboxGroup class="checkboxGroup" size="large" v-model="selectedChannelIdList"
                             @on-change="checkAllChannelsGroupChange">
                <Checkbox v-for="channel in availableChannelList" :key="channel.id" :label="channel.id"
                          v-if="!isChannelUnknown(channel.id)">{{ channel.name }}
                </Checkbox>
                <br>
                <Checkbox v-for="channel in availableChannelList" :key="channel.id" :label="channel.id"
                          v-if="isChannelUnknown(channel.id)">{{ channel.name }}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
    <div class="zone-select-area" v-if="showZoneSelect">
      <Collapse>
        <Panel>
          <span>筛选服务器【{{selectedZoneIdList.length === 0 ? "未选择" : (isCheckAllZones ? "全部" : "部分")}}】</span>
          <div slot="content">
            <div class="checkBoxArea">
              <div class="checkAllBox">
                <Checkbox size="large" :indeterminate="zoneIndeterminate" :value="isCheckAllZones"
                          @click.prevent.native="handleClickCheckAllZones">全选
                </Checkbox>
              </div>
              <CheckboxGroup class="checkboxGroup" size="large" v-model="selectedZoneIdList"
                             @on-change="checkAllZonesGroupChange">
                <Checkbox v-for="id in availableZoneIdList" :key="id" :label="id">{{ getZoneNameByZoneId(id) }}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
    <div class="player-filter-type-select-area" v-if="showPlayerFilter">
      <span>是否对玩家去重：</span>
      <i-switch :value="playerFilterType" @on-change="onChangePlayerFilterType">
        <Span slot="open">是</Span>
        <Span slot="close">否</Span>
      </i-switch>
      <div>
        （如果对玩家去重，则在计算人数时，同一个账号滚服后仍算作一个人；否则，同一个账号滚服后算作多个人）
      </div>
    </div>
    <br>
    <Button type="primary" @click="onClickSureBtn">
      <Icon type="ios-search"></Icon>
      <span>查询</span>
    </Button>
  </div>
</template>

<script>
  import * as services from '@/services'
  import DateRangePicker from '@/components/DateRangePicker'
  import DatePicker from '@/components/DatePicker'

  export default {
    components: {
      DatePicker,
      DateRangePicker
    },

    created() {
      // 异步获取所有服务器的id
      if (this.showZoneSelect) {
        this.fetchAvailableZoneIdList();
      }

      // 异步获取所有渠道
      if (this.showChannelSelect) {
        this.fetchAvailableChannelList();
      }
    },

    props: {
      showDatePicker: {
        type: Boolean,
        default: false
      },

      showDateRangePicker: {
        type: Boolean,
        default: false
      },

      showZoneSelect: {
        type: Boolean,
        default: false
      },

      showChannelSelect: {
        type: Boolean,
        default: false
      },

      showPlayerFilter: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        region: services.getSelectedRegion(),

        zoneIndeterminate: false,
        isCheckAllZones: false,
        selectedZoneIdList: [],
        availableZoneIdList: [],

        channelIndeterminate: false,
        isCheckAllChannels: false,
        selectedChannelIdList: [],
        availableChannelList: []
      }
    },

    watch: {
      region: function () {
        // 保存选择的大区
        services.saveSelectedRegion(this.region);

        // 将服务器id列表清空，并重新拉取
        this.availableZoneIdList = [];
        this.fetchAvailableZoneIdList();

        // 渠道列表清空，重新拉去
        this.availableChannelList = [];
        this.fetchAvailableChannelList();
      }
    },

    computed: {
      playerFilterType() {
        return services.isFilterPlayerByUid();
      }
    },

    methods: {
      checkPlatform(pfId) {
        return services.checkPlatform(pfId);
      },

      onChangeRegion(value) {
        this.region = value;
      },

      onChangePlayerFilterType(value) {
        services.setIsFilterPlayerByUid(value);
      },

      getZoneNameByZoneId(zoneId) {
        return services.getZoneNameByZoneId(zoneId);
      },

      handleClickCheckAllZones() {
        if (this.zoneIndeterminate) {
          this.cancelAllZones();
        } else {
          if (this.isCheckAllZones) {
            this.cancelAllZones();
          } else {
            this.checkAllZones();
          }
        }
      },

      checkAllZonesGroupChange(data) {
        if (data.length === this.availableZoneIdList.length) {
          this.checkAllZones();
        } else if (data.length > 0) {
          this.checkSomeZones();
        } else {
          this.cancelAllZones();
        }
      },

      checkAllZones() {
        this.isCheckAllZones = true;
        this.zoneIndeterminate = false;
        this.selectedZoneIdList = this.availableZoneIdList;
      },

      checkSomeZones() {
        this.isCheckAllZones = false;
        this.zoneIndeterminate = true;
      },

      cancelAllZones() {
        this.isCheckAllZones = false;
        this.zoneIndeterminate = false;
        this.selectedZoneIdList = [];
      },

      handleClickCheckAllChannels() {
        if (this.channelIndeterminate) {
          this.cancelAllChannels();
        } else {
          if (this.isCheckAllChannels) {
            this.cancelAllChannels();
          } else {
            this.checkAllChannels();
          }
        }
      },

      checkAllChannelsGroupChange(data) {
        if (data.length === this.availableChannelList.length) {
          this.checkAllChannels();
        } else if (data.length > 0) {
          this.checkSomeChannels();
        } else {
          this.cancelAllChannels();
        }
      },

      checkAllChannels() {
        this.isCheckAllChannels = true;
        this.channelIndeterminate = false;
        this.selectedChannelIdList = [];
        this.availableChannelList.forEach((channel) => {
          this.selectedChannelIdList.push(channel.id);
        });
      },

      checkSomeChannels() {
        this.isCheckAllChannels = false;
        this.channelIndeterminate = true;
      },

      cancelAllChannels() {
        this.isCheckAllChannels = false;
        this.channelIndeterminate = false;
        this.selectedChannelIdList = [];
      },

      /**
       * 获得所有被选择的服务器的id集合
       */
      getSelectedZoneIdList() {
        let result = [];
        if (this.isCheckAllZones) {
          return result
        }

        for (let i = 0; i < this.selectedZoneIdList.length; i++) {
          result.push(this.selectedZoneIdList[i]);
        }

        return result;
      },

      /**
       * 获得所有被选择的渠道id集合
       */
      getSelectedChannelList() {
        let result = [];
        if (this.isCheckAllChannels) {
          return result;
        }

        for (let i = 0; i < this.selectedChannelIdList.length; i++) {
          result.push(this.selectedChannelIdList[i]);
        }

        return result;
      },

      isChannelUnknown(channelId) {
        return services.isChannelUnknown(channelId);
      },

      // 异步获取所有服务器的id
      fetchAvailableZoneIdList() {
        // 先清空
        this.availableZoneIdList = [];

        services.getHttpClient().post({
          url: '/xy/gmt/query_server_list',
          body: {
            include_merged: true
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.data || body.data.length === 0) {
            return
          }

          let zones = [];
          body.data.forEach((zone) => {
            zones.push({"id": zone.id, "name": zone.name});
            this.availableZoneIdList.push(zone.id)
          });

          services.saveZoneList(zones);

          // 取到服务器列表后，默认直接选中所有服务器
          this.checkAllZones();
        });
      },

      // 异步获取所有渠道
      fetchAvailableChannelList() {
        // 先清空
        this.availableChannelList = [];

        services.getHttpClient().post({
          url: '/xy/gmt/query_channel_list',
          body: {
            pf_id: services.getSelectedPfId()
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.data || body.data.length === 0) {
            return
          }

          body.data.forEach((channel) => {
            let channelName = services.getChannelNameByChannelId(channel);
            let isChannelUnknown = services.isChannelUnknown(channel);
            this.availableChannelList.push({"id": channel, "name": channelName, "unknown": isChannelUnknown});
          });

          // 将所有渠道按名称排序，以方便通过肉眼查找
          this.availableChannelList.sort((channel1, channel2) => {
            if (channel1.unknown && !channel2.unknown) {
              return 1;
            } else if (!channel1.unknown && channel2.unknown) {
              return -1;
            } else {
              return channel1.name.localeCompare(channel2.name);
            }
          });

          // 默认直接选中所有渠道
          this.checkAllChannels();
        });
      },

      onClickSureBtn() {
        this.$emit('on-change');
      },

    }
  }
</script>

<style scoped>
  .filter-area {
    padding: 10px;
    background: #ffffff;
    border: 1px solid #bfbfbf;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
    margin-top: 10px;
    padding-left: 10px;
  }

  .radio-wrap {
    display: flex;
    flex-wrap: nowrap;
  }

  .region-select-area {
    padding-bottom: 5px;
    border-bottom: 1px solid #858484;
  }

  .channel-select-area {
    margin-top: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #858484;
  }

  .zone-select-area {
    margin-top: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #858484;
  }

  .player-filter-type-select-area {
    margin-top: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #858484;
  }

  .checkBoxArea {
    margin-top: 5px;
  }

  .checkAllBox {
    margin-bottom: 5px;
  }

  .checkboxGroup {
    margin-bottom: 5px;
  }
</style>
