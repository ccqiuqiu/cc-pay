/**
 * Created by cc on 2017/1/17.
 */
const WxPay = require('./lib/wxpay')
const AliPay = require('./lib/alipay')

module.exports = {
  WxPay: WxPay,
  AliPay: AliPay
}
