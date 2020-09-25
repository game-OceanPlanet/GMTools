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
              <Input type="password" v-model="form.password" placeholder="请输入密码">
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
  import * as services from '@/services'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },

        formRules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },

    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (!valid) {
            return false;
          } else {
            let username = this.form.username;
            let password = this.form.password;

            // 向服务器发送认证信息
            // services.getAxiosClient().post('/gmt/login', {
            //   username: username,
            //   password: password
            // }).then((response) => {
            //   console.log(response)
            //   if (response.data.code != 0) {
            //     this.$Message.error(response.data.msg);
            //     return;
            //   }
            //
            //   this.onLogin(username);
            // }).catch((error) => {
            //   this.$Message.error(error.toString());
            //   return;
            // });

            services.getLoginHttpClient().post({
              url: '/xy/gmt/login',
              body: {
                username: username,
                password: password
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

              this.onLogin(username, body.token, body.author, body.analy_author, body.platforms);
            });
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
        let redirectPath = '/summary';
        if (this.$router.currentRoute.query && this.$router.currentRoute.query.redirect) {
          redirectPath = this.$router.currentRoute.query.redirect;
        }

        // 跳转
        this.$router.push(redirectPath);
      }
    }
  }
</script>

<style>
  .login-card {
    position: relative;
    top: 20vh;
    width: 380px;
    margin: 0px auto;
  }
</style>
