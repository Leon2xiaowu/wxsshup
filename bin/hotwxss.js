#! /usr/bin/env node
// -*- js -*-

"use strict";

const path = require("path");
const program = require("commander")

const {run} = require('../src/opera')
const {cer}  =require('../tools/log')
const {openSocket} = require('../backend/socket')
const {getDescriptorPath, isDirectory, getFileName} = require('../tools/helper')

const resolve = (p) => path.resolve(process.cwd(), p)

program
  .option('-o, --output <file>', 'Output file (default STDOUT).')
  .option('-s, --style <string>', 'Hotupdate Object var (default cloudStyle)')
  .option('-c, --cover', 'Cover input file (The same as -o [input file path]; -o first)')
  .option('-p, --port <number>', 'WebSocket serve listener port (default 3000)')
  .option('-w, --websocket', 'Automatically start WebSocket serve')

program.usage('<input path> [options]')

program.parse(process.argv);

const firstArgv = process.argv[2]

if (!firstArgv) {
  program.outputHelp()
  return
}

const inputFile = resolve(firstArgv)

const coverOutput = isDirectory(inputFile)
  ? inputFile
  : getDescriptorPath(inputFile)

const defaultOutput = isDirectory(inputFile)
  ? path.join(resolve(`./STDOUT`), getFileName(inputFile))
  : resolve(`./STDOUT`)

const outputFile = program.cover
  ? coverOutput
  : program.output
    ? program.output
    : defaultOutput

async function main() {
  try {
    await run({
      input: inputFile,
      output: outputFile,
      styleVar: program.style,
    })

    program.websocket && openSocket({
      port: program.port
    })
  } catch (error) {
    cer(error)
  }
}

main()
