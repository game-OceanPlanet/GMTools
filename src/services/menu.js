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
          title: '基础统计',
          name: '/base/sum',
        },
        {
          title: '区服分析',
          name: '/base/zone',
        },
        {
          title: '渠道分析',
          name: '/base/channel',
        }
      ]
    },
    {
      title: '留存分析',
      icon: 'ios-bookmarks',
      name: '/retain',
      children: [
        {
          title: '留存统计',
          name: '/retain/sum',
        },
        {
          title: '区服留存',
          name: '/retain/zone',
        },
        {
          title: '渠道留存',
          name: '/retain/channel',
        }
      ]
    },
    {
      title: '付费分析',
      icon: 'social-yen',
      name: '/pay',
      children: [
        {
          title: 'LTV',
          name: '/pay/ltv',
        },
        {
          title: '付费留存',
          name: '/pay/retain',
        }
      ]
    },
    {
      title: '货币分析',
      icon: 'social-yen',
      name: '/amount',
      children: [
        {
          title: '元宝统计',
          name: '/amount/gold_sum',
        }
      ]
    },
    {
      title: '在线分析',
      icon: 'wifi',
      name: '/online',
      children: [
        {
          title: '实时在线',
          name: '/online/realtime',
        },
        {
          title: '在线曲线',
          name: '/online/curve',
        }
      ]
    }
  ];
};

export const getGmtMenuList = function () {
  return [
    {
      title: '跑马灯',
      icon: 'speakerphone',
      name: '/gmt/marquee',
      children: [
        {
          title: '实时发送',
          name: '/gmt/marquee/send',
        },
        {
          title: '定时任务',
          name: '/gmt/marquee/task',
        },
        {
          title: '跑马灯列表',
          name: '/gmt/marquee/list',
        }
      ]
    },
    {
      title: '公告管理',
      icon: 'navicon-round',
      name: '/gmt/notice',
      children: [
        {
          title: '公告列表',
          name: '/gmt/notice/list',
        }
      ]
    },
    {
      title: '邮件发送',
      icon: 'email',
      name: '/gmt/mail',
      children: [
        {
          title: '按玩家发送',
          name: '/gmt/mail/player',
        },
        {
          title: '按服务器发送',
          name: '/gmt/mail/zone',
        }
      ]
    },
    {
      title: '玩家管理',
      icon: 'ios-people',
      name: '/gmt/player',
      children: [
        {
          title: '查询',
          name: '/gmt/query_role',
        },
        {
          title: '元宝',
          name: '/gmt/query_gold',
        },
        {
          title: '禁言',
          name: '/gmt/ban/chat',
        },
        {
          title: '封号',
          name: '/gmt/ban/login',
        },
        {
          title: '充值',
          name: '/gmt/recharge',
        }
      ]
    }
  ];
}
export const getActivityMenuList = function () {
  return [
    {
      title: '活动预览',
      icon: 'ios-book',
      name: '/base',
      children: [
        {
          title: '查询',
          name: '/activitys/active',
        },
      ]
    },
    

  ]
}