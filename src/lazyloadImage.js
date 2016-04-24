/**
 * Created by blake on 4/24/16.
 */
'use strict'

import {Container,Left} from './container'

var clientHeihgt = window.innerHeight || document.documentElement.clientHeight

function $(selector) {
    if (typeof selector === 'string') {
        return Container.of(document.querySelectorAll(selector))
    }
    return Container.of([selector])
}

/**
 *判断某个元素是否处于视窗之内的方法
 * @param el 元素
 * @param height 容器高度
 * @param offset 冗余值,既表示提前多少个像素渲染
 * @returns {*|Container}
 */
function isOnViewPort(el, height, offset) {
    offset = offset || 0
    return $(el)
    .first()
    .map(function (val) {
        return val.getBoundingClientRect()
    })
    .map(val=> {
        return val.bottom > (0 - offset) && val.top < (height + offset)
    })
}

//处理加载图片,获取包含属性lazy-src的元素,计算其是否在视窗内,如果是则把lazy-src属性改为src属性
//现在的逻辑思路就是
//1.获取包含lazy-src属性的元素集合
//2.筛选出处于视口的元素
//3.分别把其lazy-src属性替换成src属性
function lazyload(opt) {
    $("[lazy-src]")
    //nodeList转换成数组
        .map(val=> {
            let array = []
            for (let i = 0; i < val.length; i++) {
                array.push(val[i])
            }
            return array
        })
        //筛选出处于视口中的元素
        .filter((item)=> {
            return isOnViewPort(item, clientHeihgt, opt.offset).__value;
        })
        //逐个替换lazy-src为src
        .map(val=> {
            var delay = val.getAttribute("lazy-src")
            val.removeAttribute("lazy-src")
            setTimeout(function () {
                val.setAttribute("src", delay)
            }, 1000)
            return val
        })
        //打印数组长度,仅用于测试
        .map(val=>console.log(val.length), true)
}

export default lazyload
