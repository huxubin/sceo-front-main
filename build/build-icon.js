let fontCarrier = require('font-carrier')
let fs = require('fs')
let path = require('path')
// 文件根路径
let root = `src${path.sep}assets${path.sep}icon-fonts`;
// 删除字体文件夹中的所有文件
(function deleteDir (dir) {
  let fontDirFiles = fs.readdirSync(dir)
  fontDirFiles.forEach(file => {
    const filePath = `${dir}${path.sep}${file}`
    const state = fs.statSync(filePath)
    if (state.isDirectory()) {
      deleteDir(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  })
  if (dir !== root) {
    fs.rmdirSync(dir)
  }
})(root)

// 读取icon文件夹中的文件
let cssFileContent =
`@font-face {font-family: 'sceofont';
  src: url('sceofont.eot'); /* IE9*/
  src: url('sceofont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('sceofont.woff') format('woff'), /* chrome、firefox */
  url('sceofont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('sceofont.svg#sceofont') format('svg'); /* iOS 4.1- */
  font-weight: normal;
  font-style: normal; 
}
[class^='rx-icon'], [class*='rx-icon']{
  font-family:'sceofont'!important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`
let initUnicode = 0xe90e
let iconList = []
let font = fontCarrier.create();
(function loadIcons (dir, list) {
  let iconFiles = fs.readdirSync(dir)
  iconFiles.forEach(file => {
    const filePath = `${dir}${path.sep}${file}`
    const state = fs.statSync(filePath)
    if (state.isDirectory()) {
      // 读取文件夹信息
      const typeName = file.substring(0, file.indexOf('-'))
      const type = file.substring(file.indexOf('-') + 1)
      const iconObj = {
        name: typeName,
        code: type,
        children: []
      }
      list.push(iconObj)
      loadIcons(filePath, iconObj.children)
    } else {
      const filenamePre = file.substring(0, file.lastIndexOf('.'))
      const iconName = filenamePre.substring(0, filenamePre.indexOf('-'))
      const icon = filenamePre.substring(filenamePre.indexOf('-') + 1)
      list.push({
        name: iconName,
        code: icon
      })
      const itemData = fs.readFileSync(filePath)
      const currentUnicode = `&#x${initUnicode.toString(16)};`
      font.setGlyph(currentUnicode, {
        glyphName: currentUnicode,
        horizAdvX: '1024', // 设置这个字形的画布大小为1024
        svg: itemData.toString()
      })
      // 追加CSS内容
      cssFileContent +=
`\n.rx-icon-${icon}:before {
  content: '\\${initUnicode.toString(16)}';\n}`
      initUnicode++
    }
  })
})('icon-font-svg', iconList)
font.setFontface({
  fontFamily: 'sceofont',
  ascent: 824,
  descent: 200
})
// 输出字体文件到文件夹下
font.output({
  path: `${root}${path.sep}sceofont`
})
console.log('写入字体文件!')
// 输出CSS到文件夹
fs.writeFile(`${root}${path.sep}icon.css`, cssFileContent, function () {
  console.log('写入CSS文件成功!')
})
// 输出icon列表到文件中
fs.writeFile(`${root}${path.sep}icon.json`, JSON.stringify(iconList, null, 2), function () {
  console.log('写入icon列表文件成功!')
})
