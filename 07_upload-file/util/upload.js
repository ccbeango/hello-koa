const inspect = require('util').inspect;
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

/**
 * 同步递归创建目录
 * @param {string} dirname 目录的绝对路径 
 * @returns {boolean} 创建目录结果
 */
function mkdirSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取上传文件的后缀
 * @param {string} filename 获取上传文件的后缀名
 * @returns {string} 文件后缀名
 */
function getSuffixName(filename) {
  let nameList = filename.split('.')
  return nameList[nameList.length - 1];
}

function uploadFile (ctx, options) {
  const req = ctx.req;
  const res = ctx.res;
  const busboy = new Busboy({
    headers: req.headers 
  });

  // 获取类型
  const fileType = options.fileType || 'common';
  const filePath = path.join(options.path, fileType);
  const mkdirResult = mkdirSync(filePath);

  return new Promise((resolve, reject) => {
    console.log('文件上传中...');
    const result = {
      success: false,
      formData: {}
    };

    // 解析请求文件事件
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      const fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
      const _uploadFilePath = path.join(filePath, fileName);
      const saveTo = path.join(_uploadFilePath);

      // 文件保存到定制路径
      file.pipe(fs.createWriteStream(saveTo));

      // 解析文件流
      file.on('data', function(data) {
        console.log(`File [${fieldname}] got ${data.length} bytes`);
      });

      file.on('end', function () {
        result.success = true;
        result.message = '文件上传成功';
        result.data = {
          pictureUrl: `//${ctx.host}/image/${fileType}/${fileName}`
        }
        console.log('文件上传成功');
        resolve(result);
      }); 
    });

    // 解析表单中其他字段信息
    busboy.on('field', function (fieldname, val, filenameTruncated, valTruncated, encoding, mimetype) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      result.formData[fieldname] = inspect(val);
    });

    busboy.on('finish', function () {
      console.log('文件上结束');
      resolve(result);
    });

    busboy.on('error', function(err) {
      console.log('文件上出错');
      reject(result);
    });

    req.pipe(busboy);
  });
}

module.exports = {
  uploadFile
}
