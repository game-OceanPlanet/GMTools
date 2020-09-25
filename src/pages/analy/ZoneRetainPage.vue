<template>
	<div>
		<Row>
			<CommonFilter ref="commonFilter" @on-change="onFilterChange" showDatePicker showZoneSelect></CommonFilter>
			<br>
			<Row>
				<ChartTitle text="总览"></ChartTitle>
				<ZoneRetainChart :selectedZoneIdList="selectedZoneIdList"></ZoneRetainChart>
			</Row>
			<br>
		</Row>
	</div>
</template>
	
	<script>
		import CommonFilter from '@/components/CommonFilter'
		import ChartTitle from '@/components/ChartTitle'
		import ZoneRetainChart from '@/components/analy/ZoneRetainChart'

		export default {
			components: {
        CommonFilter,
				ChartTitle,
        ZoneRetainChart
			},
			
			data() {
				return {
					selectedZoneIdList: []
				}
			},
	
			methods: {
        onFilterChange() {
					this.selectedZoneIdList = this.$refs.commonFilter.getSelectedZoneIdList();
				}
			}		
		}
	</script>
	
	<style scoped>
	</style>
