import type { NextApiRequest,NextApiResponse } from "next";
import { prisma } from '@/libs/index';

type RequestData= {
    url:String
}

export default function handler(req:NextApiRequest, res: NextApiResponse){
    const { method } = req
    if(method !=="POST"){
        return res.status(400).json({
            message:"Only post request are allowed"
        })
    }

    const{url}:RequestData =req.body;
}