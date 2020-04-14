import Router from 'koa-router';

const router = new Router();
router.get('/',(ctx)=>{
    const p = require('../../package.json');
    ctx.body = `RPS (Rock Paper Scissors) API ! \nversion: ${p.version}`;
});

export default router;