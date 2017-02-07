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
alipay.getQrCode({
    biz_content: JSON.stringify({
        body:  "支付测试",
        subject: "支付测试",
        out_trade_no: "2016888885677",
        total_amount: 1.0
    })
}).then(function(re){
      console.log(re.qr_code)
    }).catch(function(err){
    });
// console.log(re)
