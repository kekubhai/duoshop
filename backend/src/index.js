import express from 'express';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import {CookieStorage, CivicAuth} from '@civic/auth/server'

const app =express()
app.use(cookieParser());
const prisma = new PrismaClient()

const civicConfig={
    clientId: process.env.CIVIC_CLIENT_ID,
    clientSecret: process.env.CIVIC_CLIENT_SECRET,
    redirectUri: process.env.CIVIC_REDIRECT_URI,
    postLogoutRedirectUri: process.env.CIVIC_POST_LOGOUT_REDIRECT_URI,
    storage: new CookieStorage({
        cookieName: 'civic_auth',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })
}
class ExpressCookieStorage extends CookieStorage {
constructor(req,res){
    super({secure:false})
    this.req=req;
    this.res=res;

}async get (key){
    return this.req.cookies[key]?? null;
}
async  get(key,value){
    thhis.res.cookie(key,value,this.settings);

}
}

app.use((req,res,next)=>{
    req.storage=new ExpressCookieStorage(req.res);
    req.CivicAuth=new CivicAuth(req.storage,civicConfig);
    next();

})