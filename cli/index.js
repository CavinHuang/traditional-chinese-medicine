const path = require('path')
const mammoth = require("mammoth")
const fs = require('fs')
const { Sitdown } = require('sitdown')
const { slugify } = require('transliteration')
const Bagpipe = require('bagpipe')

const bagpipe = new Bagpipe(10, {
  timeout: 6000
})
const originPath = path.resolve(__dirname, './中药100味')
const dataPath = path.resolve(__dirname, './data')
const imagePath = path.resolve(__dirname, './images')

let sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
});

const docsIndex = {}

const convertImage = (_filePath) => {
  return mammoth.images.imgElement(function(image) {
    return image.read("base64").then(function(imageBuffer) {
        const path = savebase64(imageBuffer, _filePath)
        return {
            src: path
        };
    });
})
}


function replaceHtml(str){
    return str.replace(/<\/?.+?\/?>/g,'');
}
/**
 *
  `articleID` int NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `typeID` int DEFAULT NULL COMMENT '文章类型和用户选择的类型关联',
  `title` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '标题',
  `author` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '作者',
  `shareCode` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '分享图片',
  `listPic` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '文章图片',
  `excerpt` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '摘录/引用',
  `read_counts` int DEFAULT '0' COMMENT '阅读计数',
  `articleTime` datetime DEFAULT NULL COMMENT '文章插入时间',
  `mdcontent` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT 'md文章',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '文章内容',
  `isShow` int DEFAULT '0' COMMENT '文章是否显示(0不显示,1实现)',
  `telnum` char(13) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户id/手机号码',
 *
 * @param {*} docxPath 
 * @param {*} file 
 * @param {*} index 
 */
function parseDocx(docxPath, file, index) {
  const _filePath = slugify(file.replace('.docx', '').replace(/\d+\./, ''))
  docsIndex[_filePath] = 1
  let sql = ''

  mammoth.convertToHtml({path: docxPath}, { convertImage: convertImage(_filePath) })
    .then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        const md = sitdown.HTMLToMD(html)
        const text = replaceHtml(html)
        sql = `INSERT INTO \`articles\` (articleID, typeID, title, author, shareCode, listPic, excerpt, read_counts, articleTime, mdcontent, content, isShow, telnum) VALUES (${index}, 1, '${file}', 'velious', '/medicine-image/${_filePath}/1.png', '/medicine-image/${_filePath}/1.png', \`${text.substring(0, 200)}\`, 0, '2022-07-22 18:00:00', \`${md}\`, \`${html}\`, 1, '');
`
        fs.writeFileSync(path.join(dataPath, `${_filePath}.html`), html)
        fs.writeFileSync(path.join(dataPath, `${_filePath}.md`), md)
        fs.appendFileSync('./sql.sql', sql)
    })
    .done();
}

function savebase64(base64, _filePath) {
  try {
    base64 = base64.replace(/^data:image\/\w+;base64,/, "");
    const index = docsIndex[_filePath]
    const _imagePath = `${_filePath}/${index}.png`;
    checkDir(path.join(imagePath, _filePath))
    fs.writeFileSync(path.join(imagePath, _imagePath), base64, 'base64');
    console.log('写入图片成功')
    docsIndex[_filePath] = index + 1
    return `/medicine-image/${_imagePath}`
  } catch (e) {
    console.log(e)
    return ''
  }
}

function checkDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

// 获取全部文章
const docxs = fs.readdirSync(originPath)

docxs.forEach((docx, index) => {
  const fullPath = path.join(originPath, docx)
  // bagpipe.push(parseDocx, fullPath, docx)
  parseDocx(fullPath, docx, index)
})
// parseDocx(path.join(originPath, '1.藕节.docx'), '1.藕节.docx')