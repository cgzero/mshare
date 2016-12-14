# mshare - 移动web分享组件

适用于移动端的分享组件，为分享提供了核心接口。
支持分享到：微博、微信朋友、朋友圈、QQ空间、QQ好友。
支持平台：QQ浏览器、UC浏览器、手机百度，同时提供了Web原生的分享方式。

## 下载最新版（v0.1.0）

- 开发版本（保留注释）：[点击下载](https://raw.githubusercontent.com/cgzero/mshare/0.2.0/src/mshare.js)
- 生产版本（压缩后）：[点击下载](https://raw.githubusercontent.com/cgzero/mshare/0.2.0/asset/mshare.min.js)

## 使用方式

Step.1 页面中嵌入js文件（同时支持AMD方式）

```html
<script src="mshare.js"></script>
```

Step.2 初始化配置

```javascript
var myShare = mshare.init({
    // 分享标题（默认使用document.title）
    title: '这是一条分享内容',
    // 分享url（默认使用当前页url）
    url: 'http://baidu.com',
    // 分享图片
    pic: 'https://ts.bdimg.com/womc/photo/mem_banner/focus.png',
    // 分享方式
    // app: 使用唤起APP的方式分享（默认）
    // web: 使用web的方式分享
    method: 'app'
});
```

Step.3 分享到相应的社交媒体（可以根据不同的社交媒体，修改相应的配置）

```javascript
// 分享到微博
myShare.shareTo('weibo');
// 分享到微信
myShare.shareTo('weixin');
// 分享到朋友圈
myShare.shareTo('weixinfriend');
// 分享到qq空间
myShare.shareTo('qzone');
// 分享到QQ
myShare.shareTo('qq');
// 弹出浏览器自带的分享浮层
myShare.shareTo('all');
```

其他接口

```javascript
// 是否为QQ浏览器
myShare.isqqbrowser;
// 是否为UC浏览器
myShare.isucbrowser;
// 是否为手机百度
myShare.isbaidubox;
```


## FAQ

https://github.com/cgzero/mshare/wiki/FAQ

## 实机测试报告

https://github.com/cgzero/mshare/wiki/实机测试报告

