import Router from 'koa-router';

// models 
import Rps from '../models/rps.js'
import User from '../models/user.js'

import { hand2number }from '../utils/common.js'

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
        const body = ctx.request.body
        if(!body.hostName || !body.title || !body.hand){
            throw new Error('invalid paramaters.');
        }
        // ホストユーザー作成
        let host = new User({ user_name: body.hostName, current_hand: hand2number(body.hand) })
        await host.save();
        const hostUserId = host.user_id;
        // じゃんけん作成
        let rps = new Rps({ title: body.title, host_user_id: hostUserId })
        await rps.save();
        const rpsId = rps.rps_id;
        // ホストユーザーにじゃんけんID割り当て
        host.join_rps_id = rpsId;
        await host.save();

        const response = {
            rpsId: rpsId,
            userId: hostUserId
        };
        ctx.body = response;
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

router.delete('/rps',async(ctx)=>{
    //[TODO] rpsIDはURLパラメータにしたい
    try{
        const body = ctx.request.body
        if(!body.rpsId || !body.userId ){
            throw new Error('invalid paramaters.');
        }
        let targetRps = await Rps.findOne({where:{ rps_id:body.rpsId }});
        if(!targetRps){
            throw new Error('the specified rpsId not exists.')
        }
        if(targetRps.host_user_id != body.userId){
            throw new Error('userId is wrong')
        }
        await targetRps.destroy();
        await User.destroy({ where:{ join_rps_id:body.rpsId } })
        ctx.body = { result:true }
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