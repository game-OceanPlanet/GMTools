<template>
  <div>
    <Row>
      <CommonFilter ref="commonFilter" @on-change="onFilterChange" showDateRangePicker showZoneSelect
                     showChannelSelect></CommonFilter>
      <br>
      <Row>
        <ChartTitle text="总览"></ChartTitle>
        <PayRetainChart ref="payRetainChart"></PayRetainChart>
      </Row>
      <br>
    </Row>
  </div>
</template>

<script>
  import ChartTitle from '@/components/ChartTitle'
  import CommonFilter from '@/components/CommonFilter'
  import PayRetainChart from '@/components/analy/PayRetainChart'

  export default {
    components: {
      CommonFilter,
      ChartTitle,
      PayRetainChart
    },

    data() {
      return {
        selectedZoneIdList: [],
        selectedChannelList: []
      }
    },

    methods: {
      onFilterChange() {
        this.selectedZoneIdList = this.$refs.commonFilter.getSelectedZoneIdList();
        this.selectedChannelList = this.$refs.commonFilter.getSelectedChannelList();
        this.$refs.payRetainChart.search(this.selectedZoneIdList, this.selectedChannelList)
      }
    }
  }
</script>

<style scoped>
</style>
