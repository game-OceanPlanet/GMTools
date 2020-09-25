<template>
  <div class="sidebar-menu">
    <Menu width="auto" theme="light" @on-select="onSelect" :active-name='activeMenuItemName' :open-names='[openSubmenuName]'>
      <div v-for="item in menuList">
        <MenuItem v-if="!item.children || item.children.length === 0" :name="item.name" :key="item.name">
          <Icon :type="item.icon" :key="'icon:'+item.name"></Icon>
          <span :key="item.name">{{ item.title }}</span>
        </MenuItem>

        <Submenu v-if="item.children && item.children.length >= 1" :name="item.name" :key="item.name">
          <template slot="title">
            <Icon :type="item.icon"></Icon>
            <span>{{ item.title }}</span>
          </template>
          <template v-for="child in item.children">
            <MenuItem :name="child.name" :key="child.name">
              <span :key="child.name">{{ child.title }}</span>
            </MenuItem>
          </template>
        </Submenu>
      </div>
    </Menu>
  </div>
</template>

<script>
  export default {
    props: {
      menuList: Array,
      collapsed: false
    },

    data() {
      return {
      }
    },

    computed: {
      activeMenuItemName: function() {
        return this.currentPath;
      },

      openSubmenuName: function() {
        var idx = this.currentPath.lastIndexOf('/');
        return this.currentPath.substr(0, idx);
      },

      currentPath: function() {
        return this.$route.path;
      }
    },

    methods: {
      onSelect(name) {
        this.$router.push(name);
      },
    },
  }
</script>

<style>
</style>
