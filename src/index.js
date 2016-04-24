import lazyload from './lazyloadImage'
import {Container,Left} from "./container"
require('./style/index.scss')


//直接使用,就是这么任性,
//可以配置提前多少项目触发
var opt = {
    offset: 10
}
lazyload(opt)

function $(selector) {
    if (typeof selector === 'string') {
        return Container.of(document.querySelectorAll(selector))
    }
    return Container.of([selector])
}
//组合方法
function compose() {
    var argsArr = Array.prototype.slice.call(arguments)
    return function (p) {
        var fns = [].concat(argsArr)
        var fn;
        var result = fns.pop()(p)
        while (fn = fns.pop()) {
            result = fn.call(this, result)
        }
        return result
    }
}

function firstOfArray(arr) {
    try {
        return Container.of(arr.__value[0])
    } catch (e) {
        return Left.of(e)
    }
}

//插入到元素
function append(fn) {
    return function (container) {
        return container.map(function (root) {
            try {
                root.appendChild(fn())
                return root
            } catch (e) {
                return Left.of(e)
            }
        })
    }
}

//返回一个模板
function createEl() {
    var el = document.createElement("div")
    el.setAttribute("class", "item")
    el.innerHTML = ' <img class="child" lazy-src="http://ww1.sinaimg.cn/mw690/69564599gw1ezjarexbscj20zk0qo7bj.jpg" src="data:image/gif;base64,R0lGODlhAwADAIAAAP///8zMzCH5BAAAAAAALAAAAAADAAMAAAIEBHIJBQA7" alt="">'
    return el
}

//添加图片方法
let addItem = compose(append(createEl), firstOfArray, $)

var BodyClientHeight = document.body.clientHeight
var BodyScrollHeight = document.body.scrollHeight
var offset = BodyScrollHeight - BodyClientHeight
var isLoad = false
var interval;
//初始化
window.onscroll = function () {
    //只有500ms内没有滚动时,才会认为是停止,并且开始加载
    clearTimeout(interval)
    interval = setTimeout(function () {
        lazyload(opt)
    }, 300)
    if (offset == window.pageYOffset) {
        //    模拟异步
        if (!isLoad) {
            isLoad = true
            setTimeout(function () {
                var i = 20
                while (i--) {
                    addItem(".content")
                }
                BodyClientHeight = document.body.clientHeight
                BodyScrollHeight = document.body.scrollHeight
                offset = BodyScrollHeight - BodyClientHeight
                lazyload(opt)
                isLoad = false
            }, 2000)
        }
    }
}