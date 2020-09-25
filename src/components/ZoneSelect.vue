<template>
	<Select :value="value" @on-change="onSelectChanged" :multiple="multiple" filterable placeholder="请选择或直接输入关键字">
		<Option v-for="item in zoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
	</Select>
</template>

<script>
  import * as services from '@/services'

	export default {
		props: [
			'value', // value属性在实现该组件的v-model指令时是必不可少的
			'multiple' // 是否支持多选
		], 

		data() {
			return {
				selectedZoneId: '',
				zoneList: []
			}
		},

		created() {
			this.fetchZoneList()
		},

		methods: {
			fetchZoneList() {
        this.zoneList = [];
        services.getHttpClient().post({
          url: '/xy/gmt/query_server_list',
          body: {
            include_merged: false
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.data || body.data.length === 0) {
            return
          }

          this.zoneList = body.data;
        });
			},

			onSelectChanged(value) {
				this.$emit('input', value); // 抛出input事件在实现该组件的v-model指令时是必不可少的
			}
		}
	}
</script>
