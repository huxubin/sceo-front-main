let path = require('path')
let _ = require('lodash')
let projectConfig = require('./config/project-config')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}
const alias = {}
for (let project of projectConfig) {
  if (project.name) {
    alias[`@${_.camelCase(project.name)}`] = resolve(`projects${path.sep}${project.name}`)
  }
}

module.exports = {
  lintOnSave: 'error',
  devServer: {
    progress: false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@p': resolve('projects'),
        ...alias
      }
    }
  }
}
