/**
 * @file 移动端分享组件
 * @author cgzero(cgzero@cgzero.com)
 * @date 2016-09-18
 */

/* globals ucweb, ucbrowser, browser */

(function (global, factory) {
    // 适配AMD
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        global.mshare = factory();
    }
})(this, function () {

    /**
     * 才用web分享的url合集
     *
     * @const
     * @type {Object}
     */
    var SHARE_URL = {
        // 分享qq空间url
        QZONE: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
        // 分享新浪微博url
        WEIBO: 'http://service.weibo.com/share/share.php'
    };

    /**
     * 浏览器标识
     *
     * @const
     * @type {string}
     */
    var UA = navigator.appVersion;

    // 是否为QQ浏览器
    var isqqBrowser = /MQQBrowser/.test(UA);

    // 是否为UC浏览器
    var isucBrowser = /UCBrowser/.test(UA);

    // 分享媒体在各个浏览器所对应的名字，依次为安卓UC浏览器，苹果UC浏览器，QQ浏览器
    var shareMediaMap = {
        weibo: ['SinaWeibo', 'kSinaWeibo', 11],
        weixin: ['WechatFriends', 'kWeixin', 1],
        weixinfriend: ['WechatTimeline', 'kWeixinFriend', 8],
        qq: ['QQ', 'kQQ', 4],
        qzone: ['QZone', 'kQZone', 3],
        all: ['', '']
    };

    /**
     * 对象属性拷贝
     *
     * @param {Object} target 目标对象
     * @param {...Object} source 源对象
     * @return {Object}
     */
    function extend(target) {
        var source;
        for (var i = 1; i < arguments.length; i++) {
            source = arguments[i];

            if (!source) {
                continue;
            }

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    /**
     * 分享组件
     *
     * @class
     * @constructor
     * @param {Object=} opts 分享组件配置参数
     * @param {string=} opts.method 分享方式
     *     app: 才用浏览器分享api方式分享，只有分享到微博和QQ空间支持（默认）
     *     web: 网页方式
     * @param {string=} opts.title 标题
     * @param {string=} opts.url 分享链接
     * @param {Array=} opts.pic 分享图片
     * @param {string=} opts.summary 分享摘要（QQ空间）
     * @param {string=} opts.desc 分享理由（QQ空间）
     * @param {string=} opts.weiboAppKey 微博appKey（微博）
     * @param {Function=} opts.onsuccess 成功回调
     * @param {Function=} opts.onfail 失败回调
     */
    function MShare(opts) {
        this.opts = {
            title: document.title,
            url: location.href,
            method: 'app'
        };

        extend(this.opts, opts);

        if (isqqBrowser) {
            var script = document.createElement('script');
            var doc = document.getElementsByTagName('body')[0];
            script.setAttribute('src', '//jsapi.qq.com/get?api=app.share');
            doc.appendChild(script);
        }
    }

    MShare.prototype = {
        constructor: MShare,

        /**
         * 分享到
         *
         * @param {string} shareMedia 需要分享到的应用
         *     weibo: 新浪微博
         *     weixin: 微信
         *     weixinfriend: 微信朋友
         *     qq: QQ
         *     all: 打开分享面板自由选择
         * @param {string=} opts 分享参数，与构造函数一致
         */
        shareTo: function (shareMedia, opts) {
            shareMedia = shareMedia || 'all';
            opts = extend({}, this.opts, opts);

            // web方式分享
            // 只有微博和QQ空间支持
            if (opts.method === 'web' && /weibo|qzone/.test(shareMedia)) {
                this.webShareTo(shareMedia, opts);
            }
            // UC浏览器
            else if (isucBrowser) {
                this.ucShareTo(shareMedia, opts);
            }
            // QQ浏览器
            else if (isqqBrowser) {
                this.qqShareTo(shareMedia, opts);
            }
        },

        /**
         * 使用UC浏览器分享
         * 注：分享时如果使用app分享则无法指定图片，UC会默认截取当页图片；采用web分享不受限制
         *
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与构造函数一致
         */
        ucShareTo: function (shareMedia, opts) {
            if (!isucBrowser) {
                return;
            }

            // Android
            if (typeof ucweb !== 'undefined') {
                ucweb.startRequest(
                    'shell.page_share',
                    [opts.title, opts.pic, opts.url, shareMediaMap[shareMedia][0], '', '', '']
                );
            }
            // ios
            else if (typeof ucbrowser !== 'undefined') {
                ucbrowser.web_share(opts.title, opts.pic, opts.url, shareMediaMap[shareMedia][1], '', '', '');
            }
        },

        /**
         * 使用QQ浏览器分享
         *
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与构造函数一致
         */
        qqShareTo: function (shareMedia, opts) {
            if (browser && browser.app) {
                browser.app.share({
                    url: opts.url,
                    title: opts.title,
                    description: opts.desc,
                    /* eslint-disable */
                    img_url: opts.pic,
                    // 微信好友:1, 腾讯微博:2, QQ空间:3, QQ好友:4, 生成二维码:7, 微信朋友圈:8, 复制网址:10, 分享到微博:11, 创意分享:13
                    to_app: shareMediaMap[shareMedia][2], 
                    cus_txt: '请输入此时此刻想要分享的内容'
                    /* eslint-enable */
                });
            }
        },

        /**
         * 使用web方式分享
         *
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与构造函数一致
         */
        webShareTo: function (shareMedia, opts) {
            var shareUrl;

            if (shareMedia === 'weibo') {
                shareUrl = ''
                    + SHARE_URL.WEIBO
                    + '?url=' + opts.url
                    + '&title=' + opts.title
                    + '&appkey=' + opts.weiboAppKey
                    + '&pic=' + opts.pic;
            }
            else if (shareMedia === 'qzone') {
                shareUrl = ''
                    + SHARE_URL.QZONE
                    + '?url=' + opts.url
                    + '&title=' + opts.title
                    + '&summary=' + opts.summary
                    + '&desc=' + opts.desc
                    + '&pics=' + opts.pic;
            }

            window.open(shareUrl, 'newwindow', 'width=650,height=500,top=0,left=0');
        }
    };

    function init(opts) {
        return new MShare(opts);
    }

    return {
        init: init,
        isqqBrowser: isqqBrowser,
        isucBrowser: isucBrowser
    };
});
