<template>
	<div>
		<Col class="metric-block" :xs="11" :sm="11" :md="6" :lg="6">
			<div class="metric-block-title">{{ title }}</div>
			<div class="metric-block-value">{{ value }}</div>
		</Col>
	</div>
</template>

<script>
	export default {
		props: [
			"title",
			"value"
		]
	}
</script>

<style>
	.metric-block {
		background: #ffffff;
		height: 80px;
		min-width: 200px;
		margin-right: 3px;
		margin-bottom: 3px;
		border: 1px solid #a1a2a5;
		box-shadow: 1px 1px rgba(0, 0, 0, 0.2);
		padding-left: 20px;
		padding-top: 5px;
	}

	.metric-block-title {
		font-size: 130%;
	}

	.metric-block-value {
		font-size: 300%;
	}
</style>