<template>
  <div>
    <Row>
      <CommonFilter ref="commonFilter" @on-change="onFilterChange" showDateRangePicker showZoneSelect
                     showChannelSelect></CommonFilter>
      <br>
      <Row>
        <ChartTitle text="总览"></ChartTitle>
        <LtvChart ref="ltvChart"></LtvChart>
      </Row>
      <br>
    </Row>
  </div>
</template>

<script>
  import ChartTitle from '@/components/ChartTitle'
  import CommonFilter from '@/components/CommonFilter'
  import LtvChart from '@/components/analy/LtvChart'

  export default {
    components: {
      CommonFilter,
      ChartTitle,
      LtvChart
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
        this.$refs.ltvChart.search(this.selectedZoneIdList, this.selectedChannelList)
      }
    }
  }
</script>

<style scoped>
</style>
