<template>
	<div>
		<Row>
			<CommonFilter ref="commonFilter" @on-change="onFilterChange" showDatePicker showChannelSelect></CommonFilter>
			<br>
			<Row>
				<ChartTitle text="总览"></ChartTitle>
				<ChannelBaseChart :selectedChannelList="selectedChannelList"></ChannelBaseChart>
			</Row>
			<br>
		</Row>
	</div>
</template>
	
	<script>
		import CommonFilter from '@/components/CommonFilter'
		import ChartTitle from '@/components/ChartTitle'
		import ChannelBaseChart from '@/components/analy/ChannelBaseChart'

		export default {
			components: {
        CommonFilter,
				ChartTitle,
        ChannelBaseChart
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
