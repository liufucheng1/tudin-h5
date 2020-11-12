
import Vue from 'vue'
import Router from 'vue-router'

if (!window.VueRouter) Vue.use(Router)

const vueRouter = new Router({
    mode:'history',
    // base: process.env.BASE_URL,
    routes: [
        {
            path:'/agreenMent',
            name:'AgreenMent',
            meta:{meta:true,title:'服务协议'},
            component:(resolve) => require(['@/components/agreenMent/index.vue'], resolve),
        },
        {
            path:'/login',
            name:'LoginHome',
            redirect:'/login/index',
            meta:{meta:false,title:''},
            component:(resolve) => require(['@/views/login/home.vue'], resolve),
            children:[
                {
                    path:'index',
                    name:'LoginIndex',
                    meta:{requiresAuth:true,title:'登录'},
                    component:(resolve) => require(['@/views/login/index.vue'], resolve),
                },
                {
                    path:'register',
                    name:'LoginRegister',
                    meta:{requiresAuth:true,title:'注册'},
                    component:(resolve) => require(['@/views/login/register.vue'], resolve),
                }
            ]
        },{
            path:'/forget',
            name:'ForgetPassword',
            meta:{meta:true,title:'忘记密码'},
            component:(resolve) => require(['@/views/forget/index.vue'], resolve),
        }
        ,{
            path:'/',
            name:'Home',
            meta:{meta:true,title:'首页'},
            redirect:'/safety',
            component:(resolve) => require(['@/views/home/home.vue'], resolve),
            children:[
            {
                //  安全
                path:'safety',
                name:'Safety',
                meta:{meta:true,title:'首页\/安全'},
                component:(resolve) => require(['@/views/safety/index.vue'], resolve),
            },{
                //  通话
                path:'phone',
                name:'Phone',
                meta:{meta:true,title:'首页\/通话'},
                component:(resolve) => require(['@/views/phone/index.vue'], resolve),
            },{
                //  消息
                path:'notice',
                name:'Notice',
                meta:{meta:true,title:'首页\/消息'},
                component:(resolve) => require(['@/views/notice/index.vue'], resolve),
            },{
                //  我的
                path:'self',
                name:'Self',
                meta:{meta:true,title:'首页\/我的'},
                component:(resolve) => require(['@/views/self/index.vue'], resolve),
            }
            ]
        },{
            // 消息列表
            path:'/noticeList',
            name:'NoticeList',
            meta:{meta:true,title:'首页\/消息'},
            component:(resolve) => require(['@/views/notice/list.vue'],resolve)
        },
        {
            // 失踪预警
            path:'/warning',
            name:'Warning',
            meta:{meta:true,title:'首页\/失踪预警'},
            component:(resolve) => require(['@/views/warning/index.vue'],resolve)
        },{
            // 失踪预警
            path:'/warning_page',
            name:'WarningPage',
            meta:{meta:true,title:'首页\/失踪预警'},
            component:(resolve) => require(['@/views/warning/page.vue'],resolve)
        },{
            // 发布预警
            path:'/warning/send',
            name:'WarningSend',
            meta:{meta:true,title:'首页\/发布预警'},
            component:(resolve) => require(['@/views/warning/send.vue'],resolve)
        },{
            // 预警详情
            path:'/warning/detail',
            name:'WarningDetail',
            meta:{meta:true,title:'首页\/发布预警\/预警详情'},
            component:(resolve) => require(['@/views/warning/detail.vue'],resolve)
        },{
            // 预警协议
            path:'/warning/protocal',
            name:'WarningProtocal',
            meta:{meta:true,title:'首页\/发布预警\/预警协议'},
            component:(resolve) => require(['./components/sendWarning/protocal.vue'],resolve)
        },{
            // 隐私协议
            path:'/warning/privacy',
            name:'WarningPrivacy',
            meta:{meta:true,title:'首页\/发布预警\/隐私协议'},
            component:(resolve) => require(['./components/sendWarning/privacy.vue'],resolve)
        },
        {
            // 选择地址
            path:'/warning/lost/address',
            name:'WarningLostAddress',
            meta:{meta:true,title:'首页\/发布预警\/丢失地址'},
            component:(resolve) => require(['./components/sendWarning/address.vue'],resolve)
        },{
            // 消息详情
            path:'/noticeDetail',
            name:'NoticeDetail',
            meta:{meta:true,title:'首页\/消息\/消息详情'},
            component:(resolve) => require(['@/views/notice/detail.vue'],resolve)
        },
        // 设备消息
        {
            path:'/deviceNotice',
            name:'DeviceNotice',
            meta:{meta:true,title:'首页\/消息\/设备消息'},
            component:(resolve) => require(['@/views/notice/deviceNotice.vue'],resolve)
        },
        // 系统消息
        {
            path:'/systemNotice',
            name:'SystemNotice',
            meta:{meta:true,title:'首页\/消息\/系统消息'},
            component:(resolve) => require(['@/views/notice/systemNotice.vue'],resolve)
        },
        // 添加设备
        {
            path:'/deviceCreate',
            name:'DeviceCreate',
            meta:{meta:true,title:'首页\/添加设备'},
            component:(resolve) => require(['@/views/device/create.vue'],resolve)
        },
        // 设备轨迹
        {
            path:'/deviceTracks',
            name:'DeviceTracks',
            meta:{meta:true,title:'首页\/设备轨迹'},
            component:(resolve) => require(['@/views/device/tracks.vue'],resolve)
        },
        // s设备信息
        {
            path:'/deviceInfo',
            name:'DeviceInfo',
            meta:{meta:true,title:'首页\/我的\/设备信息'},
            component:(resolve) => require(['@/views/device/info.vue'],resolve)
        },
        {
            path:'/device/nickname',
            name:'DeviceNickname',
            meta:{meta:true,title:'首页\/我的\/设备信息\/修改昵称'},
            component:(resolve) => require(['@/views/device/devicenickname.vue'],resolve)
        },
        // 省电优化
        {
            path:'/economy',
            name:'Economy',
            meta:{meta:true,title:'首页\/我的\/省电优化'},
            component:(resolve) => require(['@/views/device/economy.vue'],resolve)
        },
        // 定位模式
        {
            path:'/locationType',
            name:'LocationType',
            meta:{meta:true,title:'首页\/我的\/省电优化\/定位模式'},
            component:(resolve) => require(['@/components/location/locationType.vue'],resolve)
        },
        // 定位时间
        {
            path:'/locationTime',
            name:'LocationTime',
            meta:{meta:true,title:'首页\/我的\/省电优化\/定位时间'},
            component:(resolve) => require(['@/components/location/locationTime.vue'],resolve)
        },
        // 设备管理界面
        {
            path:'/equipment',
            name:'Equipment',
            meta:{meta:true,title:'首页\/我的\/设备管理'},
            component:(resolve) => require(['@/views/device/equipment.vue'],resolve)
        },
        //免打扰时间段
        {
            path:'/undisturb',
            name:'Undisturb',
            meta:{meta:true,title:'首页\/我的\/设备管理\/免打扰时间段'},
            component:(resolve) => require(['@/views/device/undisturb.vue'],resolve)
        },
        //免打扰时间段
        {
            path:'/addUndisturb',
            name:'AddUndisturb',
            meta:{meta:true,title:'首页\/我的\/设备管理\/免打扰时间段\/新增时段'},
            component:(resolve) => require(['@/components/undistrub/create.vue'],resolve)
        },
        //免打扰时间段
        {
            path:'/simInfo',
            name:'SIMInfo',
            meta:{meta:true,title:'首页\/我的\/设备管理\/SIM卡信息'},
            component:(resolve) => require(['@/views/device/simInfo.vue'],resolve)
        },
        //家庭管理
        {
            path:'/familys',
            name:'Familys',
            meta:{meta:true,title:'首页\/我的\/家庭管理'},
            component:(resolve) => require(['@/views/device/familys.vue'],resolve)
        },
        //家庭管理>修改资料
        {
            path:'/familys/edit',
            name:'FamilysEdit',
            meta:{meta:true,title:'首页\/我的\/家庭管理\/修改资料'},
            component:(resolve) => require(['@/components/familys/edit.vue'],resolve)
        },
        //家庭管理>新增人员
        {
            path:'/familys/create',
            name:'FamilysCreate',
            meta:{meta:true,title:'首页\/我的\/家庭管理\/新增人员'},
            component:(resolve) => require(['@/components/familys/create.vue'],resolve)
        },
        //电子围栏
        {
            path:'/fence',
            name:'Fence',
            meta:{meta:true,title:'首页\/我的\/电子围栏'},
            component:(resolve) => require(['@/views/device/fence.vue'],resolve)
        }
        ,
        //新增电子围栏
        {
            path:'/fence/create',
            name:'FenceCreate',
            meta:{meta:true,title:'首页\/我的\/电子围栏\/新增'},
            component:(resolve) => require(['@/components/fence/create.vue'],resolve)
        },
        // 电子围栏搜索位置
        {
            path:'/fence/searchAddress',
            name:'FenceSearchAddress',
            meta:{meta:true,title:'首页\/我的\/电子围栏\/新增\/位置搜索'},
            component:(resolve) => require(['@/components/fence/searchAddress.vue'],resolve)
        },
        //聚合地图
        {
            path:'/map',
            name:'Map',
            meta:{meta:true,title:'首页\/我的\/聚合地图'},
            component:(resolve) => require(['@/views/device/map.vue'],resolve)
        },
        // 电子围栏搜索位置
        {
            path:'/map/data',
            name:'MapData',
            meta:{meta:true,title:'首页\/我的\/聚合地图\/设备列表'},
            component:(resolve) => require(['@/components/map/data.vue'],resolve)
        },
        // 计步
        {
            path:'/step',
            name:'Step',
            meta:{meta:true,title:'首页\/我的\/计步'},
            component:(resolve) => require(['@/views/device/step.vue'],resolve)
        },
        // 心率
        {
            path:'/heart',
            name:'Heart',
            meta:{meta:true,title:'首页\/我的\/心率'},
            component:(resolve) => require(['@/views/device/heart.vue'],resolve)
        },
        // 血压
        {
            path:'/blood',
            name:'Blood',
            meta:{meta:true,title:'首页\/我的\/血压'},
            component:(resolve) => require(['@/views/device/blood.vue'],resolve)
        },
        // 体温
        {
            path:'/health',
            name:'Health',
            meta: { meta:true, title: '首页\/我的\/健康管家' },
            component: (resolve) => require(['@/views/self/health.vue'],resolve)
        },
        // 体温详情
        {
            path:'/health/detail',
            name:'HealthDetail',
            meta: { meta:true, title: '首页\/我的\/健康管家\/测量数据' },
            component: (resolve) => require(['@/components/health/detail.vue'],resolve)
        },
        // 使用手册
        {
            path:'/manual',
            name:'Manual',
            meta:{meta:true,title:'首页\/我的\/使用手册'},
            component:(resolve) => require(['@/views/self/manual.vue'],resolve)
        },
        // 关于
        {
            path:'/about',
            name:'About',
            meta:{meta:true,title:'首页\/我的\/关于'},
            component:(resolve) => require(['@/views/self/about.vue'],resolve)
        },
        // 版本说明
        {
            path:'/versions',
            name:'Versions',
            meta:{meta:true,title:'首页\/我的\/关于\/版本说明'},
            component:(resolve) => require(['@/views/self/versions.vue'],resolve)
        },
        // 设置
        {
            path:'/setting',
            name:'Setting',
            meta:{meta:true,title:'首页\/我的\/设置'},
            component:(resolve) => require(['@/views/self/setting.vue'],resolve)
        },
        {
            path:'/user/nickname',
            name:'UserNickname',
            meta:{meta:true,title:'首页\/我的\/设置\/昵称设置'},
            component:(resolve) => require(['@/views/self/nickname.vue'],resolve)
        },
        // 修改密码
        {
            path:'/editPwd',
            name:'EdirPwd',
            meta:{meta:true,title:'首页\/我的\/设置\/修改密码'},
            component:(resolve) => require(['@/views/self/editPwd.vue'],resolve)
        },
        // 设置
        {
            path:'/resetMobile',
            name:'ResetMobile',
            meta:{meta:true,title:'首页\/我的\/设置\/更换登录手机号'},
            component:(resolve) => require(['@/views/self/resetMobile.vue'],resolve)
        },
        {
            path:'/improve_data',
            name:'ImproveData',
            meta:{meta:true,title:'首页\/完善资料'},
            component:(resolve) => require(['@/views/self/improve_data.vue'],resolve)
        }
    ]
})

export default vueRouter;


