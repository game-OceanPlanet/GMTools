<template>
	<div>
		<Row>
			<CommonFilter ref="commonFilter" @on-change="onFilterChange" showDatePicker showZoneSelect></CommonFilter>
			<br>
			<Row>
				<ChartTitle text="总览"></ChartTitle>
				<ZoneBaseChart :selectedZoneIdList="selectedZoneIdList"></ZoneBaseChart>
			</Row>
			<br>
		</Row>
	</div>
</template>
	
	<script>
		import CommonFilter from '@/components/CommonFilter'
		import ChartTitle from '@/components/ChartTitle'
		import ZoneBaseChart from '@/components/analy/ZoneBaseChart'

		export default {
			components: {
        CommonFilter,
				ChartTitle,
        ZoneBaseChart
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
