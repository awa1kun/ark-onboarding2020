import Router from 'koa-router';
import Rps from '../models/rps.js'
const router = new Router();
router.get('/',(ctx)=>{
    ctx.body = `RPS (Rock Paper Scissors) API ! \nversion: 1.0.0`;
});

router.get('/rpsList',async(ctx)=>{
    try{
        let result = await Rps.findAll();
        return result;
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

router.get('/rps',async(ctx)=>{
    try{

    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

router.post('/rps',async(ctx)=>{
    try{

    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

router.delete('/rps',async(ctx)=>{
    try{

    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

router.post('/hand',async(ctx)=>{
    try{

    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

router.post('/initiate',async(ctx)=>{
    try{

    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
})

export default router;