import path from 'path'
import {convert, writeWxml} from './src/parser';
import {progress} from './src/index';

const resolve = (p) => path.resolve(__dirname, p)

const WXML_PATH = resolve('./wxapp/pages/index/index.wxml')
const WXML_BUILD = resolve('./build/index.wxml')

async function prase() {
  try {
    const ats = await convert(WXML_PATH)
    const result = await progress(ats)

    writeWxml(result, WXML_BUILD)

    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
}

prase()
