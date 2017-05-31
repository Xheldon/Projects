var Util = {
    options: {
        //容器透视距离
        perspective: 1000
    },
    /**
     * @目的 内部使用 根据参数设置rotate角度
     * @参数 必须 Object option : {
    *   option.ele string 折叠div的id,由调用此函数传入
    *   option.degX Number 在X轴上的旋转角度
    *   option.degY Number 在Y轴上的旋转角度
    *   option.degZ Number 在Z轴上的旋转角度
    *   option.adjustX Number 修正折叠时出现白色横线的问题
    *   option.adjustY Number 修正折叠时出现白色竖线的问题
    *   }
     * @参数 必须 Number num 分割div块数值,由调用此函数传入
     * @参数 必须 String direction 折叠方向,由调用此函数传入
     * @返回值 无
     * */
    _setDeg: function (option, type, num, direction) {
        var containerId = this._setUniqueContainerName(option.ele),
            degX = option.degX || 0,
            degY = option.degY || 0,
        //交界处的白线修正
            adjustX = option.adjustX || -1.5,
            adjustY = option.adjustY || -1.5,
            m = 0;
        //调试用
        if (!num || !direction) {
            console.log('_setDeg need num and direction!');
        }
        if (direction == 'top') {
            for (; m < num; m++) {
                if (m == 0) {
                    $('#' + containerId + ' .fold-panel-1').css({
                        height: (100 / num).toFixed(2) + '%',
                        top: '0%',
                        transform: 'rotateX(' + (-1 * degX) + 'deg) rotateY(' + (-1 * degY) + 'deg) translateY(' + adjustY + 'px)'
                    });
                }
                $('#' + containerId + ' .fold-panel-' + (m + 2)).css({
                    top: "100%",
                    transform: 'rotateX(' + (degX * (m % 2 == 0 ? 2 : -2)) + 'deg) rotateY(' + (degY * (m % 2 == 0 ? 2 : -2)) + 'deg) translateY(' + adjustY + 'px)'
                });
                $('#' + containerId + ' .fold-content-' + (m + 1)).css({
                    top: '-' + (m * 100) + '%'
                });
            }
            if(type != 'click'){
                $('#' + containerId + ' .fold-shader-top').css('opacity', '' + (degX/200));
            }
        } else if (direction == 'left') {
            for (; m < num; m++) {
                if (m == 0) {
                    $('#' + containerId + ' .fold-panel-1').css({
                        width: (100 / num).toFixed(2) + '%',
                        left: '0%',
                        transform: 'rotateX(' + (degX) + 'deg) rotateY(' + (degY) + 'deg) translateX(' + adjustX + 'px)'
                    })
                }
                $('#' + containerId + ' .fold-panel-' + (m + 2)).css({
                    left: "100%",
                    transform: 'rotateX(' + (degX * (m % 2 == 0 ? -2 : 2)) + 'deg) rotateY(' + (degY * (m % 2 == 0 ? -2 : 2)) + 'deg) translateX(' + adjustX + 'px)'
                });
                $('#' + containerId + ' .fold-content-' + (m + 1)).css({
                    left: '-' + (m * 100) + '%'
                })
            }
            if(type != 'click') {
                $('#' + containerId + ' .fold-shader-left').css('opacity', '' + (degY / 200));
            }
        }
    },
    /**
     * @目的 根据事件类型折叠元素
     * @参数 必须 EventType type 触发折叠的类型,可选值有click,mouse,touch;若为click,则clickEle必填
     * @参数 可选 String clickEle 触发click事件可选的div
     * @参数 其他同上
     * @return void
     * */
    _eventType: function (option, type, num, direction, clickEle) {
        var that = this,
        //记录click次数
            count = 0,
        //鼠标按下之后向右为x正,向下为y正
            mouseDown = {},
            mouseMove = {},
            touchStart = {},
            touchMove = {},
            touch = {},
            move = {},
            containerId = this._setUniqueContainerName(option.ele),
            $eleWidth = $(option.ele).width(),
            $eleHeight = $(option.ele).height(),
            $containerIdAndShaderTop = '#' + containerId + ' .fold-shader-top',
            $containerIdAndShaderLeft = '#' + containerId + ' .fold-shader-top';
        that[containerId] = {x: 0, y: 0};
        for (var param in arguments) {
            if (!param) {
                console.log('param is needed!');
            }
        }
        if (type == 'click') {
            var odd,even;
            //如果给出另一个点击元素clickEle,则使用其作为触发折叠的元素
            $(clickEle).on('click touchstart', function () {
                if (count % 2 == 0) {
                    that._setDeg(option, type, num, direction);
                    clearInterval(even);
                    //$('#' + containerId + ' .fold-shader').css('opacity', '0');
                    if (direction == 'top') {
                        odd = setInterval(function(){
                            $($containerIdAndShaderTop).css('opacity', '+=0.005')
                        },option.costTime/90);
                        if($($containerIdAndShaderTop).css('opacity') == '0.45'){
                            clearInterval(odd);
                        }
                    } else if (direction == 'left') {
                        odd = setInterval(function(){
                            $($containerIdAndShaderLeft).css('opacity', '+=0.005')
                        },option.costTime/90);
                        if($($containerIdAndShaderLeft).css('opacity') == '0.45'){
                            clearInterval(odd);
                        }
                    }
                    count++;
                } else {
                    that._setDeg({ele: option.ele}, type, num, direction);
                    clearInterval(odd);
                    if (direction == 'top') {
                        even = setInterval(function(){
                            $($containerIdAndShaderTop).css('opacity', '-=0.005')
                        },option.costTime/90);
                        if($($containerIdAndShaderTop).css('opacity') == '0'){
                            clearInterval(even);
                        }
                    } else if (direction == 'left') {
                        even = setInterval(function(){
                            $($containerIdAndShaderLeft).css('opacity', '-=0.005')
                        },option.costTime/90);
                        if($($containerIdAndShaderLeft).css('opacity') == '0'){
                            clearInterval(even);
                        }
                    }
                    count++;
                }
            })
        } else if (type == 'mouse') {
            //既然只有mouse和touch会用到这个逻辑,就不单独抽出为一个方法来复用了
            //创建一个全局独一无二的属性用来报错div旋转的角度的值
            $('#' + containerId).on('mouseenter', function (e) {
                /**
                 * 每绑定一个事件,先移除,再添加!
                 * 修复移动鼠标期间如果鼠标移出div,则再次进入时,触发mousemove次数+1的bug,此bug会导致即使鼠标移动一点点,也会折叠很大角度
                 * */
                e.preventDefault();
                $(this).off('mousedown mousemove')
                    .css('cursor', '-webkit-grab')//设置鼠标样式
                    .on('mousedown', function (e) {//绑定鼠标按下拖拽事件
                        /**
                         * 每绑定一个事件,先移除,再添加!
                         * */
                        $(this).off('mousemove')
                            .css('cursor', '-webkit-grabbing');
                        e.preventDefault();
                        //创建一个临时变量和数组用来存储mousemove事件的鼠标位置的相对变化
                        var tempCount = 0,
                            tempArr = [[0, 0]];
                        mouseDown.x = e.pageX;
                        mouseDown.y = e.pageY;
                        $(document).on('mousemove', function (e) {
                            e.preventDefault();
                            mouseMove.x = e.pageX;
                            mouseMove.y = e.pageY;
                            move.x = mouseMove.x - mouseDown.x;
                            move.y = mouseMove.y - mouseDown.y;
                            tempArr.push([move.x, move.y]);
                            tempCount++;
                            //这里可以解耦出来一个判断mouse和touch的函数(复用两次),这个函数里面又可以抽出来根据鼠标移动位置判断设置角度的逻辑,偷个懒;
                            if (direction == 'top') {
                                if (tempArr[tempCount - 1][1] > tempArr[tempCount][1]) {
                                    //移动div一半的距离即可完全折叠
                                    console.log($eleHeight);
                                    that[containerId].y += Math.ceil($eleHeight / 500);
                                    if (that[containerId].y <= option.degX && that[containerId].y >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degX: that[containerId].y
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].y = option.degX
                                    }
                                } else if (tempArr[tempCount - 1][1] < tempArr[tempCount][1]) {
                                    //移动div一半的距离即可完全折叠
                                    that[containerId].y -= Math.ceil($eleHeight / 500);
                                    if (that[containerId].y <= option.degX && that[containerId].y >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degX: that[containerId].y
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].y = 0;
                                    }
                                }
                            } else if (direction == 'left') {
                                //每移动5px,转5deg
                                if (tempArr[tempCount - 1][0] > tempArr[tempCount][0]) {
                                    //移动div一半的距离即可完全折叠
                                    that[containerId].x += Math.ceil($eleWidth / 500);
                                    if (that[containerId].x <= option.degY && that[containerId].x >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degY: that[containerId].x
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].x = option.degY;
                                    }
                                } else if (tempArr[tempCount - 1][0] < tempArr[tempCount][0]) {
                                    //移动div一半的距离即可完全折叠
                                    that[containerId].x -= Math.ceil($eleWidth / 500);
                                    if (that[containerId].x <= option.degY && that[containerId].x >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degY: that[containerId].x
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].x = 0;
                                    }
                                }
                            } else {
                                console.log('"direction" is unavailable!')
                            }
                        })
                    })
                    .on('mouseup', function () {
                        $(this).css('cursor', '-webkit-grab')
                    })
            });
            //事件绑定针对document,使鼠标在按下的时候即使移出了div也依然可以控制
            $(document).on('mouseup', function (e) {
                e.preventDefault();
                $(this).off('mousemove mouseenter mousedown');
            });
        } else if (type == 'touch') {
            //既然只有mouse和touch会用到这个逻辑,就不单独抽出为一个方法来复用了
            //创建一个全局独一无二的属性用来报错div旋转的角度的值
            $('#' + containerId).on('touchstart', function (e) {
                var tempCount = 0,
                    tempArr = [[0, 0]];
                touchStart.x = e.originalEvent.targetTouches[0].clientX;
                touchStart.y = e.originalEvent.targetTouches[0].clientY;
                /**
                 * 每绑定一个事件,先移除,再添加!
                 * 修复移动鼠标期间如果鼠标移出div,则再次进入时,触发mousemove次数+1的bug,此bug会导致即使鼠标移动一点点,也会折叠很大角度
                 * */
                $(document).off('touchmove');
                        /**
                         * 每绑定一个事件,先移除,再添加!
                         * */
                        $(document).on('touchmove', function (e) {
                            touchMove.x = e.originalEvent.targetTouches[0].clientX;
                            touchMove.y = e.originalEvent.targetTouches[0].clientY;
                            touch.x = touchMove.x - touchStart.x;
                            touch.y = touchMove.y - touchStart.y;
                            tempArr.push([touch.x, touch.y]);
                            tempCount++;
                            //这里可以解耦出来一个判断mouse和touch的函数(复用两次),这个函数里面又可以抽出来根据鼠标移动位置判断设置角度的逻辑,偷个懒;
                            if (direction == 'top') {
                                if (tempArr[tempCount - 1][1] > tempArr[tempCount][1]) {
                                    //移动div一半的距离即可完全折叠
                                    console.log($eleHeight);
                                    that[containerId].y += Math.ceil($eleHeight / 500);
                                    if (that[containerId].y <= option.degX && that[containerId].y >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degX: that[containerId].y
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].y = option.degX
                                    }
                                } else if (tempArr[tempCount - 1][1] < tempArr[tempCount][1]) {
                                    //移动div一半的距离即可完全折叠
                                    that[containerId].y -= Math.ceil($eleHeight / 500);
                                    if (that[containerId].y <= option.degX && that[containerId].y >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degX: that[containerId].y
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].y = 0;
                                    }
                                }
                            } else if (direction == 'left') {
                                //每移动5px,转5deg
                                if (tempArr[tempCount - 1][0] > tempArr[tempCount][0]) {
                                    //移动div一半的距离即可完全折叠
                                    that[containerId].x += Math.ceil($eleWidth / 500);
                                    if (that[containerId].x <= option.degY && that[containerId].x >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degY: that[containerId].x
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].x = option.degY;
                                    }
                                } else if (tempArr[tempCount - 1][0] < tempArr[tempCount][0]) {
                                    //移动div一半的距离即可完全折叠
                                    that[containerId].x -= Math.ceil($eleWidth / 500);
                                    if (that[containerId].x <= option.degY && that[containerId].x >= 0) {
                                        that._setDeg({
                                            ele: option.ele,
                                            degY: that[containerId].x
                                        }, type, num, direction)
                                    } else {
                                        that[containerId].x = 0;
                                    }
                                }
                            } else {
                                console.log('"direction" is unavailable!')
                            }
                        });
            });
            //事件绑定针对document,使鼠标在按下的时候即使移出了div也依然可以控制
            $(document).on('touchend', function (e) {
                e.preventDefault();
                $(this).off('touchstart touchmove');
            });
        } else {
            console.log('You has set a "type" which is unavailable!')
        }
    },
    /**
    * @目的 根据参数获得一个唯一的id来识别不同实例的container
    * @参数 必须 String ele 所需要折叠的div id
    * */
    _setUniqueContainerName: function (ele) {
        return 'fold-' + ele.substr(1) + '-container'
    },
    _setShader: function (direction) {
        $('.fold-shader-' + direction).css('background','-webkit-linear-gradient(' + direction + ', rgba(0, 0, 0, .5) 0%, rgba(255, 255, 255, .35) 100%)')
    },
    /**
     * @目的 折叠元素
     * @参数 必须 String ele 所需要折叠的div id
     * @参数 必须 Number num 分割div块数
     * @参数 必须 String direction 折叠方向
     * @参数 可选 Number costTime 完成动画所花费的时间,type为click时必选
     * @参数 必须 EventType type 触发折叠的类型,可选值有click,touch;若为click,则clickele参数为必选
     * @参数 可选 String clickEle 触发click事件可选的div
     * @return void
     * **/
    foldDiv: function (ele, option) {
        //给对象添加一个其他方法也会用到的公用属性属性
        var containerId = this._setUniqueContainerName(ele),
            $ele = $(ele),
            containerIdAndPanel = '#' + containerId + ' .fold-panel',
            containerIdAndMask = '#' + containerId + ' .fold-mask',
            containerIdAndContent = '#' + containerId + ' .fold-content',
            i = 0,
            j = 0,
            eleCssName = $ele.attr('class'),
            num = option.num || 2,
            that = this;
        /**
         * #0001
         * 为containerIdAndPanel增加transformOrigin以及为containerId增加perspectiveOrigin属性之后无需根据perspective和width/height判断何时完全折叠,以下注释以备用
         * degX = 180-Math.atan((that.options.perspective / ($eleHeight / 2))) * (180 / Math.PI) || 0,
         * degY = 180-Math.atan((that.options.perspective / ($eleWidth / 2))) * (180 / Math.PI) || 0;
         * **/
            //DOM操作,包裹div,因为需要加阴影,所以需要根据折叠方向来形成结构
        if (option.direction == 'top') {
            $ele.removeClass(eleCssName)
                .addClass('fold-content')
                .wrap('<div class="fold-mask"></div>')
                .closest('.fold-mask')
                .append('<div class="fold-shader fold-shader-top"></div>')
                .append('<div class="fold-shader fold-shader-bottom"></div>')
                .wrap('<div class="fold-panel"></div>')
                .closest('.fold-panel')
                .wrap('<div class="container ' + eleCssName + '" id="' + containerId + '"></div>')
                .closest('.container');
        } else if (option.direction == 'left') {
            $ele.removeClass(eleCssName)
                .addClass('fold-content')
                .wrap('<div class="fold-mask"></div>')
                .closest('.fold-mask')
                .append('<div class="fold-shader fold-shader-left"></div>')
                .append('<div class="fold-shader fold-shader-right"></div>')
                .wrap('<div class="fold-panel"></div>')
                .closest('.fold-panel')
                .wrap('<div class="container ' + eleCssName + '" id="' + containerId + '"></div>')
                .closest('.container');
        }
        //设置相关元素样式
        $('#' + containerId).css({//总外层容器
            perspective: that.options.perspective + 'px',
            transform: 'translate3d(0px, 0px, 0px)',
            transformStyle: "preserve-3d",
            overflow: 'hidden'
        });
        $(containerIdAndPanel).css({//基本transform单位
            width: '100%',
            height: '100%',
            position: 'absolute',
            transition: option.costTime ? 'all ' + option.costTime + 'ms' + ' linear 0ms' : 'all 0ms linear 0ms',
            transformOrigin: option.direction,
            transformStyle: 'preserve-3d',
            transitionProperty: 'transform'
        });
        $(containerIdAndMask).css({//遮罩div
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'absolute'
        });
        //阴影效果
        $('.fold-shader').css({
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            pointerEvents: 'none',
            opacity: '0'
        });
        this._setShader('top');
        this._setShader('bottom');
        this._setShader('left');
        this._setShader('right');
        //生成结构
        for (; i < num - 1; i++) {
            $(containerIdAndPanel)
                .eq(i)
                .clone()
                .appendTo($(containerIdAndPanel).eq(i));
        }
        //加上类名
        for (; j < num; j++) {
            $(containerIdAndPanel).eq(j).addClass('fold-panel-' + (j + 1));
            $(containerIdAndContent).eq(j).addClass('fold-content-' + (j + 1));
        }
        //确定折叠方向
        if (option.direction == 'top') {
            $('#' + containerId).css({
                perspectiveOrigin: '50% 0'
            });
            $(containerIdAndContent).css({
                position: 'absolute',
                height: (num * 100) + '%',
                maxHeight: (num * 100) + '%',
                width: '100%'
            });
            //初始角度,不设置默认为空
            that._setDeg({ele: ele}, option.type, option.num, option.direction);
            //确定事件类型
            if (option.type == 'click') {
                //click时点击clickEle即可完全折叠(dexY加上更酷)
                that._eventType({
                    ele: ele,
                    /**
                     * 原因: #0001
                     * 此处原本为 degX: degX
                     * */
                    degX: 90
                    //degY: 90
                }, option.type, option.num, option.direction, option.clickEle);
            } else if (option.type == 'mouse') {
                //鼠标按下移动时则根据鼠标move的方向来折叠
                that._eventType({
                    ele: ele,
                    /**
                     * 原因: #0001
                     * 此处原本为 degX: degX
                     * */
                    degX: 90
                }, option.type, option.num, option.direction);
            } else if (option.type == 'touch') {
                //触摸事件和mouse类似,需要注意设备判定
                that._eventType({
                    ele: ele,
                    /**
                     * 原因: #0001
                     * 此处原本为 degY: degY
                     * */
                    degX: 90
                }, option.type, option.num, option.direction);
            }
        } else if (option.direction == 'left') {
            $('#' + containerId).css({
                perspectiveOrigin: '0 50%'
            });
            $(containerIdAndContent).css({
                position: 'absolute',
                width: (num * 100) + '%',
                maxWidth: (num * 100) + '%',
                height: '100%'
            });
            //初始角度,不设置默认为空
            that._setDeg({ele: ele}, option.type, option.num, option.direction);
            //确定事件类型
            if (option.type == 'click') {
                //click时点击clickEle即可完全折叠
                that._eventType({
                    ele: ele,
                    degY: 90,
                    //只有click类型需要costTime来变化opacity
                    costTime: option.costTime
                    /**
                     * 原因: #0001
                     * 此处原本为 degY: degY
                     * */
                }, option.type, option.num, option.direction, option.clickEle);
            } else if (option.type == 'mouse') {
                //鼠标按下移动时则根据鼠标move的方向来折叠
                that._eventType({
                    ele: ele,
                    /**
                     * 原因: #0001
                     * 此处原本为 degY: degY
                     * */
                    degY: 90
                }, option.type, option.num, option.direction);
            } else if (option.type == 'touch') {
                //触摸事件和mouse类似,需要注意设备判定
                that._eventType({
                    ele: ele,
                    /**
                     * 原因: #0001
                     * 此处原本为 degY: degY
                     * */
                    degY: 90
                }, option.type, option.num, option.direction);
            }
        }
    }
};