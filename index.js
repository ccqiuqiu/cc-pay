/**
 * Created by cc on 2017/1/17.
 */
const Payment = require('wechat-pay').Payment
const qr = require('qr-image');

let payment

let CcPay = function (initConfig) {
  payment = new Payment(initConfig)
  return this;
};

CcPay.prototype.getBrandWCPayRequestParams = function (order) {
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
CcPay.prototype.getWxQrCodePay = function (order) {
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
CcPay.prototype.getQrCode = function (text) {
  return qr.imageSync(text, { type: 'svg' })
}

module.exports = CcPay