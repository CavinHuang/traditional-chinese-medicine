const multer = require('koa-multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: path.resolve('static/medicine-image/query'),
  filename: (ctx, file, cb) => {
    let num = file.originalname.lastIndexOf('.');
    let suffix = file.originalname.substring(num);
    cb(null, Date.now() + suffix);//写入自己的服务器文件夹
  }
});
const fileFilter = (ctx, file, cb) => {
  //过滤上传的后缀为txt的文件
  const num = file.originalname.lastIndexOf('.');
  const suffix = file.originalname.substring(num);
  if (!suffix in ['.jpg', '.png', '.jpeg', '.gif']) {
    cb(null, false);
  } else {
    cb(null, true);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
  upload
}