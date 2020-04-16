import Router from 'koa-router';
const router = new Router();
router.get('/',(ctx)=>{
    ctx.body = `RPS (Rock Paper Scissors) API ! \nversion: 1.0.0`;
});

export default router;