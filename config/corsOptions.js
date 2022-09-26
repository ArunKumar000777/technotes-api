import { allowedOringins } from "./allowedOrigins.js";

export const corsOptions = {
    origin:(origin,callback)=>{
        if(allowedOringins.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('not allowed by CORS'))
        }
    },
    credentials:true,
    optionSuccessStatus:200
}
