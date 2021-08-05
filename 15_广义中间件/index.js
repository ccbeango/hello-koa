const Koa = require('koa');
const Router = require('./koa-router');
const app = new Koa();

const router = new Router();

router.get('/index', ctx => { ctx.body = 'index page' });
router.get('/post', ctx => { ctx.body = 'post page' });
router.get('/list', ctx => { ctx.body = 'list page' });
router.get('/item', ctx => { ctx.body = 'item page' });

app.use(router.routes());


app.use(async ctx => {
  ctx.body = '404';
});

app.listen(3001, () => {
  console.log('[demo] is starting at port 3001');
});
