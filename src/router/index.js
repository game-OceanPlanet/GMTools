import Vue from 'vue'
import Router from 'vue-router'
import * as services from '@/services'
import LoginPage from '@/pages/LoginPage'
import ConsoleLayout from '@/pages/ConsoleLayout'
import RealtimeSummaryPage from '@/pages/analy/RealtimeSummaryPage'
import HistorySummarySimplePage from '@/pages/analy/HistorySummarySimplePage'
import ChannelBasePage from '@/pages/analy/ChannelBasePage'
import SumBasePage from '@/pages/analy/SumBasePage'
import ZoneRetainPage from '@/pages/analy/ZoneRetainPage'
import ChannelRetainPage from '@/pages/analy/ChannelRetainPage'
import SumRetainPage from '@/pages/analy/SumRetainPage'
import PayRetainPage from '@/pages/analy/PayRetainPage'
import LtvPage from '@/pages/analy/LtvPage'
import OnlinePage from '@/pages/analy/OnlinePage'
import OnlineCurvePage from '@/pages/analy/OnlineCurvePage'
import GoldSummaryPage from '@/pages/analy/GoldSummaryPage'
import HelloPage from '@/pages/gmt/HelloPage'
import MailToPlayersPage from '@/pages/gmt/MailToPlayersPage'
import MailToZonesPage from '@/pages/gmt/MailToZonesPage'
import MarqueeSendPage from '@/pages/gmt/MarqueeSendPage'
import MarqueeTaskPage from '@/pages/gmt/MarqueeTaskPage'
import MarqueeListPage from '@/pages/gmt/MarqueeListPage'
import NoticeListPage from '@/pages/gmt/NoticeListPage'
import BanChatPage from '@/pages/gmt/BanChatPage'
import BanLoginPage from '@/pages/gmt/BanLoginPage'
import RechargePage from '@/pages/gmt/RechargePage'
import PlayerInfoPage from '@/pages/gmt/PlayerInfoPage'
import GoldUpdatePage from '@/pages/gmt/GoldUpdatePage'
import ActivityPreViewPage from '@/pages/activitys/ActivityPreViewPage'
import GlobalConfigPage from '@/pages/gmt/GlobalConfigPage'
import PetConfigPage from '@/pages/gmt/PetConfigPage'
import InjectPage from '@/pages/gmt/InjectPage'
import DirectRatePage from '@/pages/gmt/DirectRatePage'
import TeamRatePage from '@/pages/gmt/TeamRatePage'
import TradeCostPage from '@/pages/gmt/TradeCostPage'
import DolpinWaitPage from '@/pages/gmt/DolpinWaitPage'
import DolpinAIWaitPage from '@/pages/gmt/DolpinAIWaitPage'
import RechargeVertifyPage from '@/pages/gmt/RechargeVertifyPage'
import RechargeLogsPage from '@/pages/gmt/RechargeLogsPage'
import SpeedPlayerPage from '@/pages/gmt/SpeedPlayerPage'
import HistorySummaryPage from '@/pages/analy/HistorySummaryPage'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/login',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        // 如果已经是登录状态，就不跳转到登录页面，而是跳转到默认页面
        if (services.isLoggedIn()) {
          services.initRegion();
          next('/')
        } else {
          next();
        }
      }
    },
    {
      path: '/',
      meta: { requiresAuth: true }, // 自定义元数据，详见下方对beforeEach()的调用
      component: ConsoleLayout,
      children: [
        {
          // 默认显示summary页面
          path: '',
          redirect: '/summary'
        },
        {
          path: 'summary',
          component: RealtimeSummaryPage
        },
        {
          path: '/base/zone',
          component: HistorySummarySimplePage
        },
        {
          path: '/base/channel',
          component: ChannelBasePage
        },
        {
          path: '/base/sum',
          component: HistorySummaryPage
        },
        {
          path: '/retain/zone',
          component: ZoneRetainPage
        },
        {
          path: '/retain/channel',
          component: ChannelRetainPage
        },
        {
          path: '/retain/sum',
          component: SumRetainPage
        },
        {
          path: '/pay/ltv',
          component: LtvPage
        },
        {
          path: '/pay/retain',
          component: PayRetainPage
        },
        {
          path: '/amount/gold_sum',
          component: GoldSummaryPage
        },
        {
          path: '/online/realtime',
          component: OnlinePage
        },
        {
          path: '/online/curve',
          component: OnlineCurvePage
        },
        {
          path: '/gmt/hello',
          component: HelloPage
        },
        {
          path: '/gmt/mail/player',
          component: MailToPlayersPage
        },
        {
          path: '/gmt/mail/zone',
          component: MailToZonesPage
        },
        {
          path: '/gmt/marquee/send',
          component: MarqueeSendPage
        },
        {
          path: '/gmt/marquee/task',
          component: MarqueeTaskPage
        },
        {
          path: '/gmt/marquee/list',
          component: MarqueeListPage
        },
        {
          path: '/gmt/notice/list',
          component: NoticeListPage
        },
        {
          path: '/gmt/query_role',
          component: PlayerInfoPage
        },
        {
          path: '/gmt/query_speed_role',
          component: SpeedPlayerPage
        },
        {
          path: '/gmt/query_gold',
          component: GoldUpdatePage
        },
        {
          path: '/gmt/ban/chat',
          component: BanChatPage
        },
        {
          path: '/gmt/ban/login',
          component: BanLoginPage
        },
        {
          path: '/gmt/recharge',
          component: RechargePage
        },
        {
          path: '/activitys/active',
          component: ActivityPreViewPage
        },
        {
          path: '/gmt/global_confg',
          component: GlobalConfigPage
        },
        {
          path: '/gmt/pet_confg',
          component: PetConfigPage
        },
        {
          path: '/gmt/inject_confg',
          component: InjectPage
        },
        {
          path: '/gmt/directRate_confg',
          component: DirectRatePage
        },
        {
          path: '/gmt/teamRate_confg',
          component: TeamRatePage
        },
        {
          path: '/gmt/tradeCostt_confg',
          component: TradeCostPage
        },
        {
          path: '/gmt/dolp_wait',
          component: DolpinWaitPage
        },
        {
          path: '/gmt/dolpAI_wait',
          component: DolpinAIWaitPage
        },
        {
          path: '/gmt/recharge_vertify',
          component: RechargeVertifyPage
        },
        {
          path: '/gmt/recharge_logs',
          component: RechargeLogsPage
        },
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!services.isLoggedIn()) {
      // 尚未登录，跳转至登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 浏览器地址栏中的url中会多出一个名为redirect的参数，登录成功后应主动取得该参数并跳转
      })
    } else {
      services.tryRefreshRegion();
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
});

export default router;
