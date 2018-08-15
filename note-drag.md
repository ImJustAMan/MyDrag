## 拖拽类
简单的拖拽组件封装
接收参数
init: {
    draged: el, //被拖拽元素
    scroll: { //设置被拖拽元素作为自定义滚动条的滚动条，传参时bar就为滚动条元素draged可不传
        bar: el, //被拖拽元素（作为滚动条时传入这个元素无须传draged）
        page: el, //滚动的元素（需要设置对应宽高为全部内容的总宽高）
        dir: "x" || "y",//设置滚动方向
        wheelScroll: true || false //是否启用鼠标滚轮滚动滚动条 默认值为false
    },
    clone: true || false,//是否克隆拖拽
    range: { //限制范围拖拽时传入参数 可传一个对象或者元素，传入对象为对应上下左右的范围限制
        left: num,
        right: num,
        top: num,
        bottom: num
    } || el
}
组件中加入三个接口，为开始拖拽前（dragStart）、拖拽中（draging）、拖拽结束（dragEnd）
