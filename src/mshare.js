/**
 * @file 移动端分享组件
 * @author cgzero(cgzero@cgzero.com)
 * @date 2016-10-11
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
    var isqqbrowser = /MQQBrowser/.test(UA);

    // 是否为UC浏览器
    var isucbrowser = /UCBrowser/.test(UA);

    // 是否为手机百度
    var isbaidubox = /baiduboxapp/.test(UA);

    // 分享媒体在各个浏览器所对应的名字，依次为安卓UC浏览器，苹果UC浏览器，QQ浏览器，手机百度
    var shareMediaMap = {
        weibo: ['SinaWeibo', 'kSinaWeibo', 11, 'sinaweibo'],
        weixin: ['WechatFriends', 'kWeixin', 1, 'weixin_friend'],
        weixinfriend: ['WechatTimeline', 'kWeixinFriend', 8, 'weixin_timeline'],
        qq: ['QQ', 'kQQ', 4, 'qqfriend'],
        qzone: ['QZone', 'kQZone', 3, 'qqdenglu'],
        all: ['', '', undefined, 'all']
    };

    /**
     * 对象属性拷贝
     *
     * @inner
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
     * 加载script
     *
     * @inner
     * @param {string} url 加载的js地址
     */
    function loadScript(url) {
        var script = document.createElement('script');
        var doc = document.getElementsByTagName('body')[0];
        script.setAttribute('src', url);
        doc.appendChild(script);
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
     * @param {string=} opts.title 分享内容
     * @param {string=} opts.url 分享链接
     * @param {Array=} opts.pic 分享图片
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

        // 如果是QQ浏览器，则先加载必要的资源
        if (isqqbrowser) {
            loadScript('//jsapi.qq.com/get?api=app.share');
        }
        // 如果是百度框，则先加载必要的资源
        if (isbaidubox) {
            loadScript('//s.bdstatic.com/common/openjs/aio.js?v=' + new Date().getTime());
        }
    }

    MShare.prototype = {
        constructor: MShare,

        /**
         * 分享到
         *
         * @public
         * @param {string} shareMedia 需要分享到的应用
         *     weibo: 新浪微博
         *     weixin: 微信
         *     weixinfriend: 微信朋友
         *     qq: QQ
         *     all: 打开分享面板自由选择
         * @param {string=} opts 分享参数，与MShare构造函数一致
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
            else if (isucbrowser) {
                this.ucShareTo(shareMedia, opts);
            }
            // QQ浏览器
            else if (isqqbrowser) {
                this.qqShareTo(shareMedia, opts);
            }
            // 手机百度
            else if (isbaidubox) {
                this.bdShareTo(shareMedia, opts);
            }
        },

        /**
         * 使用UC浏览器分享
         *
         * @public
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与MShare构造函数一致
         */
        ucShareTo: function (shareMedia, opts) {
            if (!isucbrowser) {
                return;
            }

            // Android
            // TODO Android分享到QQ空间无效，暂时无解
            if (typeof ucweb !== 'undefined') {
                ucweb.startRequest(
                    'shell.page_share',
                    [opts.title, '', opts.url, shareMediaMap[shareMedia][0], '', '', '']
                );
            }
            // ios
            else if (typeof ucbrowser !== 'undefined') {
                ucbrowser.web_share(opts.title, '', opts.url, shareMediaMap[shareMedia][1], '', '', '');
            }
        },

        /**
         * 使用QQ浏览器分享
         *
         * @public
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与MShare构造函数一致
         */
        qqShareTo: function (shareMedia, opts) {
            if (!isqqbrowser) {
                return;
            }

            if (!browser || !browser.app) {
                return;
            }

            browser.app.share({
                url: opts.url,
                // 微信、QQ好友、QQ空间的分享头部
                title: opts.title,
                // 为了简化，这里不设置分享摘要
                description: '',
                /* eslint-disable */
                img_url: opts.pic,
                // 1: 微信好友, 2: 腾讯微博, 3: QQ空间, 4: QQ好友, 5: 生成二维码, 8: 微信朋友圈, 10: 复制网址, 11: 分享到微博, 13: 创意分享
                to_app: shareMediaMap[shareMedia][2],
                // 微博的分享头部
                cus_txt: opts.title
                /* eslint-enable */
            });
        },

        /**
         * 使用手机百度分享
         *
         * @public
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与MShare构造函数一致
         */
        bdShareTo: function (shareMedia, opts){
            if (!isbaidubox) {
                return;
            }

            if (!Box) {
                return;
            }

            var cfg = {
                mediaType: shareMediaMap[shareMedia][3],
                linkUrl: opts.url,
                // 微信、QQ好友、QQ空间的分享头部
                title: opts.title,
                iconUrl: opts.pic || '',
                // 微信、QQ好友、QQ空间的分享摘要
                // 微博的分享内容
                content: opts.title
            };

            if (Box.os.android) {
                Box.android.invokeApp(
                    'Bdbox_android_utils',
                    'callShare',
                    [JSON.stringify(cfg), window.successFnName || 'console.log', window.errorFnName || 'console.log']
                );
            }
            else {
                Box.ios.invokeApp('callShare', {
                    options: encodeURIComponent(JSON.stringify(cfg)),
                    errorcallback: 'onFail',
                    successcallback: 'onSuccess'
                });
            }
        },

        /**
         * 使用web方式分享
         *
         * @public
         * @param {string} shareMedia 需要分享到的应用
         * @param {string=} opts 分享参数，与MShare构造函数一致
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
                    // 为了简化，这里不设置分享摘要
                    // + '&summary=' + ''
                    + '&pics=' + opts.pic;
            }

            window.open(shareUrl, 'newwindow', 'width=650,height=500,top=0,left=0');
        }
    };

    /**
     * 初始化
     *
     * @public
     * @param {string=} opts 分享参数，与MShare构造函数一致
     * @return {Object} MShare实例
     */
    function init(opts) {
        return new MShare(opts);
    }

    return {
        init: init,
        isqqbrowser: isqqbrowser,
        isucbrowser: isucbrowser,
        isbaidubox: isbaidubox
    };
});
