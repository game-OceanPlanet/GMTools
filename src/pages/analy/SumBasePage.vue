<template>
  <div>
    <Row>
      <CommonFilter ref="commonFilter" @on-change="onFilterChange" showDateRangePicker></CommonFilter>
      <br>
      <Row>
        <ChartTitle text="总览"></ChartTitle>
        <SumBaseChart ref="sumBaseChart"></SumBaseChart>
      </Row>
      <br>
    </Row>
  </div>
</template>

<script>
  import ChartTitle from '@/components/ChartTitle'
  import CommonFilter from '@/components/CommonFilter'
  import SumBaseChart from '@/components/analy/SumBaseChart'

  export default {
    components: {
      CommonFilter,
      ChartTitle,
      SumBaseChart
    },

    methods: {
      onFilterChange() {
          this.$refs.sumBaseChart.search()
      }
    }
  }
</script>

<style scoped>
</style>
