import fun from './functions.js'

export default {
    isMobile:(rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入手机号'));
        } else {
            if (!fun.isMobile(value)) {
                callback(new Error('请输入正确的手机号'));
            }
            callback();
        }
    },
    isArea:(rule, value, callback) => {
        if(value === undefined){
            callback(new Error('请选择省市区'))
        }else{
            if (value.length == 0) {
                callback(new Error('请选择省份'));
            }else if (value.length == 1){
                callback(new Error('请选择城市'));
            }else if (value.length == 2){
                callback(new Error('请选择区县'))
            }else{
                callback();
            }
        }

    },
    isIdcard:(rule,value,callback) => {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(card) === false)
        {
            callback(new Error('请输入正确的身份证号'));
        }else{
            callback();
        }
    },
    isPassword:(rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        } else {
            if (!fun.isMobile(value)) {
                callback(new Error('请输入正确的手机号'));
            }
            callback();
        }
    },
}