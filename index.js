/**
 * Created by cc on 2017/1/17.
 */
var WxPay = require('./lib/wxpay')
var AliPay = require('./lib/alipay')

module.exports = {
  WxPay: WxPay,
  AliPay: AliPay
}

let config = {
  app_id: '2016073000127091',
  private_key: './privateKey.txt',
  public_key: './publicKey.txt',
  dev: true,
  notify_url: "http://localhost:8200"
}
let alipay = new AliPay(config)
let re = alipay.getRequestURI({
    biz_content: JSON.stringify({
        body:  "支付测试",
        subject: "支付测试",
        out_trade_no: "201688888",
        total_amount: 1.0,
        product_code: "QUICK_WAP_PAY"
    })
});
console.log(re)
