export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  try{
    const {business_id,plan}=req.body||{};
    const prices={basic:process.env.STRIPE_PRICE_BASIC,pro:process.env.STRIPE_PRICE_PRO,multi:process.env.STRIPE_PRICE_MULTI};
    const price=prices[plan];
    if(!business_id||!price)return res.status(400).json({error:'Faltan business_id o un precio Stripe configurado'});
    const body=new URLSearchParams({
      mode:'subscription',
      success_url:`${process.env.PUBLIC_SITE_URL||'https://nfc-business-hub.vercel.app'}/?checkout=success&plan=${encodeURIComponent(plan)}`,
      cancel_url:`${process.env.PUBLIC_SITE_URL||'https://nfc-business-hub.vercel.app'}/?checkout=cancel`,
      'line_items[0][price]':price,
      'line_items[0][quantity]':'1',
      'metadata[business_id]':String(business_id),
      'metadata[plan]':plan,
      'allow_promotion_codes':'true'
    });
    const r=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`,'Content-Type':'application/x-www-form-urlencoded'},body});
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data?.error?.message||'Stripe error'});
    return res.status(200).json({url:data.url,id:data.id});
  }catch(e){return res.status(500).json({error:e.message||'Checkout error'})}
}
