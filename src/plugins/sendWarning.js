export default {
    send:function(tel,content){
        // 创建a标签
        var a = document.createElement('a');
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // 给a标签添加属性
        if(isiOS){
            a.setAttribute('href', 'sms:' + tel + '&body=' + content);
        }else if(isAndroid){
            a.setAttribute('href', 'sms:' + tel + '?body=' + content);
        }
        // 给a标签添加id
        a.setAttribute('id', 'js_a');
        //防止反复添加
        if(document.getElementById('js_a')) {
            document.body.removeChild(document.getElementById('js_a'));
        }
        document.body.appendChild(a);
        a.click();
    }
}