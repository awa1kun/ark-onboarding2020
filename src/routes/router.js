import Router from 'koa-router';

// models 
import Rps from '../models/rps.js'
import User from '../models/user.js'
Rps.hasMany(User,{ foreignKey:'join_rps_id',sourceKey:'rps_id' })

import { hand2number,number2hand }from '../utils/common.js'
import sequelize from 'sequelize';

const router = new Router();
router.get('/',(ctx)=>{
    ctx.body = `RPS (Rock Paper Scissors) API ! \nversion: 1.0.0`;
});

// じゃんけん一覧取得
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
        ctx.body = await Promise.all(results.map(async(elem)=>{
            // status
            let status = "unknown";
            if(elem.status==0){
                status = "open";
            }
            else if(elem.status==1){
                status = "progress";
            }
            else if(elem.status==2){
                status = "close";
            }
            // count a count
            const users = await User.findOne({
                where: { join_rps_id: elem.rps_id },
                attributes:[[sequelize.literal('count(*)'),'count']],
                raw: true
            })

            return{
                rpsId: elem.rps_id,
                title: elem.title,
                hostName: elem.user_name,
                status: status,
                count: users.count
            }
        }));
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

// じゃんけん情報取得
router.get('/rps',async(ctx)=>{
    try{
        const params = ctx.request.query;
        if( !params.id ){
            throw new Error('invalid paramaters.');
        }
        ctx.body = await getRps(params.id);
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

// じゃんけん作成
router.post('/rps',async(ctx)=>{
    try{
        const body = ctx.request.body
        if(!body.hostName || !body.title || !body.hand){
            throw new Error('invalid paramaters.');
        }
        // ホストユーザー作成
        let host = new User({ user_name: body.hostName, current_hand: hand2number(body.hand), current_round:1 })
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

// じゃんけん削除
router.delete('/rps',async(ctx)=>{
    try{
        const body = ctx.request.body
        const params = ctx.request.query
        if(!body.userId || !params.id ){
            throw new Error('invalid paramaters.');
        }
        await deleteRps(params.id,body.userId);
        ctx.body = { result:true }
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

// じゃんけん参加
router.post('/hand',async(ctx)=>{
    try{
        const body = ctx.request.body
        const params = ctx.request.query
        if( !params.id || !body.hand ){
            throw new Error('invalid paramaters.');
        }
        let rps = await Rps.findOne({ where:{ rps_id:params.id } });
        if(!rps){
            throw new Error('the specified id not exists.');
        }
        if( rps.status == 2 ){
            throw new Error('the specified rps had been already closed.')
        }
        
        let user = null;
        if( rps.status == 0 && rps.round == 1){
            // 新規参加
            if( !body.userName ){
                throw new Error('invalid paramaters.');
            }
            user = new User({
                user_name: body.userName,
                join_rps_id: rps.rps_id
            })
        }
        else if(rps.status == 1){
            // 参加継続
            if( !body.userId ){
                throw new Error('invalid paramaters.');
            }
            user = await User.findOne({ where:{ user_id: body.userId } })
            if( !user || user.join_rps_id != rps.rps_id || !user.available ){
                throw new Error("you couldn't join specified rps.");
            }
        }
        else {
            throw new Error('unknown error.');
        }
        user.current_hand = hand2number(body.hand);
        user.current_round =  rps.round;
        await user.save();
        ctx.body = { userId: user.user_id };

        if(rps.status == 1){
            let users = await User.findAll({ where:{ join_rps_id:params.id } });
            let ready = true;
            for(let user of users){
                if(user.current_round != rps.round){
                    ready = false;
                    break;
                }
            }

            if(ready){
                determineRps(params.id);
            }
        }
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
});

// じゃんけん開始
router.post('/initiate',async(ctx)=>{
    try{
        const body = ctx.request.body;
        const params = ctx.request.query;
        if(!body.userId || !params.id ){
            throw new Error('invalid paramaters.');
        }
        let rps = await Rps.findOne({ where: { rps_id: params.id } });
        if( !rps || rps.host_user_id != body.userId ){
            throw new Error('the specified id not exists or invalid userId.');
        }
        if ( rps.status != 0 ){
            throw new Error('specified rps had been started or closed.')
        }
        await determineRps(params.id);
        ctx.body = await getRps(params.id);
    }
    catch(e){
        ctx.status = e.status || 500;
        ctx.body = e.message;
    }
})

const deleteRps = async(rpsId,hostId)=>{
    
    let targetRps = await Rps.findOne({where:{ rps_id:rpsId }});
    if(!targetRps){
        throw new Error('the specified id not exists.')
    }
    if(targetRps.host_user_id != hostId){
        throw new Error('userId is wrong')
    }
    await targetRps.destroy();
    await User.destroy({ where:{ join_rps_id:rpsId } })
}
const getRps = async(rpsId)=>{
    let results = await Rps.findAll({
        where:{
            rps_id:rpsId
        },
        include:[
            { model:User, attributes:[] }
        ],
        attributes:[
            'round',
            'status',
            'users.user_name',
            'users.prev_hand',
            'users.current_round',
            'users.available'
        ],
        raw:true
    });
    if(!results || results == []){
        throw new Error('the specified id not exists.');
    }
    let winners = [];
    let losers = [];
    results.forEach(elem=>{
        const info = { userName: elem.user_name,lastHand: elem.prev_hand != null ? number2hand(elem.prev_hand) : ""  , round: elem.current_round };
        if(elem.available){
            winners.push(info);
        }
        else{
            losers.push(info);
        }
    })
    return {
        round: results[0].round,
        finished: results[0].status == 2,
        winners: winners,
        losers: losers
    }
}

const determineRps = async(id)=>{
    let rps = await Rps.findOne({ where: { rps_id: id } });
    let users = await User.findAll({ where: { join_rps_id: id } });
    if(users.length <= 1 ){
        throw new Error('need two or more participant.')
    }
    // ユーザー更新
    if(users.length == 2){
        // ２人の場合簡単
        let userA = users[0];
        let userB = users[1];
        userA.available = (userA.current_hand - userB.current_hand) % 3 == 1 ? false : true;
        userB.available = (userB.current_hand - userA.current_hand) % 3 == 1 ? false : true;
    }
    else{
        // ３人以上の場合
        // 手をバイナリ演算用の数値に変換
        let handsBinarrys = users.map(user=>{
            if(user.current_hand == 0){
                return 9
            }
            else if(user.current_hand == 1){
                return 2
            }
            else{
                return 4
            }
        });
        const union = handsBinarrys.reduce((a,b)=>{ return a | b });
        let discriminant = (union >>> 1) & union
        if(discriminant == 7 || discriminant == 0){
            // あいこ
            users.forEach((user)=>{user.available = true});
        }
        else{
            discriminant = discriminant == 1 ? 9 : discriminant;
            for(let i=0; i < handsBinarrys.length ; i++){
                if(handsBinarrys[i] == discriminant){
                    users[i].available = true;
                }
                else{
                    users[i].available = false;
                }
            }
        }
    }
    let countWinner = 0;
    users.forEach(user=>{
        user.prev_hand = user.current_hand;
        user.save();
        if(user.available){
            countWinner++;
        }
    })
    // じゃんけん更新
    if(countWinner == 1){
        rps.status = 2;
        // 終了したじゃんけんは５分後に削除
        setTimeout(()=>{
            deleteRps(id,body.userId);
        },1000*60*5);
    }
    else{
        rps.status = 1;
    }
    rps.round++;
    await rps.save();
}

export default router;