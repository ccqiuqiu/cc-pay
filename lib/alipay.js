const crypto = require('crypto')
const queryString = require('querystring')
const _ = require('underscore')
const moment = require('moment')
const fs = require('fs')
const axios = require('axios')
const qr = require('qr-image')

let AliPay = function (config) {
    this.app_id = config.app_id;
    this.gateway = config.dev ? 'https://openapi.alipaydev.com/gateway.do' : 'https://openapi.alipay.com/gateway.do';
    this.private_key = config.private_key;
    this.public_key = config.public_key;
    this.notify_url = config.notify_url;
    this.return_url = config.return_url;
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
        return_url: this.return_url,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    })
    params.sign =  encodeURIComponent(this.getSigned(params));
    return this.gateway + "?" + this.getSignString(params);
}
AliPay.prototype.getQrCodeRequest = function(params) {
    params = _.defaults(params, {
        app_id: this.app_id,
        charset: "utf-8",
        version: "1.0",
        method: "alipay.trade.precreate",
        sign_type: "RSA2",
        notify_url: this.notify_url,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    })
    params.sign =  encodeURIComponent(this.getSigned(params));
    params.biz_content =  encodeURIComponent(params.biz_content);
    return this.gateway + "?" + this.getSignString(params);
}
AliPay.prototype.getQrCode = function(params, cb) {
    let url = this.getQrCodeRequest(params)
    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        if(response.data.alipay_trade_precreate_response.code === '10000'){
          resolve({flg:true,qr_code: qr.imageSync(response.data.alipay_trade_precreate_response.qr_code, { type: 'svg' })})
        }else {
          resolve({flg:false,res:response})
        }
    }).catch(error => reject(error))
    })
}

AliPay.prototype.getSigned = function(params) {
    let signParams = _.clone(params);
    delete signParams["sign"];
    let signString = this.getSignString(signParams);
    return this.sign(signString, this.private_key)
}

AliPay.prototype.verifySign = function(params) {
    let sign = params.sign;
    let aaa = this.getSignString(params)
    delete params.sign;
    delete params.sign_type;
    let signString = this.getSignString(params)
    return this.verify(signString, sign, this.public_key)
}

AliPay.prototype.getSignString = function(params) {
    let sortKeys = Object.keys(params).sort();
    let sortedResult = sortKeys.map(function(key) {
        let value = params[key];
        return [key, value].join("=");
    });
    return sortedResult.join("&");
}

/**
 * 生成签名
 * @param {String} prestr 待签名的源字符串
 * @param {String} key_file 私钥文件所在路径
 * @return {String} 签名值
 */
AliPay.prototype.sign = function(prestr, key_file) {
  var pem, prikey, signob, signstr;
  pem = fs.readFileSync(key_file);
  prikey = pem.toString('ascii');
  signob = crypto.createSign('RSA-SHA256');
  signob.update(prestr, 'utf8');
  signstr = signob.sign(prikey, 'base64');
  return signstr;
};
/**
 * 验证签名
 * @param {String} prestr 需要签名的字符串
 * @param {String} sign 签名结果
 * @param {String} cert_file 支付宝公钥文件路径
 * @return {Boolean} 是否通过验证
 */

AliPay.prototype.verify = function(prestr, sign, cert_file) {
  var publicKey, publicPem, verifyob;
  publicPem = fs.readFileSync(cert_file);
  publicKey = publicPem.toString('ascii');
  console.log(publicKey);
  verifyob = crypto.createVerify('RSA-SHA256');
  verifyob.update(prestr, 'utf8');
  return verifyob.verify(publicKey, sign, 'base64');
};
module.exports = AliPay