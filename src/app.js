import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from 'routes'
const app = new Koa();
app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

const port = 80;
console.log(`# App listening on port ${port}`);
app.listen(port);