<template>
	<div class="chartTitle">
		<span class="titleText">{{ text }}</span>
	</div>
</template>

<script>
	export default {
		props: {
			"text": String
		}
	}
</script>

<style>
	.chartTitle {
		margin-bottom: 5px;
	}

	.titleText {
		border-bottom-width: 1px;
		border-bottom-color: rgb(77, 122, 180);
		border-bottom-style: solid;
		font-weight: bold;
		font-size: 150%;
	}
</style>