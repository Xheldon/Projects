/**
 * Created by Xheldon 16/4/26.
 */
$(function(){
    
    $('.container-one').clone().appendTo('.container-two .content-mask').css({
        left:'-750px'
    });




    $('.container-one button').click(function(){
        $('.container-two').css({
            'transform': 'rotateY(-180deg) translateZ(0)'
        });
        $('.content-hide').css({
            transform: 'rotateY(179.999deg) translateZ(0)'
        });
        $('.mask').fadeIn(1000);
    });
    $('.content-hide button').click(function(){
        $('.container-two').css('transform','rotateY(0deg) translateZ(0)');
        $('.content-hide').css('transform', 'rotateY(0deg) translateZ(0)');
        $('.mask').fadeOut(600);
    });
    $('#ie-fold').click(function(){
        $('.mask').fadeIn(1000);
        $('.content-hide').css('left','-450px');
        $('.hide-mask').fadeIn(1000);
    });
    $('#ie-unfold').click(function(){
        $('.mask').fadeOut(1000);
        $('.content-hide').css('left','450px');
        $('.hide-mask').fadeOut(1000);
    })
});