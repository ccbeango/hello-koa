const fs = require('fs');
const path = require('path')
const mimes = require('./mimes');
/**
 * 遍历读取目录内容（子目录，文件名）
 * @param {string} reqPath 请求资源的绝对路径
 * @returns {array} 目录内容列表
 */
function walk(reqPath) {
  const files = fs.readdirSync(reqPath);

  const dirList = [];
  const fileList = [];
  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    let itemArr = item.split('\.')
    let itemMine = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : 'undefined';

    if (typeof mimes[itemMine] === 'undefined') {
      dirList.push(files[i]);
    } else {
      fileList.push(files[i]);
    }
  }
  return [ ...dirList, ...fileList ];
}

/**
 * 读取文件方法
 * @param  {string} 文件本地的绝对路径
 * @return {string|binary} 
 */
function file(filePath) {
  const content = fs.readFileSync(filePath, 'binary');
  return content;
}

/**
 * 封装目录内容
 * @param  {string} url 当前请求的上下文中的url，即ctx.url
 * @param  {string} reqPath 请求静态资源的完整本地路径
 * @return {string} 返回目录内容，封装成HTML
 */
function dir(url, reqPath) {
  const contentList = walk(reqPath);

  let html = `<ul>`;
  for (let [index, item] of contentList.entries()) {
    html = `${html}<li><a href="${url === '/' ? '' : url}/${item}">/${item}</a></li>`
  }
  html = `${html}</ul>`;

  return html;
}

/**
 * 获取静态资源内容
 * @param  {object} ctx koa上下文
 * @param  {string} fullStaticPath 静态资源目录在本地的绝对路径
 * @return  {string} 请求获取到的本地内容
 */
async function content(ctx, fullStaticPath) {
  // 封装请求资源的完绝对径
  const reqPath = path.join(fullStaticPath, ctx.url);

  // 判断请求路径是否为存在目录或者文件
  const exist = fs.existsSync(reqPath);

 // 返回请求内容， 默认为空
  let content = '';

  if (!exist) {
    content = '404 Not Found!';
  } else {
    // 判断访问地址是文件夹还是文件
    const stat = fs.statSync(reqPath);

    if (stat.isDirectory()) {
      // 如果为目录，则渲染读取目录内容
      content = dir(ctx.url, reqPath);
    } else {
      content = await file(reqPath);
    }
  }

  return content;
}

module.exports = content;