# Hotupdate WXSS
A tool for generating `.wxml`file  inline styles, improve the efficiency of adjusting the UI.

Like this

```html
<view class='deom-class'>data</view>
<!-- add inline style -->
<view class='deom-class' style='{{cloudStyle["deom-class"]}} '>data</view>
```

## Feature

- Automatically generate attribute `style` according to `class`, support `? :` `&& || ` and other expression.
- WebSocket serve to update UI

## Installation

```bash
 npm install -g wxsshup
```

## How to use

step 1.

Automatically generate styles

```bash
hotwxss <input path> [options]
```

output:

```bash
Success:  文件 [dome.wxml path]
Output File Path:

output file path
[WebSocket SERVER] ws://localhost:3003/updater
```

Then automatically open `wxsshup/backend/admin.html` in the browser

step 2.

`wxapp` end ready to work

add style update var

```js
Page({
  data: {
    cloudStyle:{}
  }
})
```

add SocketMessage function

```js
connectStyleService() {
    wx.connectSocket({
        url: 'ws://localhost:3003/listener',
        method:"GET"
    })
    wx.onSocketMessage(this.updateStyle.bind(this))
}

updateStyle(style) {
    if (!style) return
    try {
        const s = JSON.parse((style.data || {}))

        this.setData({
            cloudStyle:s
        })

    } catch (error) {
        console.error(error);
    }
}
```

step 3.

update style on admin.html, enjoy.

## Options

- `-o` **{String}** Output file path (default STDOUT), support folder directory.
- `-s` **{String}** Hotupdate Object var (default cloudStyle).
- `-c` **{Boolean}** Cover input file (The same as -o [input file path]; **-o first**).
- `-c` **{Number}** WebSocket serve listener port (default 3000).

