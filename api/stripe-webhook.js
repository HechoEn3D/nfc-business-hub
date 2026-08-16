import crypto from 'node:crypto';

function verifyStripeSignature(rawBody, signature, secret){
  if(!signature||!secret)return false;
  const parts=Object.fromEntries(signature.split(',').map(x=>x.split('=')));
  const timestamp=parts.t;
  const v1=parts.v1;
  if(!timestamp||!v1)return false;
  const signed=`${timestamp}.${rawBody}`;
  const expected=crypto.createHmac('sha256',secret).update(signed).digest('hex');
  const age=Math.abs(Date.now()/1000-Number(timestamp));
  if(age>300)return false;
  return crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(v1));
}

export const config={api:{bodyParser:false}};

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end();
  const chunks=[];for await(const chunk of req)chunks.push(chunk);const raw=Buffer.concat(chunks).toString('utf8');
  if(!verifyStripeSignature(raw,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET))return res.status(400).json({error:'Invalid signature'});
  const event=JSON.parse(raw);
  const supabaseUrl=process.env.SUPABASE_URL;const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!supabaseUrl||!serviceKey)return res.status(500).json({error:'Missing Supabase server credentials'});
  const headers={apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json',Prefer:'return=minimal'};
  const update=async(id,data)=>fetch(`${supabaseUrl}/rest/v1/businesses?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers,body:JSON.stringify(data)});
  const obj=event.data?.object;
  try{
    if(event.type==='checkout.session.completed'){
      const id=obj?.metadata?.business_id;const plan=obj?.metadata?.plan;
      if(id)await update(id,{plan:plan||'basic',subscription_status:'active',stripe_customer_id:obj.customer||null,stripe_subscription_id:obj.subscription||null});
    }else if(event.type==='customer.subscription.updated'||event.type==='customer.subscription.created'){
      const sub=obj;const id=sub?.metadata?.business_id;
      if(id)await update(id,{plan:sub?.metadata?.plan||undefined,subscription_status:sub.status||'inactive',stripe_customer_id:sub.customer||null,stripe_subscription_id:sub.id||null});
      else if(sub?.id){await fetch(`${supabaseUrl}/rest/v1/businesses?stripe_subscription_id=eq.${encodeURIComponent(sub.id)}`,{method:'PATCH',headers,body:JSON.stringify({subscription_status:sub.status||'inactive'})})}
    }else if(event.type==='customer.subscription.deleted'){
      if(obj?.id)await fetch(`${supabaseUrl}/rest/v1/businesses?stripe_subscription_id=eq.${encodeURIComponent(obj.id)}`,{method:'PATCH',headers,body:JSON.stringify({subscription_status:'canceled'})});
    }else if(event.type==='invoice.payment_failed'){
      const customer=obj?.customer;if(customer)await fetch(`${supabaseUrl}/rest/v1/businesses?stripe_customer_id=eq.${encodeURIComponent(customer)}`,{method:'PATCH',headers,body:JSON.stringify({subscription_status:'past_due'})});
    }
    return res.status(200).json({received:true});
  }catch(e){return res.status(500).json({error:e.message||'Webhook error'})}
}
