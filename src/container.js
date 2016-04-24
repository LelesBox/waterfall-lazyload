/**
 * Created by blake on 4/24/16.
 */
const isArray = Array.isArray || function (value) {
        return toString.call(value) === '[object Array]';
    };

//错误对象
function Left(value) {
    this.__value = value
}
Left.of = function (value) {
    return new Left(value)
}

Left.prototype.map = function (fn) {
    var value = fn(this.__value)
    return value instanceof Left ? value : Left.of(value)
}

//容器
function Container(value, errMsg) {
    this.__value = value
}

Container.of = function (value) {
    return new Container(value)
}

Container.prototype.map = function (fn, restrictObject) {
    if (isArray(this.__value) && !restrictObject) {
        let value = []
        let item;
        for (let i = 0; i < this.__value.length; i++) {
            item = fn(this.__value[i], i, this.__value)
            if (item instanceof Left) {
                return item
            }
            value.push(item)
        }
        return Container.of(value)
    } else {
        let value = fn(this.__value)
        return value instanceof Left ? value : Container.of(value)
    }
}
//filter
Container.prototype.filter = function (fn) {

    if (!isArray(this.__value)) {
        return Left.of(this.__value + "is not array")
    }
    return Container.of(this.__value.filter(fn))
}

//获取数组的第一个值
Container.prototype.first = function () {
    if (!isArray(this.__value)) {
        return this
    }
    return Container.of(this.__value[0])
}

exports.Container = Container
exports.Left = Left

//另一个版本的compose
//function Xcompose() {
//    var argsArr = Array.prototype.slice.call(arguments)
//    return function (p) {
//        var fns = [].concat(argsArr)
//
//        function r(fns, result) {
//            if (fns.length === 0) {
//                return result
//            } else {
//                result = fns.pop()(result)
//                return r(fns, result)
//            }
//        }
//
//        return r(fns, p)
//    }
//}