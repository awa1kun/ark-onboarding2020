import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/router.js'
const app = new Koa();
import cors from '@koa/cors';
app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

const port = 8080;
console.log(`# App listening on port ${port}`);
app.listen(port);