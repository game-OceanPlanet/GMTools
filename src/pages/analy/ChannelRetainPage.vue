<template>
	<div>
		<Row>
			<CommonFilter ref="commonFilter" @on-change="onFilterChange" showDatePicker showChannelSelect></CommonFilter>
			<br>
			<Row>
				<ChartTitle text="总览"></ChartTitle>
				<ChannelRetainChart :selectedChannelList="selectedChannelList"></ChannelRetainChart>
			</Row>
			<br>
		</Row>
	</div>
</template>
	
	<script>
		import CommonFilter from '@/components/CommonFilter'
		import ChartTitle from '@/components/ChartTitle'
		import ChannelRetainChart from '@/components/analy/ChannelRetainChart'

		export default {
			components: {
        CommonFilter,
				ChartTitle,
        ChannelRetainChart
			},
			
			data() {
				return {
          selectedChannelList: []
				}
			},
	
			methods: {
        onFilterChange() {
					this.selectedChannelList = this.$refs.commonFilter.getSelectedChannelList();
				}
			}		
		}
	</script>
	
	<style scoped>
	</style>
