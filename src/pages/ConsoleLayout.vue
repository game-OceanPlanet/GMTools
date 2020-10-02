<template>
  <div class="console-layout">
    <Layout>
      <Header :style="{background: 'dodgerblue', 'color': 'white', padding: '0px'}">
        <Icon :style="{margin: '12px 20px', cursor: 'pointer'}" type="navicon-round" size="40"
              @click.native="toggleSider" :class="siderToggleClasses"></Icon>
        <span :style="{position: 'relative', bottom: '10px', fontSize: '150%'}">{{ gameName }}</span>
        <div :style="{display: 'inline-block', position: 'absolute', right: '30px', fontSize: '200%'}">
          <span :style="{marginRight: '20px'}">欢迎你，{{ getUsername() }}</span>
          <Tooltip content="注销">
            <Icon :style="{cursor: 'pointer'}" type="power" @click.native="handleLogout"></Icon>
          </Tooltip>
        </div>
        <div :style="{display: 'inline-block', position: 'absolute', margin:'2px 0px 0px 60px'}">
          <Menu mode="horizontal" theme="primary" active-name="1" @on-select="onSelect">
            <div class="layout-nav">
              <MenuItem name="gmt">
                <Icon type="ios-home"></Icon>
                后台管理
              </MenuItem>
              <MenuItem name="analy">
                <Icon type="ios-navigate"></Icon>
                数据分析
              </MenuItem>
              <MenuItem name="activitys">
              <Icon type="ios-person"></Icon>
                运营活动
              </MenuItem>
            </div>
          </Menu>
        </div>
      </Header>
      <Layout>
        <Sider ref="sider" :style="{backgroundColor: 'white', boxShadow: '0 2px 3px rgba(0, 0, 0, .1)'}"
               :class="siderClasses">
          <SidebarMenu :menuList="menuList"></SidebarMenu>
        </Sider>
        <Content>
          <div class="console-content">
            <router-view></router-view>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import SidebarMenu from '@/components/SidebarMenu'
  import * as services from '@/services'

  export default {
    data() {
      return {
        gameName: '海洋星球',
        menuList: this.getGmtMenuList(),
        isSiderHidden: false
      }
    },

    computed: {
      siderClasses() {
        return [this.isSiderHidden ? 'hidden-sider' : ''];
      },

      siderToggleClasses() {
        return [this.isSiderHidden ? 'hidden-sider-toggle' : ''];
      }
    },

    methods: {
      getAnalyMenuList() {
        return services.getAnalyMenuList();
      },

      getGmtMenuList() {
        return services.getGmtMenuList();
      },
      getActivityMenuList(){
        return services.getActivityMenuList();
      },

      getUsername() {
        return services.getUser().username;
      },

      toggleSider() {
        this.isSiderHidden = !this.isSiderHidden;
      },

      handleLogout() {
        services.setLoggedOut();
        this.$router.push('/login');
      },

      onSelect(name) {
        if (name === "analy") {
          this.menuList = this.getAnalyMenuList()
        } else if (name === "gmt") {
          this.menuList = this.getGmtMenuList()
        }else if(name == "activitys"){
          this.menuList = this.getActivityMenuList()
        }
        
      }
    },

    components: {
      SidebarMenu
    }
  }
</script>

<style>
  .console-layout {
    position: relative; /* 为子元素服务 */
    min-width: 1200px;
  }

  .console-content {
    min-height: 100vh;
    margin-left: 10px;
    margin-right: 10px;
  }

  .hidden-sider {
    display: none;
  }

  .hidden-sider-toggle {
    transform: rotate(-90deg);
  }

  /* .layout-nav {
    width: 235px;
    margin: 0 auto;
    margin-right: 0px;
  } */

</style>
