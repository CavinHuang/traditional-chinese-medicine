const query = require('../../api/index.js')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const { createdTime, formatDateFn } = require('../../utils/time.js')

async function addBatch (ctx, next) {
  try {
    let result = null
    var token = ctx.request.header.token
    if (token === '' || token === null)
      return (ctx.body = { code: 4001, message: 'token错误' })
    await isOwnEmpty(token).then(res => (result = res))
    if (result.flag) {
      return (ctx.body = { code: -1, message: 'token过期!' })
    }

    // 保存数据
    const { batch_no, images } = ctx.request.body
    await query(
      `INSERT INTO batchQuery (batch_no,images,create_at) VALUES ('${batch_no}','${JSON.stringify(images)}','${
        createdTime().timeTwo
      }')`,
      []
    ).then(res => {
      ctx.body = { code: 200, message: 'ok' }
    })
    .catch(err => {
      ctx.body = { code: 4000, message: err }
    })
  } catch (e) {
    return (ctx.body = { code: 500, message: e.message })
  }
}

async function selectBatch(ctx, next) {
  const { batchNo } = ctx.request.body
  const sql = `SELECT id,batch_no,images,create_at FROM batchQuery WHERE batch_no='${batchNo}' AND status = 1`
  await query(sql, []).then(res => {
    const result = res[0]
    result.images = JSON.parse(result.images)
    result.create_at = formatDateFn(result.create_at)
    ctx.body = { code: 200, message: 'ok', data: result }
  })
  .catch(err => {
    ctx.body = { code: 4000, message: err }
  })
}

module.exports = { addBatch, selectBatch }
