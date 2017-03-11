/**
 * Created by cc on 2017/1/17.
 */
// const AliPay = require('./index').AliPay

/*let config = {
  app_id: '2016073000127091',
  private_key: './privateKey.txt',
  public_key: './publicKey.txt',
  dev: true,
  notify_url: "http://localhost:8200"
}
let alipay = new AliPay(config)*/
//网页支付
/* re = alipay.getRequestURI({
    biz_content: JSON.stringify({
        body:  '支付测试',
      subject: '支付测试',
      out_trade_no: '201688888' + new Date().getTime(),
      total_amount: 1.0,
      product_code: "QUICK_WAP_PAY"
    })
})
console.log(re) */
//二维码
/*alipay.getQrCode({
    biz_content: JSON.stringify({
        body:  '支付测试',
      subject: '支付测试',
      out_trade_no: '201688888' + new Date().getTime(),
      total_amount: 1.0
    })
})
.then(re => {
  console.log(re);
})
.catch(error => {
  console.log(re);
})*/


const WxPay = require('./index').WxPay
const wxPay = new WxPay({  
  partnerKey: 'qwertyuiopasdfghjklzxcvbnm2016hu',
  appId: 'wxfc679dad9014ee9f',
  mchId: '1370862102',
  notifyUrl: 'http://www.icomehere.com:3805/v1/pay/wxpayCb'
})

let order = {
  body: 'i家i户订单',
  attach: '{"type":"order","id":"507","no":"1489218313142507_507_7"}',
  out_trade_no: 'order_1489219191940798',
  total_fee: 1,
  spbill_create_ip: '192.168.0.100',
  trade_type: 'APP' 
}
wxPay.getAppRequestParams(order).then(data => {
  console.log(data);
}).catch(error => {
  console.log(re);
})