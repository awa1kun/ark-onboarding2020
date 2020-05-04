import Router from 'koa-router';

// models 
import Rps from '../models/rps.js'
import User from '../models/user.js'
Rps.hasMany(User,{ foreignKey:'join_rps_id',sourceKey:'rps_id' })
//User.belongsTo(Rps,{ foreignKey:'join_rps_id', targetKey:'rps_id' })

import { hand2number }from '../utils/common.js'
import sequelize from 'sequelize';

const router = new Router();
router.get('/',(ctx)=>{
    ctx.body = `RPS (Rock Paper Scissors) API ! \nversion: 1.0.0`;
});

router.get('/rpsList',async(ctx)=>{
    try{
        let results = await Rps.findAll({
            where:{ host_user_id:sequelize.literal('`rpses`.`host_user_id` = `users`.`user_id`') },
            include:[ { model:User, attributes:[] } ],
            attributes:[
                'rps_id',
                'title',
                'host_user_id',
                'users.user_name',
                'status',
                'round'
            ],
            raw:true
        });
        ctx.body = results.map(elem=>{
            let status = "unknown";
            if(elem.status==0){
                status = "open";
            }
            else if(elem.status==1){
                status = "progress";
            }
            else if(elem.status==2){
                stauts = "close";
            }

            return{
                rpsId: elem.rps_id,
                title: elem.title,
                hostName: elem.user_name,
                status: status
            }
        });
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
    try{
        const body = ctx.request.body
        const params = ctx.request.query
        if(!body.userId || !params.id ){
            throw new Error('invalid paramaters.');
        }
        let targetRps = await Rps.findOne({where:{ rps_id:params.id }});
        if(!targetRps){
            throw new Error('the specified id not exists.')
        }
        if(targetRps.host_user_id != body.userId){
            throw new Error('userId is wrong')
        }
        await targetRps.destroy();
        await User.destroy({ where:{ join_rps_id:params.id } })
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