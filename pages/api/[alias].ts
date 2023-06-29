import type { NextApiRequest,NextApiResponse } from "next";
import { prisma} from '@/libs/prisma'
import { METHODS } from "http";

export default async function handler(
    req:NextApiRequest, 
    res:NextApiResponse
){
    const {method} = req
    if(method !=="GET"){
        return res.status(400).json({
            message:"Only GET request are allowed!"
        })

    }

    const {code} = req.query;
    if(typeof code =='string'){
        const result = await prisma.$transaction(async (tx)=>{
            //user makes a get req on thier shortURL if there code is a invalid or not found 

            const url = await tx.url.findUnique({
                where:{
                    alias:code
                }
            });

            if(!url) return null;

              // Update the url analytic

            await tx.urlAnalytic.update({
                where:{
                    url_id:url.id
                },
                data:{
                    clicked:{
                        increment:1
                    }
                }
            })

        return url;
        });

        if(!result){
            return res.status(400).json({
                statusCode: 400,
                error: {
                  message: "Invalid short url code!",
                },
                data: null,
              });
        }
        return res.redirect(result.originalUrl);
    }
}