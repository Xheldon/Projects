/**
 * Created by xheldon on 15/8/17.
 */
//function xheldon_clock(backgroundNodeName,width,second_color,minute_color,hour_color,){
//用 js 生成60个刻度
var scales = [];
var dial_width = $('#inner_dial').innerWidth();
var scale_small_width = 5;
var scale_big_width = 15;
var time = new Date();
var style;
//利用伪类 before 生成数字时间
for (var n=1;n<13;n++) {
    style = '.num_content'+n+':before{content:"'+parseInt(13-n)+'";position: absolute;left:-78px;top:-112px;transform: rotate('+parseInt(+n*(30))+'deg);}';
    $('style').append(style);
}
//生成刻度盘
for (var i=1;i<62;i++) {
    scales[i] = $('#scale').clone();
    if((i-1)%5===0){
        scales[i].attr('class','scale'+i).css({
            'backgroundColor':'darkgrey',
            'width':scale_big_width+'px',
            'height':'2px',
            'left':dial_width-scale_big_width+'px',
            'transformOrigin':-dial_width/2+scale_big_width+'px',
            'transform':'rotate('+(i-1)*(-6)+'deg)'
        }).addClass('num_content'+(i-1)/5);
    }else{
        scales[i].attr('class','scale'+i).css({
            'backgroundColor':'darkgrey',
            'width':scale_small_width+'px',
            'height':'2px',
            'left':dial_width-scale_small_width+'px',
            'transformOrigin':-dial_width/2+scale_small_width+'px',
            'transform':'rotate('+(i-1)*(-6)+'deg)'
        });
    }
    $(scales[i]).insertAfter('#scale');
};
//走起来~注意分针时针和秒针的换算关系
(function(){
    var second = time.getSeconds()+1;
    var minute = time.getMinutes();
    var hour = time.getHours();
    var second_deg = second*6;
    var minute_deg = minute*6+second/10;
    var hour_deg = hour*30+minute/2+second/12;
    setInterval(function(){
        second_deg +=6;
        $('#second_hand').css({
            'transform':'rotate('+second_deg+'deg)'
        });
        $('#minute_hand').css({
            'transform':'rotate('+parseFloat(minute_deg+second_deg/60)+'deg)'
        });
        $('#hour_hand').css({
            'transform':'rotate('+parseFloat(hour_deg+second_deg/720)+'deg)'
        });
    },1000);

})();
//}