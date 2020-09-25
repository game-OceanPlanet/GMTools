<template>
  <div>
    <Row>
      <CommonFilter ref="commonFilter" @on-change="onFilterChange" showDateRangePicker></CommonFilter>
      <br>
      <Row>
        <ChartTitle text="总览"></ChartTitle>
        <SumRetainChart ref="sumRetainChart"></SumRetainChart>
      </Row>
      <br>
    </Row>
  </div>
</template>

<script>
  import ChartTitle from '@/components/ChartTitle'
  import CommonFilter from '@/components/CommonFilter'
  import SumRetainChart from '@/components/analy/SumRetainChart'

  export default {
    components: {
      CommonFilter,
      ChartTitle,
      SumRetainChart
    },

    methods: {
      onFilterChange() {
          this.$refs.sumRetainChart.search()
      }
    }
  }
</script>

<style scoped>
</style>
