const fs = require('fs');

/**
 * 遍历目录下的文件
 * @param {sting} path    需进行遍历的目录路径
 * @param {string} mime   遍历文件的后缀名
 * @returns {object}      遍历后的目录结果
 */
function walkFile(path, mime) {
  const files = fs.readdirSync(path);

  const fileList = {};
  for (let item of files) {
    let itemArr = item.split('\.');

    const itemMime = (itemArr.length > 1) ? itemArr[itemArr.length -1] : 'undefined';

    if (mime === itemMime) {
      fileList[item] = path + item
    }
  }

  return fileList;
}

/**
 * 获取sql目录下的文件目录数据
 * @return {object} 
 */
function getSqlMap () {
  let basePath = __dirname;
  basePath = basePath.replace(/\\/g, '\/');

  let pathArr = basePath.split('\/')
  pathArr = pathArr.splice( 0, pathArr.length - 1 )
  basePath = pathArr.join('/') + '/sql/'

  const fileList = walkFile( basePath, 'sql' )
  return fileList;
}

/**
 * 封装所有sql文件脚本内容
 * @returns {object} sql脚本内容map
 */
function getSqlContentMap () {
  const sqlContentMap = {};
  
  const sqlMap = getSqlMap();

  for (let key in sqlMap) {
    const content = fs.readFileSync(sqlMap[key], 'binary');
    sqlContentMap[key] = content;
  }

  return sqlContentMap;
}

module.exports = getSqlContentMap;
