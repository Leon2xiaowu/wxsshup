const chalk = require('chalk')
const log = console.log;

const errorTips = function(doc) {
  log(chalk.bgRed('Error:'), doc)
}

const finishTips = function (doc) {
  log(chalk.bgGreen('Success: '), doc)
}

const outFileTips = function(doc) {
  log(chalk.bgCyan('Output File Path: '))
  log('')
  log(doc)
}

exports.cer = errorTips
exports.suc = finishTips
exports.out = outFileTips
