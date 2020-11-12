export default {
    // 截取url中的数据
    getUrlData() {
        /**
        * tempStr 格式是http://域名/路由?key=value&key=value...
        */
       console.log(window.location.href)
        let tempStr = window.location.href
        /**
        * tempArr 是一个字符串数组 格式是["key=value", "key=value", ...]
        */
        let tempArr = tempStr.split('?')[1] ? tempStr.split('?')[1].split('&') : []
        /**
        * returnArr 是要返回出去的数据对象 格式是 { key: value, key: value, ... }
        */
        let returnArr = {}
        /**
         * 将地址中的附带参数放到returnArr
         */
        tempArr.forEach(element => {
            returnArr[element.split('=')[0]] = element.split('=')[1]
        })
        /*输出日志*/
        return returnArr
    }
}
  