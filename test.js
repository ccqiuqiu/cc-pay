/**
 * Created by cc on 2017/1/17.
 */
const AliPay = require('./index').AliPay

let config = {
  app_id: '2016073000127091',
  private_key: './privateKey.txt',
  public_key: './publicKey.txt',
  dev: true,
  notify_url: "http://localhost:8200"
}
let alipay = new AliPay(config)
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
alipay.getQrCode({
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
})