let Git = require('simple-git/promise')
let gitConfig = require('../config/git-config.js')
let projects = require('../config/project-config.js')
let fs = require('fs')
let lodash = require('lodash')
let currentEnv = process.env.NODE_ENV || 'development'
let account = getParamEnvFile(`.env.${currentEnv}.local`, 'VUE_APP_GIT_ACCOUNT')
gitConfig.user = JSON.parse(account)[0]
gitConfig.password = JSON.parse(account)[1]
let activeProjects = []
for (let project of projects) {
  let branch = getParamEnvFile(`.env.${currentEnv}.local`, `VUE_APP_PROJECT_${lodash.upperCase(project.name)}`)
  if (branch) {
    project.branch = branch
    activeProjects.push(project)
  }
}
console.log('更新项目......')
// 当前存在的项目
const projectPath = './projects'
const existProjects = []
if (fs.existsSync(projectPath)) {
  let files = fs.readdirSync(projectPath)
  files.forEach(function (file, index) {
    existProjects.push(file)
  })
}

// 配置中的项目
const configProjects = activeProjects
// 不用初始化的项目
let initedProject = []
for (let i = 0; i < existProjects.length; i++) {
  for (let j = 0; j < configProjects.length; j++) {
    if (configProjects[j].name === existProjects[i]) {
      initedProject.push(configProjects[j])
      existProjects.splice(i--, 1)
      configProjects.splice(j--, 1)
      break
    }
  }
}
// 删除不在配置中的项目
for (let file of existProjects) {
  removeDir(`./projects/${file}`)
}

// 生成新的router和stroe整合JS文件
initedProject = initedProject.concat(configProjects)
let routerJs = ''
let storeJs = ''
for (let project of initedProject) {
  routerJs += `export {default as ${lodash.camelCase(project.name)}} from '@p/${project.name}/router'\n`
  storeJs += `export {default as ${lodash.camelCase(project.name)}} from '@p/${project.name}/store'\n`
}
console.log('开始克隆子项目...')
let promiseList = []
for (let project of configProjects) {
  if (project.name) {
    promiseList.push(new Promise((resolve, reject) => {
      const gitHost = `http://${gitConfig.user}:${gitConfig.password}@${gitConfig.host}/${gitConfig.group}/${project.gitName}.git`
      Git().clone(gitHost, `./projects/${project.name}`, ['-b', project.branch]).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    }))
  }
}

Promise.all(promiseList).then(() => {
  console.log('克隆子项目完毕')
  // 写入js到文件中
  fs.writeFileSync('src/router/project-router.js', routerJs)
  fs.writeFileSync('src/store/project-store.js', storeJs)
  console.log('写入路由和store文件完毕')
}).catch(err => {
  console.log(err)
})

// 如果存在就删除
function removeDir (path) {
  if (fs.existsSync(path)) {
    let files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        removeDir(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

function getParamEnvFile (file, param) {
  let gitConfigData = fs.readFileSync(file, 'utf-8')
  let dataArray = gitConfigData.split('\r\n')
  let data = ''
  for (let arr of dataArray) {
    if (arr.includes(param)) {
      data = arr.split('=')[1]
    }
  }
  return data
}
