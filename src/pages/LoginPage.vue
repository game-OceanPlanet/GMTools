<template>
  <div @keydown.enter="handleSubmit">
    <div class="login-card">
      <Card>
        <p slot="title" style="text-align: center">欢迎登录</p>
        <div class="form-container">
          <Form ref="loginForm" :model="form" :rules="formRules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
              >
                <span slot="prepend">
                  <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
        <p>（用户名和密码请向管理员索取）</p>
      </Card>
    </div>
  </div>
</template>

<script>
import * as services from "@/services";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },

      formRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    handleSubmit() {
      let platforms = {
        3: "jh-wb", // 君海玩吧
      };

      // this.onLogin("wing", "123", 1, 1, platforms);
      // return;
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          let time = new Date().getTime();
          let platform = "dragon";
          let key = "Dragon2020WOMenYIQiFaDaCAI#SEASkeY2EY88@^^%(*9098aXc";
          let username = this.form.username;
          let password = this.form.password;
          let sign = this.$md5(username + platform + time + key);

          //http://www.siychina.com:10088/dragon/login?username=13688888888&password=123456&platform=dragon&time=14500000&sign=41D7E335BA0CFFEE9389785FAFEB4935

          services.getLoginHttpClient().post(
            {
              url: "/dragon/login",
              body: {
                username: username,
                password: password,
                time: time,
                platform: platform,
                sign: sign,
              },
            },
            (error, response, body) => {
              if (error) {
                this.$Message.error(error.toString());
                return;
              }

              if (body.code !== 0) {
                this.$Message.error("账号或者密码错误");
                return;
              }

              // this.onLogin(
              //   username,
              //   body.token,
              //   body.author,
              //   body.analy_author,
              //   body.platforms
              // );

              this.onLogin(username, password, username, username, platforms);
            }
          );
        }
      });
    },

    /**
     * 登录成功
     */
    onLogin(username, token, author, analyAuthor, platforms) {
      services.setLoggedIn(username, token, author, analyAuthor, platforms);
      services.initRegion();

      // 从url中的redirect参数取得跳转地址
      let redirectPath = "/summary";
      if (
        this.$router.currentRoute.query &&
        this.$router.currentRoute.query.redirect
      ) {
        redirectPath = this.$router.currentRoute.query.redirect;
      }

      // 跳转
      this.$router.push(redirectPath);
    },
  },
};
</script>

<style>
.login-card {
  position: relative;
  top: 20vh;
  width: 380px;
  margin: 0px auto;
}
</style>
