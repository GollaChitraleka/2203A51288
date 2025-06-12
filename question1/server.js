const express=require('express');
const axios=require('./node_modules/axios/index.d.cts');
const app=express();
const PORT=9876;
const WINDOW_SIZE=10;
let window=[]

const URL={
    p:'http://20.244.56.144/evaluation-service/primes',
    f:'http://20.244.56.144/evaluation-service/fibo',
    e:'http://20.244.56.144/evaluation-service/even',
    r:'http://20.244.56.144/evaluation-service/rand'
}
app.use(express.json());
app.post('/numbers/:numberid',async(req,res)=>{
    const nmbrId=req.params.numberid;
    const apiUrl=URL[nmbrId];
    if(!apiUrl){
        return res.status(400).json({error:"Invalid URL"});
    }
    let prvsWndw=[...window];
    let nwNmbr=[];
    try{
        const response = await axios.get(apiUrl, {
            timeout: 3000,
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ5NzA5OTY3LCJpYXQiOjE3NDk3MDk2NjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkyNjhiOTQxLWMxMDEtNDJkMS1hOGQ4LTNkYTNlYTc0NGFkMyIsInN1YiI6IjIyMDNhNTEyODhAc3J1LmVkdS5pbiJ9LCJlbWFpbCI6IjIyMDNhNTEyODhAc3J1LmVkdS5pbiIsIm5hbWUiOiJnb2xsYSBjaGl0cmFsZWthIiwicm9sbE5vIjoiMjIwM2E1MTI4OCIsImFjY2Vzc0NvZGUiOiJNVkd3RUYiLCJjbGllbnRJRCI6IjkyNjhiOTQxLWMxMDEtNDJkMS1hOGQ4LTNkYTNlYTc0NGFkMyIsImNsaWVudFNlY3JldCI6InZXalBjSHFRdGR6bmtSUFYifQ.6FoYw4T0Otl26CzLcXEp8SqncYaODSEbwQSfF9vtmYQ'
            }
});

        const nmbrs=response.data.numbers||[]
        for (let n of nmbrs){
            if(!window.includes(n)){
                window.push(n);
                nwNmbr.push(n);
                if (window.length>WINDOW_SIZE){
                    window.shift();
                }
            }
        }
        const a=window.length ? +(window.reduce((a,b)=>a+b,0)/window.length).toFixed(2):0;
        res.json({
            windowPrevState:prvsWndw,
            windowCurrState:window,
            numbers:nwNmbr,
            avg:a
        });
    }
    catch(error){
        return res.status(504).json({error:'API request timeout'});
        
    }
});
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});