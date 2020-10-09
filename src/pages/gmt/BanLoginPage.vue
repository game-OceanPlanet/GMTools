<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <!-- <FormItem label="封禁类型">
         <Select @on-change="onOperateChanged" v-model="formModel.currencyType"> filterable placeholder="请选择或直接输入关键字">
          <Option v-for="operate in operateList" :key="operate.name" :value="operate.type">{{ operate.name }}</Option>
        </Select>
      </FormItem> -->
      <FormItem label="选择类型">
        <RadioGroup v-model="formModel.typeSelect">
         <Radio label="tel">手机号</Radio>
          <Radio label="playerId">玩家ID</Radio>
        </RadioGroup>
      </FormItem>
       <FormItem label="输入编号">
              <Input v-model="formModel.roleId" placeholder="请输入需要封禁的玩家的ID或者手机号"></Input>
        </FormItem>
      <FormItem label="操作类型">
        <RadioGroup v-model="formModel.type">
          <Radio label="ban">封号</Radio>
          <Radio label="allow">解禁</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="时长(小时)" v-if="formModel.type === 'ban'">
        <Input v-model="formModel.banTime"  placeholder="封禁小时，0永久封禁"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">确认修改</Button>
         <Button type="primary" @click="searchSubmit">查询</Button>
      </FormItem>
      <Table border :columns="tableColumns" :data="tableRows"></Table>
    </Form>
  </div>
</template>

<script>
  import * as services from '@/services'
  import RegionSelect from '@/components/RegionSelect'

  export default {
    data() {
      return {
        formModel: {
          selectedZoneId: '',
          roleId: '',
          type: 'ban',
          duration: '',
          currencyType:1,
          operate:1,
          banTime:"",
          typeSelect: 'tel',
        },

        operateList: [],

        tableColumns: [
          {
            title: '被封禁玩家ID',
            key: 'PlayerId',
            align: 'center',
          },
          {
            title: '被封封禁手机号',
            key: 'Mobile',
            align: 'center'
          },
          {
            title: '封禁结束时间',
            key: 'LoginBanTime',
            align: 'center'
          }
        ],

        tableRows: []
      }
    },

    created() {
      this.fetchOperateList()
    },

    methods: {
      fetchOperateList() {
        this.operateList = [];
        let moneyNames = ["禁止登陆","解禁登陆"];
        for(var i = 0; i < moneyNames.length; i ++){
          this.operateList.push({"name": moneyNames[i], "type": i + 1})      
        }
      },

      onOperateChanged(value) {
        // this.formModel.operate = value;
      },

      searchSubmit() {
        // if (!services.checkGmtAuthor(2)) {
        //   this.$Message.error("权限不足,请联系管理员!");
        //   return
        // }

        // // 服务器id
        // var zoneId = this.formModel.selectedZoneId;
        // if (typeof zoneId === 'string') {
        //   this.$Message.error('请先选择服务器');
        //   return
        // }

        // // 玩家id
        // var roleId = parseInt(this.formModel.roleId);
        // if (!roleId || roleId < 0) {
        //   this.$Message.error('请正确填入玩家id');
        //   return
        // }

        // 禁言时长（小时）
        // var duration = 0;
        // if (this.formModel.type === 'ban') {
        //   duration = parseInt(this.formModel.banTime);
        //   if ((duration !== 0 && !duration) || duration <= 0) {
        //     this.$Message.error('请正确填入封停时长');
        //     return
        //   }
        // }

        services.getHttpClient().post({
          url: '/dragon/banPlayerList',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            page:1,
            pageSize:300
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error("提交失败，请检查配置,错误码："+body.code);
            return;
          }

          this.fillData(body.msg.value);
        });
      },

      fillData(rows) {
        this.tableRows.length = 0;
        rows.forEach((row) => {
          var tableRow = {};
          tableRow["PlayerId"] = row.PlayerId;
          tableRow["Mobile"] = row.Mobile;
          let banTime;
          if(parseInt(row.LoginBanTime) == -1){
            banTime = "永久封禁";
          } else {
            banTime = services.getFormattedToDateString(row.LoginBanTime * 1000);
          }
          tableRow["LoginBanTime"] = banTime;

          this.tableRows.push(tableRow);
        });
      },

      /**
       * 封停登录
       * @param zoneId 服务器id
       * @param roleId 角色id
       * @param duration 封停时长（小时）
       */
      handleSubmit() {
        let operateType = this.formModel.type == "ban" ? 1 : 2;
        let bantime = this.formModel.banTime;
        if(!bantime){
          bantime = 0;
        }
        let operateTime = parseInt(bantime);

        var type = this.formModel.typeSelect;
        var id = this.formModel.roleId;
        if (id.length === 0) {
          this.$Message.error('请正确填入查询编号');
          return
        }

        let playerId = 0;
        let mobile = 0;
        if(type == "playerId"){
          playerId = id;
        } else if(type == "tel"){
          mobile = id;
        }

        services.getHttpClient().post({
          url: '/dragon/banPlayerEdit',
          body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            operateType:operateType,
            operateTime:operateTime,
             playerId:playerId,
             mobile:mobile
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            // this.$Message.error("提交失败，请检查配置,错误码："+body.code);
            return;
          }

          if(operateType == 1){
            this.$Message.success('禁言成功');
          } else{
            this.$Message.success('解禁成功');
          }
         

          this.searchSubmit();
        });
      }
    },

    components: {
      RegionSelect
    }
  }
</script>
