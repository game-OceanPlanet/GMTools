export const getAnalyMenuList = function () {
  return [
    {
      title: '实时概览',
      icon: 'ios-clock-outline',
      name: '/summary'
    },
    {
      title: '基础分析',
      icon: 'ios-book',
      name: '/base',
      children: [
        {
          title: '充值统计',
          name: '/base/sum',
        },
        {
          title: '注册活跃',
          name: '/base/zone',
        }
      ]
    }
  ];
};

export const getAnalyMenuList2 = function () {
  return [
    {
      title: '实时概览',
      icon: 'ios-clock-outline',
      name: '/summary'
    },
    {
      title: '基础分析',
      icon: 'ios-book',
      name: '/base',
      children: [
        {
          title: '注册活跃',
          name: '/base/zone',
        }
      ]
    }
  ];
};

export const getGmtMenuList = function () {
  return [
    {
      title: '玩家管理',
      icon: 'ios-people',
      name: '/gmt/player',
      children: [
        {
          title: '玩家查询',
          name: '/gmt/query_role',
        },
        {
          title: '直推列表',
          name: '/gmt/team_list',
        },
        {
          title: '货币查询',
          name: '/gmt/query_gold',
        },
        {
          title: '封号管理',
          name: '/gmt/ban/login',
        },
        {
          title: '疑似外挂',
          name: '/gmt/query_speed_role',
        },
        {
          title: '充值',
          name: '/gmt/recharge',
        },
        {
          title: '充值记录',
          name: '/gmt/recharge_logs',
        },
        {
          title: '提现提审',
          name: '/gmt/recharge_vertify',
        },
        {
          title: '排队玩家',
          name: '/gmt/dolp_wait',
        },
        {
          title: '排队AI',
          name: '/gmt/dolpAI_wait',
        },
      ]
    },
     {
      title: '配置修改',
      icon: 'navicon-round',
      name: '/gmt/notice',
      children: [
        {
          title: '全局配置',
          name: '/gmt/global_confg',
        },
        {
          title: '鱼配置',
          name: '/gmt/pet_confg',
        },
        {
          title: '直推手续费',
          name: '/gmt/tradeCostt_confg',
        },
        {
          title: '直推收益',
          name: '/gmt/directRate_confg',
        },
        {
          title: '团队收益',
          name: '/gmt/teamRate_confg',
        },
        {
          title: '注入周期',
          name: '/gmt/inject_confg',
        }
      ]
    },
  ];
}

export const getGmtMenuList2 = function () {
  return [
    {
      title: '玩家管理',
      icon: 'ios-people',
      name: '/gmt/player',
      children: [
        {
          title: '玩家查询',
          name: '/gmt/query_role',
        },
        {
          title: '直推列表',
          name: '/gmt/team_list',
        },
        {
          title: '货币查询',
          name: '/gmt/query_gold',
        },
        {
          title: '封号管理',
          name: '/gmt/ban/login',
        },
        {
          title: '疑似外挂',
          name: '/gmt/query_speed_role',
        },
        {
          title: '充值',
          name: '/gmt/recharge',
        },
        {
          title: '提现提审',
          name: '/gmt/recharge_vertify',
        },
        {
          title: '排队玩家',
          name: '/gmt/dolp_wait',
        },
        {
          title: '排队AI',
          name: '/gmt/dolpAI_wait',
        },
      ]
    },
     {
      title: '配置修改',
      icon: 'navicon-round',
      name: '/gmt/notice',
      children: [
        {
          title: '全局配置',
          name: '/gmt/global_confg',
        },
        {
          title: '鱼配置',
          name: '/gmt/pet_confg',
        },
        {
          title: '直推手续费',
          name: '/gmt/tradeCostt_confg',
        },
        {
          title: '直推收益',
          name: '/gmt/directRate_confg',
        },
        {
          title: '团队收益',
          name: '/gmt/teamRate_confg',
        },
        {
          title: '注入周期',
          name: '/gmt/inject_confg',
        }
      ]
    },
  ];
}

export const getActivityMenuList = function () {
  return [
    {
      title: '系统管理',
      icon: 'ios-book',
      name: '/base',
      children: [
        {
          title: '用户管理',
          name: '/gmt/user',
        },
        {
          title: '权限管理',
          name: '/gmt/permit',
        },
      ]
    },
    

  ]
}
