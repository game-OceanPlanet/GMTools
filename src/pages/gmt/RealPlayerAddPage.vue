<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form ref="formInline" :model="playerModel" inline>
     <FormItem prop="Mobile">
        <Input type="text" v-model="playerModel.Mobile" placeholder="手机号">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="Name">
        <Input type="text" v-model="playerModel.Name" placeholder="姓名">
        </Input>
      </FormItem>
      <FormItem prop="IdNum">
        <Input type="text" v-model="playerModel.IdNum" placeholder="身份证">
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">添加玩家</Button>
      </FormItem>
     <br>
     <FormItem prop="RoleId">
        <Input type="text" v-model="playerModel.RoleId" placeholder="玩家手机号">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
       <FormItem prop="verifyCode">
        <Input type="text" v-model="playerModel.verifyCode" placeholder="短信验证码">
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit2">发送验证码</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import * as services from '@/services'
  import RegionSelect from '@/components/RegionSelect'
  import ChartTitle from '@/components/ChartTitle'

  export default {
    components: {
      RegionSelect,
      ChartTitle
    },

    data() {
      return {
        formModel: {
          type: 'playerId',
          roleId: ''
        },
        playerModel: {
          Mobile: "",
          IdNum: "",
          Name: "",
          RoleId:"",
          verifyCode:""
        },

      }
    },

    created() {
    },

    methods: {
      handleSubmit() {
          let name = this.playerModel.Name;
          let mobile = this.playerModel.Mobile;
          let idnum = this.playerModel.IdNum;

          if(!name){
              this.$Message.error("请输入姓名");
              return;
          }
          if(!mobile){
              this.$Message.error("请输入手机");
              return;
          }
          if(!idnum){
              this.$Message.error("请输入身份证");
              return;
          }
        services.getHttpClient().post({
            url: "/dragon/realNamePlayerAdd",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            mobile:mobile,
            name:name,
            idNum:idnum
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error("添加失败");
            return;
          }
        this.$Message.success("添加成功");
        });
      },

      handleSubmit2(){
          let RoleId = this.playerModel.RoleId;

          if(!RoleId){
              this.$Message.error("请输入手机");
              return;
          }
        services.getHttpClient().post({
            url: "/dragon/verifyCodeSend",
            body: {
            username: services.getUser().username,
            platform: services.getUser().platform,
            roleId:RoleId
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error("发送失败");
            return;
          }
          this.playerModel.verifyCode = body.msg.verifyCode;
        this.$Message.success("发送成功");
        });
      }
      
  }
  }
</script>

<style scoped>
</style>
