import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'



/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/funeralSupervision',
    component: Layout,
    redirect: '/funeralSupervision/itemsList',
    name: '殡葬监管',
    meta: {
      title: '殡葬监管',
      icon: 'nested', roles: ['ROLE_ADMIN']
    },
    children: [
      {
        path: 'itemsList',
        component: () => import('@/views/funeralSupervision/itemsList'),
        name: '监管事项',
        meta: { title: '监管事项' },
        children: [
          {
            path: 'items',
            name: '事项清单',
            component: () => import('@/views/funeralSupervision/itemsList/items/index'),
            meta: { title: '事项清单' }
          },
          {
            path: 'list',
            name: '事项类型',
            component: () => import('@/views/funeralSupervision/itemsList/list/index'),
            meta: { title: '事项类型' }
          },

        ]
      },
      {
        path: 'manager',
        component: () => import('@/views/funeralSupervision/manager/index'),
        name: '部门经办人管理',
        meta: { title: '部门经办人管理' }
      },
      {
        path: 'illegal',
        component: () => import('@/views/funeralSupervision/illegal/list'),
        name: '违法案件',
        // redirect: '/funeralSupervision/illegal/index',
        meta: { title: '违法案件' },
        // children: [
        //   {
        //     path: 'list',
        //     component: () => import('@/views/funeralSupervision/illegal/list'),
        //     name: '违法案件列表',
        //     meta: { title: '违法案件', activeMenu: '/funeralSupervision/illegal/list' }
        //     // hidden: true
        //   }
        // ]
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/funeralSupervision/edit'),
        name: '编辑违法案件信息',
        meta: { title: '编辑违法案件信息', noCache: false },
        hidden: true
      },
      {
        path: 'create',
        component: () => import('@/views/funeralSupervision/create'),
        name: '新建违法案件信息',
        meta: { title: '新建违法案件信息', noCache: false },
        hidden: true
      }
    ]
  },
  {
    path: '/supervision',
    component: Layout,
    name: '殡葬督察',
    meta: {
      title: '殡葬督察',
      icon: 'nested'
    },
    children: [
      {
        path: 'index',
        name: '公墓监管',
        component: () => import('@/views/supervision/index'),
        meta: { title: '公墓监管' }
      },
      {
        path: 'index2',
        name: '殡葬用品市场督察',
        component: () => import('@/views/supervision/index2'),
        meta: { title: '殡葬用品市场督察' }
      },
      {
        path: 'edit/:id',
        name: '公墓监管详情',
        component: () => import('@/views/supervision/edit'),
        meta: { title: '公墓监管详情' },
        hidden: true
      },
      {
        path: 'edit2/:id',
        name: '殡葬用品市场督察详情',
        component: () => import('@/views/supervision/edit2'),
        meta: { title: '殡葬用品市场督察详情' },
        hidden: true
      },

    ]
  },
  {
    path: '/departed',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '逝者管理',
        component: () => import('@/views/departed/index'),
        meta: { title: '逝者管理', icon: 'form' }
      },
      {
        path: 'create',
        name: '添加逝者信息',
        component: () => import('@/views/departed/create/index'),
        meta: { title: '添加逝者信息' },
        hidden: true
      },
      {
        path: 'edit/:id',
        name: '编辑逝者信息',
        component: () => import('@/views/departed/edit'),
        meta: { title: '编辑逝者信息', icon: 'form' },
        hidden: true
      },
      {
        path: 'service/:id',
        name: '选择服务',
        component: () => import('@/views/departed/service.vue'),
        meta: { title: '选择服务', icon: 'form' },
        hidden: true
      },
      {
        path: 'serviceFinal/:id',
        name: '缴费清单',
        component: () => import('@/views/departed/serviceFinal.vue'),
        meta: { title: '缴费清单', icon: 'form' },
        hidden: true
      }
    ]

  },
  {
    path: '/funeral',
    component: Layout,
    name: '殡仪馆管理',
    meta: {
      title: '殡仪馆管理',
      icon: 'table',
      roles: ['ROLE_ADMIN']
    },
    children: [
      {
        path: 'cinerary',
        name: '存放柜管理',
        component: () => import('@/views/funeral/cinerary/index'),
        meta: { title: '存放柜管理' }
      },

      {
        path: 'freezer',
        name: '冷藏柜管理',
        component: () => import('@/views/funeral/freezer/index'),
        meta: { title: '冷藏柜管理' }
      },

      {
        path: 'cars',
        name: '车辆管理',
        component: () => import('@/views/funeral/cars/index'),
        meta: { title: '车辆管理' }
      },
      {
        path: 'drivers',
        name: '司机管理',
        component: () => import('@/views/funeral/drivers/index'),
        meta: { title: '司机管理' }
      },
      {
        path: 'merchant',
        name: '商家管理',
        component: () => import('@/views/funeral/merchant/index'),
        meta: { title: '商家管理' }
      },
      {
        path: 'service',
        name: '殡仪服务管理',
        component: () => import('@/views/funeral/service/index'),
        meta: { title: '殡仪服务管理' },
        children: [
          {
            path: 'classify',
            component: () => import('@/views/funeral/service/classify/index'),
            name: '产品分类',
            meta: { title: '产品分类' }
          }, {
            path: 'production',
            component: () => import('@/views/funeral/service/production/index'),
            name: '殡仪产品',
            meta: { title: '殡仪产品管理' }
          }
        ]

      },
      {
        path: 'thirdService',
        name: '第三方服务管理',
        component: () => import('@/views/funeral/thirdService'),
        meta: { title: '第三方服务管理' },
        children: [
          {
            path: 'classify',
            component: () => import('@/views/funeral/thirdService/classify/index'),
            name: '产品分类',
            meta: { title: '产品分类' }
          }, {
            path: 'production',
            component: () => import('@/views/funeral/thirdService/production/index'),
            name: '殡仪产品',
            meta: { title: '殡仪产品管理' }
          }
        ]

      },


      // {
      //   path: 'connect',
      //   name: '殡仪联办',
      //   component: () => import('@/views/funeral/connect'),
      //   meta: { title: '殡仪联办' },
      //   children: [
      //     {
      //       path: 'car',
      //       component: () => import('@/views/funeral/connect/car/index'),
      //       name: '车辆调度',
      //       meta: { title: '车辆调度' }
      //     }, {
      //       path: 'block',
      //       component: () => import('@/views/funeral/connect/block/index'),
      //       name: '冷藏柜管理',
      //       meta: { title: '冷藏柜管理' }
      //     }
      //   ]
      // },

      // {
      //   path: 'order',
      //   name: '添加工单',
      //   component: () => import('@/views/funeral/create'),
      //   meta: { title: '添加工单' }
      // }

    ]
  },
  {
    path: '/operation',
    component: Layout,
    name: '业务管理',
    meta: {
      title: '业务管理',
      icon: 'el-icon-menu'
    },
    children: [
      {
        path: 'index',
        name: '逝仪预约',
        component: () => import('@/views/operation/index.vue'),
        meta: { title: '逝仪预约' }
      }, {
        path: 'body',
        name: '车辆调度管理',
        component: () => import('@/views/operation/body/index'),
        meta: { title: '车辆调度管理' }
      }, {
        path: 'cremation',
        name: '火化信息管理',
        component: () => import('@/views/operation/cremation/index'),
        meta: { title: '火化信息管理' }
      }, {
        path: 'cineraryOrders',
        name: '存放柜订单管理',
        component: () => import('@/views/operation/cineraryOrders/index'),
        meta: { title: '存放柜订单管理' }
      }, {
        path: 'freezerOrders',
        name: '冷藏柜订单管理',
        component: () => import('@/views/operation/freezerOrders/index'),
        meta: { title: '冷藏柜订单管理' }
      }, {
        path: 'benefit',
        name: '惠民补贴',
        component: () => import('@/views/operation/benefit/index'),
        meta: { title: '惠民补贴' }
      }, {
        path: 'third',
        name: '第三方服务',
        component: () => import('@/views/operation/third'),
        meta: { title: '第三方服务' }
      },

      {
        path: 'create',
        name: '逝者信息',
        component: () => import('@/views/operation/create/index'),
        meta: { title: '逝者信息' },
        hidden: true
      },
      {
        path: 'edit/:id',
        name: '编辑逝者信息',
        component: () => import('@/views/funeral/edit'),
        meta: { title: '编辑逝者信息' },
        hidden: true
      },]
  },
  {
    path: '/civilized',
    component: Layout,
    name: '文明办丧',
    meta: {
      title: '文明办丧',
      icon: 'el-icon-tickets'
    },
    children: [
      {
        path: 'rule',
        name: '殡葬政策法规',
        component: () => import('@/views/civilized/rule/index'),
        meta: { title: '殡葬政策法规' }
      }, {
        path: 'rule/edit/:id',
        name: '编辑法规',
        component: () => import('@/views/civilized/rule/edit/index'),
        meta: { title: '编辑法规' },
        hidden: true
      }, {
        path: 'rule/create',
        name: '新增法规',
        component: () => import('@/views/civilized/rule/create/index'),
        meta: { title: '新增法规' },
        hidden: true
      },
      {
        path: 'case',
        name: '违法违规案例',
        component: () => import('@/views/civilized/case/index.vue'),
        meta: { title: '违法违规案例' }
      }, {
        path: 'case/edit/:id',
        name: '编辑案例',
        component: () => import('@/views/civilized/case/edit/index'),
        meta: { title: '编辑案例' },
        hidden: true
      }, {
        path: 'case/create',
        name: '新增案例',
        component: () => import('@/views/civilized/case/create/index'),
        meta: { title: '新增案例' },
        hidden: true
      }
    ]
  },
  {
    path: '/cemetery',
    component: Layout,
    name: '公墓管理',
    meta: { title: '公墓管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: '公墓列表',
        component: () => import('@/views/cemetery/index'),
        meta: { title: '公墓列表' }
      }, {
        path: 'defunct',
        name: '逝者信息',
        component: () => import('@/views/cemetery/defunct'),
        meta: { title: '逝者信息' }
      }, {
        path: 'create',
        name: '公墓使用情况',
        component: () => import('@/views/cemetery/create/index'),
        meta: { title: '公墓使用情况' },
        hidden: true
      }, {
        path: 'info/:id',
        name: '查看公墓',
        component: () => import('@/views/cemetery/info'),
        meta: { title: '查看公墓' },
        hidden: true
      }
    ]
  },
  {
    path: '/warn',
    component: Layout,
    name: '告警管理',
    meta: { title: '告警管理', icon: 'el-icon-s-comment' },
    children: [
      {
        path: 'index',
        name: '公墓容量预警',
        component: () => import('@/views/warn/index1.vue'),
        meta: { title: '公墓容量预警' }
      },
      {
        path: 'index2',
        name: '遗体冷藏预警',
        component: () => import('@/views/warn/index2.vue'),
        meta: { title: '遗体冷藏预警' }
      },
      {
        path: 'index3',
        name: '落葬预警',
        component: () => import('@/views/warn/index3.vue'),
        meta: { title: '落葬预警' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    name: '人员管理',
    meta: { title: '人员管理', icon: 'user' },
    children: [
      {
        path: 'index',
        name: '人员管理',
        component: () => import('@/views/account/index'),
        meta: { title: '人员管理' }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/




  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
