const crypto = require('crypto');
const queryString = require('querystring');
const _ = require('underscore');
const moment = require('moment');
const signUtil = require('./ali.sign.js')

let AliPay = function (config) {
    this.app_id = config.app_id;
    this.gateway = config.dev ? 'https://openapi.alipaydev.com/gateway.do' : 'https://openapi.alipay.com/gateway.do';
    this.private_key = config.private_key;
    this.public_key = config.public_key;
    this.notify_url = config.notify_url; 
    return this;
}

AliPay.prototype.getRequestURI = function(params) {
    params = _.defaults(params, {
        app_id: this.app_id,
        charset: "utf-8",
        version: "1.0",
        method: "alipay.trade.wap.pay",
        sign_type: "RSA2",
        notify_url: this.notify_url,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    })
    params.sign =  encodeURIComponent(this.getSigned(params));
    return this.gateway + "?" + this.getSignString(params);
}

AliPay.prototype.getSigned = function(params) {
    let signParams = _.clone(params);
    delete signParams["sign"];
    let signString = this.getSignString(signParams);
    return signUtil.sign(signString, this.private_key)
}

AliPay.prototype.verifySign = function(params) {
    let sign = params.sign;
    delete params.sign;
    delete params.sign_type;
    let signString = this.getSignString(params)
    return signUtil.verify(signString, sign, this.public_key)
}

AliPay.prototype.getSignString = function(params) {

    let sortKeys = Object.keys(params).sort();
    let sortedResult = sortKeys.map(function(key) {
        let value = params[key];
        return [key, value].join("=");
    });
    return sortedResult.join("&");
}
module.exports = AliPay