# 瀑布流

>瀑布流页面,就是网页滚动到底部自动往下更新的一种模式，我需要完成下面两个前提条件

1.	监听滚动条判断是否到底部
2.	只有在滚动到视口内时图片才会去加载

下面让我来一个个击破这两个问题，也给自己第一次接触此类技术的一个实践吧


## 现有API

### 监听浏览器滚动API

`window.onscroll`

```javascript
window.onscroll=function(){
    console.log("onscroll")
}
```

### 判断是否滚动到底部

用到三个属性，一个是`clientHeight`, 表示视口高度，另一个是`scrollHeight`，表示容器高度，最后一个属性是滚动条的偏移量`window.pageYOffset`。用着三个属性值就可以判断是否滚动到底部。

```javascript
var BodyClientHeight = document.body.clientHeight
var BodyScrollHeight = document.body.scrollHeight
var offset = BodyScrollHeight - BodyClientHeight
window.onscroll = function () {
    if (offset == window.pageYOffset) {
        console.log("到底部了")
    }
}
```

### 图片懒加载

当列表越来越长的时候，显示的内容太多会造成性能问题，尤其是大量的图片等待加载显示会占用大量性能资源，办法就是，只有当图片出现在视口当中时才会去加载显示图片。下面是要处理的几种情况

1.	如果判断一个图片是在在视口之内
2.	图片不显示时用dataURI默认图片占位
3.	当图片已经加载过后 但又滚出视口之外时应该隐藏图片，替换为默认图片占位
4.	当处于视口之中时判断是否需要从网络获取还是在本地已经有缓存
5.	只有滚动停下来后才会去加载图片

#### 1）

判断元素是否在视口内，可以使用`element.getBoundingClientRect()`,返回值为：

```javascript
{
    bottom: 700,
    height: 100,
    left: 200,
    right: 300,
    top: 600,
    width: 100,
}
```
其中【bottom/top】表示元素【底部/顶部】离视口***顶部***的距离，【left/right	】表示元素【左边/右边】距离视口左边的距离

有了这个前提条件后，我们能得出这样一个结论，就是，当，元素的bottom值小于0时表示元素被完全滚动出在视口上方，当元素的top值大于视口高度时表示元素被完全滚动出下方。既它们不在视口内，获得视口高度的方法是，`window.innerHeight||document.documentElement.clientHeight`，宽度同理`window.innerWidth||document.documentElement.clientWidth`。

所以，存在一个判断一个元素是否在视窗之内的函数如下：

```javascript
/**
 *判断某个元素是否处于视窗之内的方法
 * @param el 元素
 * @param height 容器高度
 * @param offset 冗余值,既表示提前多少个像素渲染
 * @returns {Container}
 */
function isOnViewPort(el, height, offset) {
    offset = offset || 0
    return $(el).first().map(function (val) {
        return val.getBoundingClientRect()
    }).map(val=> {
        return val.bottom > (0 - offset) && val.top < (height + offset)
    })
}
```
代码风格有点奇怪，因为最近刚看了些函数式编程的文章，所以拿着个试手。解释一下上面代码的意思，参数已经有注释。

1.	`$(el)`表示获取el元素，该值返回一个Container类型的数组，
2.	Container类型含有first的原型方法，表示获取数组中的第一个值，因为用$(el)返回的Container内的真实值（__value）是NodeList类型，这里只取一个节点，所以用first方法获取到第一个DOM节点，
3.	接着是map操作，map接收一个方法（fn）参数，表示对其进行（fn）处理后得出新的值，当然，得出的新值也是Container类型的，这里是执行DOM节点的`getBoundingClientRect()`方法得到距离浏览器视口的各个位置的值
4.	根据这些位置的值根据之前的理论即可得到该元素是否处于视口之内。返回true或false包裹在Container之内

上面四个步骤，每一步最后返回值都是Container类型。函数式编程，每一个函数都应该是纯函数，我的理解是该函数内部不应该包含其他函数在里面，也不应该包含外部变量在里面，函数产生的结果*只跟*传入的参数有关

有了判断是否在视口内的这个基础方法，接下来，我们就可以跟进下面这4个步骤来让处于视口中的元素真正加载其图片。先上代码：

```javascript
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
```

在这里，我规定，对使用懒加载的图片元素加上'`lazy-src`属性，并且，你可以使用一个data-uri去添加占位符。避免产生不必要的网络请求。

上面代码基本的四个步骤分别为：

1.	获取包含属性lazy-src的所有元素
2.	把得到的元素数组（类型是NodeList）转换成Array类型，并且获得了`filter`方法
3.	通过filter筛选出处于视口之内的元素数组
4.	通过map方法，逐个替换掉对应元素的lazy-src属性为src

刚接触函数式编程不久，但是小试牛刀后感觉用这种方式去写代码，思路更清晰些，一个目的被拆分成一个个步骤。棒！

[完整代码](https://github.com/LelesBox/waterfall-lazyload)

***DONE*** 

