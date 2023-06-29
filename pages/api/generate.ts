import type { NextApiRequest,NextApiResponse } from "next";
import {isWebUri} from 'valid-url';
import { prisma ,shortAlias } from '@/libs/index';
import { text } from "stream/consumers";

type RequestData= {
    url:string
}

export default async function handler(req:NextApiRequest, res: NextApiResponse){
    const { method } = req
    if(method !=="POST"){
        return res.status(400).json({
            message:"Only post request are allowed"
        })
    }

    const{url}:RequestData =req.body;
    const host = req.headers.host;
    const {alias,shortUrl} = shortAlias(host!)

    // Checking if original URL is Valid or not
    if(!isWebUri(url)){
        return res.status(400).json({
            statusCode: 400,
            error:{
                message:"Invalid URL"
            },
            data:null
        })
    }

    //
    const result =await prisma.$transaction(async(tx) =>{

        // This is the query if there is any existing original URL 
        const originalUrl = await tx.url.findFirst({
            where:{
                originalUrl : url
            }
        })
        if(originalUrl) return originalUrl;

        //if there isn't we will create a new url

        const newUrl = await tx.url.create({
            data:{
                originalUrl : url,
                shortUrl,
                alias: alias,
            }
        })
        await tx.urlAnalytic.create({
        data:{
            clicked:0,
            url:{
                connect:{
                    id:newUrl.id
                }
            },
        },
        });
        return newUrl
    })  
    return res.status(200).json({
        statusCode: 200,
        error: null,
        data: {
          originalUrl: result.originalUrl,
          shortUrl: result.shortUrl,
          alias: result.alias,
        },
    })
    

   

    

}