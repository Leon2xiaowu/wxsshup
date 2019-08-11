const chalk = require('chalk')
const log = console.log;

const errorTips = function(doc) {
  log(chalk.bgRed('Error:'), doc)
}

const finishTips = function (doc) {
  log(chalk.green('Success: '), doc)
}

const outFileTips = function(doc) {
  log(chalk.cyan('Output File Path: '))
  log('')
  log(doc)
}

exports.cer = errorTips
exports.suc = finishTips
exports.out = outFileTips
