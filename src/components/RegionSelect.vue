<template>
  <div>
    <div class="layout-header">
      <RadioGroup :value="region" type="button" size="large" @on-change="onChangeRegion" class="header-region">
        <div class="radio-wrap">
          <div v-if="checkPlatform(3)">
            <Radio label="jh-wb">
              <Icon type="ios-flame" size="15"></Icon>
              <span>君海-玩吧</span>
            </Radio>
          </div>
          <div v-if="checkPlatform(4)">
            <Radio label="xd-wx">
              <Icon type="ios-flame" size="15"></Icon>
              <span>炫动-小游戏</span>
            </Radio>
          </div>
          <div v-if="checkPlatform(5)">
            <Radio label="jh-9130">
              <Icon type="ios-flame" size="15"></Icon>
              <span>君海-9130</span>
            </Radio>
          </div>
          <div v-if="checkPlatform(6)">
            <Radio label="jh-fk">
              <Icon type="ios-flame" size="15"></Icon>
              <span>君海-疯狂</span>
            </Radio>
          </div>
          <div v-if="checkPlatform(7)">
            <Radio label="jh-hf">
              <Icon type="ios-flame" size="15"></Icon>
              <span>君海-混服</span>
            </Radio>
          </div>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>

<script>
  import * as services from '@/services'

  export default {
    data() {
      return {
        region: services.getSelectedRegion()
      }
    },

    watch: {
      region: function () {
        // 保存选择的大区
        services.saveSelectedRegion(this.region);
        //this.$emit('on-change');

        // 重要，当前页面的内容是旧region的内容，通过强制跳转到页面来达到刷新页面的目的
        this.$router.push({
          path: '/gmt/hello'
        })
      }
    },

    methods: {
      checkPlatform(pfId) {
        return services.checkPlatform(pfId);
      },

      onChangeRegion(value) {
        this.region = value;
      },
    }
  }
</script>

<style scoped>
  .filter-area {
    padding: 10px;
    background: #ffffff;
    border: 1px solid #bfbfbf;
    margin-top: 10px;
    padding-left: 10px;
  }

  .radio-wrap {
    display: flex;
    flex-wrap: nowrap;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .header-region {
    position: relative;
    top: 14px;
    left: 10px;
  }

</style>
