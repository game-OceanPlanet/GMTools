<template>
  <div>
    <Row>
      <CommonFilter ref="commonFilter" @on-change="onFilterChange" showZoneSelect></CommonFilter>
      <br>
      <Row>
        <ChartTitle text="总览"></ChartTitle>
        <OnlineChart ref="onlineChart"></OnlineChart>
      </Row>
      <br>
    </Row>
  </div>
</template>

<script>
  import ChartTitle from '@/components/ChartTitle'
  import CommonFilter from '@/components/CommonFilter'
  import OnlineChart from '@/components/analy/OnlineChart'

  export default {
    components: {
      CommonFilter,
      ChartTitle,
      OnlineChart
    },

    data() {
      return {
        selectedZoneIdList: [],
      }
    },

    methods: {
      onFilterChange() {
        this.selectedZoneIdList = this.$refs.commonFilter.getSelectedZoneIdList();
        this.$refs.onlineChart.search(this.selectedZoneIdList)
      }
    }
  }
</script>

<style scoped>
</style>
