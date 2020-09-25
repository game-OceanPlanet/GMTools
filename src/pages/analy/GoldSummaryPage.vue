<template>
  <div>
    <Row>
      <CommonFilter ref="commonFilter" @on-change="onFilterChange" showDateRangePicker showZoneSelect></CommonFilter>
      <br>
      <Row>
        <ChartTitle text="总览"></ChartTitle>
        <AmountUpdateChart ref="amountChart"></AmountUpdateChart>
      </Row>
      <br>
    </Row>
  </div>
</template>

<script>
  import ChartTitle from '@/components/ChartTitle'
  import CommonFilter from '@/components/CommonFilter'
  import AmountUpdateChart from '@/components/analy/GoldSummaryChart'

  export default {
    components: {
      CommonFilter,
      ChartTitle,
      AmountUpdateChart
    },

    data() {
      return {
        selectedZoneIdList: [],
      }
    },

    methods: {
      onFilterChange() {
        this.selectedZoneIdList = this.$refs.commonFilter.getSelectedZoneIdList();
        this.$refs.amountChart.search(this.selectedZoneIdList)
      }
    }
  }
</script>

<style scoped>
</style>
