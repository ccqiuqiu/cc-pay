/**
 * Created by cc on 2017/1/17.
 */
//const Payment = require('wechat-pay').Payment
const Payment = require('./wxpayment').Payment
const qr = require('qr-image');

let payment

let WxPay = function (initConfig) {
  payment = new Payment(initConfig)
  return this;
};

WxPay.prototype.getBrandWCPayRequestParams = function (order) {
  order.trade_type = 'JSAPI'
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, (err, payargs) => {
      if (err) {
        resolve({success: false, data: err.message || err })
      } else {
        resolve({success: true, data: payargs})
      }
    })
  })
}
WxPay.prototype.getAppRequestParams = function (order) {
  order.trade_type = 'APP'
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, (err, payargs) => {
      if (err) {
        resolve({success: false, data: err.message || err })
      } else {
        resolve({success: true, data: payargs})
      }
    })
  })
}
WxPay.prototype.getWxQrCodePay = function (order) {
  order.trade_type = 'NATIVE'
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, (err, payargs) => {
      if (err) {
        resolve({success: false, data: err.message || err })
      } else {
        resolve({success: true, data: this.getQrCode(payargs.code_url)})
      }
    })
  })
}
WxPay.prototype.getQrCode = function (text) {
  return qr.imageSync(text, { type: 'svg' })
}

module.exports = WxPay