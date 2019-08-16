#! /usr/bin/env node
// -*- js -*-

"use strict";

const path = require("path");
const program = require("commander")

const {run} = require('../src/opera')
const {cer}  =require('../tools/log')
const {openSocket} = require('../backend/socket')
const {getDescriptorPath} = require('../tools/helper')

const resolve = (p) => path.resolve(__dirname, '../', p)

program
  .option('-o, --output <file>', 'Output file (default STDOUT).')
  .option('-s, --style <string>', 'Hotupdate Object var (default cloudStyle)')
  .option('-c, --cover', 'Cover input file (The same as -o [input file path]; -o first)')
  .option('-p, --port <number>', 'WebSocket serve listener port (default 3000)')

program.usage('<input .wxml files> [options]')

program.parse(process.argv);

const firstArgv = process.argv[2]

const isFolderModal = program.folder

const inputFile = resolve(firstArgv)

const defaultOpt = program.cover ? getDescriptorPath(inputFile) : resolve(`./STDOUT`)
const outputFile = program.output || defaultOpt

async function main() {
  try {
    await run({
      input: inputFile,
      output: outputFile,
      styleVar: program.style,
      isFolderModal
    })

    openSocket({
      port: program.port
    })
  } catch (error) {
    cer(error)
  }
}

main()
