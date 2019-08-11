#! /usr/bin/env node
// -*- js -*-

"use strict";

const path = require("path");
const program = require("commander")

const {run} = require('../src/opera')
const {cer}  =require('../tools/log')

const log = console.log;

const resolve = (p) => path.resolve(__dirname, '../', p)

program
  .option('-o, --output <file>', 'Output file (default STDOUT).')
  .option('-s, --style <string>', 'Hotupdate Object var (default cloudStyle)')
  .option('-c, --cover', 'Cover input file (The same as -o [input file path]; -o first)')

program.usage('[input .wxml files] [options]')

program.parse(process.argv);

const firstArgv = process.argv[2]
const hasWxml = /.wxml$/.test(firstArgv||'')

if (!hasWxml) {
  program.outputHelp()
  log('')
  cer('input file must be .wxml')
  return
}

const inputFile = resolve(firstArgv)
const fileName = firstArgv.replace(/^.*[\\\/]/, '')
// ${fileName}
const defaultOpt = program.cover ? inputFile : resolve(`./STDOUT/${fileName}`)
const outputFile = program.output || defaultOpt

run({
  input: inputFile,
  output: outputFile,
  styleVar: program.style
})
