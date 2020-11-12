import store from '../store.js'
import {Dialog} from 'vant'
import router from '../router'

export default {
    /**
     * 判断是否是手机号
     * @param tel
     * @returns {boolean}
     */
    isMobile: function (tel) {
        var reg = /^0?1[1|2|3|4|5|6|7|8|9][0-9]\d{8}$/;
        return reg.test(tel);
    },
    /**
     * 主要用来解决Vue引用传递的BUG
     * @param obj
     * @returns {any}
     */
    clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    //格式化日期,
    format_date: function (date, format) {
        var paddNum = function (num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }
        //指定格式字符
        var cfg = {
            yyyy: date.getFullYear() //年 : 4位
            , yy: date.getFullYear().toString().substring(2)//年 : 2位
            , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
            , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
            , d: date.getDate()   //日 : 如果1位的时候不补0
            , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
            , hh: date.getHours()  //时
            , mm: date.getMinutes() //分
            , ss: date.getSeconds() //秒
        }
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig, function (m) {
            return cfg[m];
        });
    },
    //例如今天是2020-1-31  调用getLocaltime(30) 那么返回值就是 [2020-1-1,2020-1-31]
    getLocaltime(date_count) {
        let date = new Date();
        let end = new Date(date.getTime());
        let start = new Date(date.getTime() - 3600 * 1000 * 24 * date_count);
        let startY = start.getFullYear();
        let startM = start.getMonth() + 1;
        let startD = start.getDate();
        startM = startM < 10 ? '0' + startM : startM;
        startD = startD < 10 ? '0' + startD : startD;
        let starts = startY + '-' + startM + '-' + startD;//开始时间
        let endY = end.getFullYear();
        let endM = end.getMonth() + 1;
        let endD = end.getDate();
        endM = endM < 10 ? '0' + endM : endM;
        endD = endD < 10 ? '0' + endD : endD;
        let ends = endY + '-' + endM + '-' + endD;//结束时间
        return [starts, ends]
    },
    // 是否有权限
    isAuth(authName) {
        let auths = store.state.modules
        let auth = auths.indexOf(authName)
        if(auth < 0){
            return false
        }else {
            return true
        }
    },
    isDevice() {
        var path = window.location.pathname
        return new Promise((resolve, reject) => {
            if (!store.state.isLogin) {
                Dialog.alert({
                    width: '284px',
                    message: '未登录，前往登录？',
                    confirmButtonText: '确认',
                    showCancelButton: true
                }).then(() => {
                    resolve(false)
                    router.push({
                        path: '/login',
                    })
                }).catch(() => {
                    resolve(false);
                })
            } else if (!store.state.deviceInfo) {
                Dialog.alert({
                    width: '284px',
                    message: '抱歉，您未绑定支持该功能的智能设备，暂无法使用此功能',
                    confirmButtonText: '添加',
                    showCancelButton: true,
                }).then(() => {
                    resolve(false)
                    this.addDeviceBtn().then(res => {
                        if (res) {
                            router.push({
                                path: '/deviceCreate',
                            })
                        }
                    })
                }).catch(() => {
                    resolve(false);
                })
            } else {
                resolve(true)
            }
        })
    },
    /* 添加设备按钮先调取的函数 */
    addDeviceBtn() {
        return new Promise((resolve, reject) => {
            if (!store.state.isLogin) {
                Dialog.alert({
                    width: '284px',
                    message: '未登录，前往登录？',
                    confirmButtonText: '确认',
                    showCancelButton: true
                }).then(() => {
                    resolve(false)
                    router.push({
                        path: '/login',
                    })
                }).catch(() => {
                    resolve(false);
                })
            } else {
                var user = sessionStorage.getItem('user');
                user = JSON.parse(user);
                console.log(user)
                if (user.mobile && user.truename) {
                    resolve(true)
                } else {
                    Dialog.alert({
                        title: '提示',
                        width: '284px',
                        message: '请先完善个人信息',
                        confirmButtonText: '确定',
                    }).then(() => {
                        resolve(false)
                        if (user.mobile) {
                            router.push({
                                path: '/user/nickname'
                            })
                        } else {
                            router.push({
                                path: '/improve_data',
                            })
                        }
                    })
                }
            }
        })
    },
    getDay: function (day, format) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        return this.format_date(today, format)
    },
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param{*}lat 百度纬度
     * @param{*}lng 百度经度
     */
    bdToGcj2: function (lat, lng) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng - 0.0065;
        let y = lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        let g2_lnn = z * Math.cos(theta);
        let g2_lat = z * Math.sin(theta);
        return {lat: g2_lat, lng: g2_lnn}
    },
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param{*}g2_lat 火星坐标纬度
     * @param{*}g2_lng 火星坐标经度
     */
    gcj2ToBd: function (g2_lat, g2_lng) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let z = Math.sqrt(g2_lng * g2_lng + g2_lat * g2_lat) + 0.00002 * Math.sin(g2_lat * x_pi);
        let theta = Math.atan2(g2_lat, g2_lngg2_lng) + 0.000003 * Math.cos(g2_lng * x_pi);
        let bd_lng = z * Math.cos(theta) + 0.0065;
        let bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    },
}
