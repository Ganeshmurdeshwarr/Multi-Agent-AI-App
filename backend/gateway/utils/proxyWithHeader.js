import proxy from "express-http-proxy"

export const proxyWithHeader=(serviceUrl)=>{
    
    return proxy(serviceUrl,{
        timeout: 60000,
        proxyReqOptDecorator:(proxyReqOpts , srcReq)=>{
            if(srcReq.user){
                proxyReqOpts.headers['X-user-id']=srcReq.user._id
            }
            return proxyReqOpts
        }
    })
}