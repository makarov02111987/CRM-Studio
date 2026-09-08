export async function onRequestPost({request,env}) {
  const {password}=await request.json();

  if(!password || !env.ADMIN_PASSWORD) {
    return Response.json({error:"Unauthorized"},{status:401});
  }

  const a=new TextEncoder().encode(password);
  const b=new TextEncoder().encode(env.ADMIN_PASSWORD);

  if(a.length!==b.length) {
    return Response.json({error:"Unauthorized"},{status:401});
  }

  let x=0;
  for(let i=0;i<a.length;i++) x|=a[i]^b[i];

  if(x!==0) {
    return Response.json({error:"Unauthorized"},{status:401});
  }

  return Response.json({ok:true,token:password});
}
