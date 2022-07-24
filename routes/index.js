const router = require('koa-router')()
const ctrl = require('../controller/web/index.js')
const login = require('../controller/web/login.js')
const articleDetail = require('../controller/web/articleDetail.js')
const getUserSignList = require('../controller/web/getUserSignList.js')
const sign = require('../controller/web/sign.js')
const authorization = require('../controller/web/authorization.js')
const collect = require('../controller/web/collect.js')
const like = require('../controller/web/like.js')
const articleType = require('../controller/web/articleType.js')
const articleTypeList = require('../controller/web/articleTypeList.js')
const myCollectList = require('../controller/web/myCollectList.js')
const getComment = require('../controller/web/getComment.js')
const insertComment = require('../controller/web/insertComment.js')
const maskVersion = require('../controller/web/maskVersion.js')
const batch = require('../controller/web/batch')
const { upload } = require('../utils/file')
const path = require('path')
const fs = require('fs')

router.get('/', async (ctx, next) => {
  'use strict'
  ctx.redirect('/index')
})
// 测试接口
router.get('/index', ctrl.testAPI)
// 登录接口
router.post('/wechat/api/login', login.login)
// 获取用户信息authorization授权
router.post('/wechat/api/authorization', authorization.authorization)
//签到接口
router.post('/wechat/api/sign', sign.sign)
// 获取天数 个人中心
router.post('/wechat/api/getUserSignList', getUserSignList.getUserSignList)
// 文章列表页
router.post(
  `/wechat/api/articleType/lists`,
  articleTypeList.selectArticleTypeList
)
// 文章详情页
router.get(
  `/wechat/api/articles/Detail/:articleID`,
  articleDetail.articleDetail
)
// 收藏文章
router.post(`/wechat/api/article/collect`, collect.collect)
// 点赞文章
router.post(`/wechat/api/article/like`, like.like)
// 文章获取分类列表
router.post(`/wechat/api/articleType`, articleType.selectArticleType)
//  我的收藏
router.post(`/wechat/api/my/collect/list`, myCollectList.myCollect)
// 获取用户评论
router.post(`/wechat/api/getComment`, getComment.getComment)
// 插入评论
router.post(`/wechat/api/insetComment`, insertComment.insertComment)
// 面具系统
router.post(`/wechat/api/mask/version`, maskVersion.maskVersion)

// 文件上传
router.post('/wechat/api/upload', upload.single('file'), async (ctx, next) => {
  try {
    let req = ctx.req
    // let { openid } = ctx.req.body//前端formdata附带的属性值
    let fileUrl = null
    if (req.file !== undefined) {
      fileUrl = "/medicine-image/query/" + req.file.filename;
    }
    ctx.body = {
      code: 200,
      message: 'ok',
      data: fileUrl,
    }
  } catch (error) {
    next(error)
  }
})
// 文件删除
router.post('/wechat/api/deleteFile', async (ctx, next) => {
  const { url } = ctx.request.body

  const filePath = path.join(path.resolve(__dirname, '../static'), url)

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
      ctx.body = {
        code: 200,
        message: '删除成功'
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '删除失败，请重试!'
      }
    }
  } else {
    ctx.body = {
      code: 404,
      message: '不存在的文件'
    }
  }
  next()
})

router.post('/wechat/api/batchAdd', batch.addBatch)
router.post('/wechat/api/selectBatch', batch.selectBatch)

module.exports = router
