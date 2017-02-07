/**
 * Created by cc on 2017/2/6.
 */
const signUtil = require('./ali.sign.js')
const request = require('request')

let config = {
  payApi: 'https://openapi.alipaydev.com/gateway.do',
  // payApi: 'https://openapi.alipay.com/gateway.do',
  charset: 'utf-8',
  sign_type: 'RSA2',
  version: '1.0'
}
let AliPay = function (initConfig) {
  config.app_id = initConfig.app_id
  config.notify_url = initConfig.notify_url
  config.private_key = initConfig.private_key
  return this;
};

AliPay.prototype.getPayRequest = function (order) {
  const param = {
    app_id: config.app_id,
    method: 'alipay.trade.wap.pay',
    charset: config.charset,
    sign_type: config.sign_type,
    timestamp: this.formatterDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    notify_url: config.notify_url,
    version: config.version,
  /*  subject: order.subject,
   body: order.body || '',
    out_trade_no: order.out_trade_no,
    total_amount: order.total_amount,
    product_code: order.product_code, */
    biz_content: JSON.stringify(order)
  }
  let str = this.getSignString(param)
  let sign = signUtil.sign(str, config.private_key)
  let url = `${config.payApi}?${str}&sign=${sign}`
  return url
}

AliPay.prototype.getSignString = function (data) {
  data = signUtil.sortObject(data)
  data = signUtil.objectFilter(data)
  sign = signUtil.stringify(data)
  console.log(sign);
  return sign
}

AliPay.prototype.formatterDate = function (data, fmt) {
    if (!data) {
      return ''
    }
    data = new Date(data)
    let o = {
      'M+': data.getMonth() + 1, // 月份
      'd+': data.getDate(), // 日
      'h+': data.getHours() % 12 === 0 ? 12 : data.getHours() % 12, // 小时
      'H+': data.getHours(), // 小时
      'm+': data.getMinutes(), // 分
      's+': data.getSeconds(), // 秒
      'q+': Math.floor((data.getMonth() + 3) / 3), // 季度
      'S': data.getMilliseconds() // 毫秒
    }
    let week = {
      '0': '/u65e5',
      '1': '/u4e00',
      '2': '/u4e8c',
      '3': '/u4e09',
      '4': '/u56db',
      '5': '/u4e94',
      '6': '/u516d'
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[data.getDay() + ''])
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }

module.exports = AliPay