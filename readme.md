# es-parser

[![Author: Mr.Hope](https://img.shields.io/badge/作者-Mr.Hope-blue.svg?style=for-the-badge)](https://mrhope.site)
<!-- [![License](https://img.shields.io/npm/l/es-parser.svg?style=for-the-badge)](https://github.com/Mister-Hope/es-parser/blob/master/LICENSE) -->

一个 100KB 大小的 JS 解释器

## Import

### TypeScript

```ts
import * as esParser from 'es-parser';
```

### JavaScript

```js
const esParser = require('es-parser');
```

## Demo

```js
esParser.run("console.log('hello world')");

esParser.run(`
const progress = wx.downloadFile({
  url: 'https://www.baidu.com/img/bd_logo1.png',
  success: res => {
    wx.hideLoading();
    if (res.statusCode === 200) console.log(success, res.tempFilePath);
    else wx.showToast({ title: '下载失败' });
  });
  },
  fail: failMsg => {
    wx.hideLoading();
    wx.showToast({ title: '下载失败' });
  }
});

progress.onProgressUpdate(res => {
  wx.showLoading({ title: \`下载中\${Math.round(res.progress)}%\` });
});
`,{ wx });
```
