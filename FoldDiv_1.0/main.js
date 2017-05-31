var $topContainer = $('#top-container'),
    $bottomContainer = $('#bottom-container'),
    $contentRepeat = $('#top-content').clone(true);
$('#bottom-mask').append($contentRepeat);
$('#click').on('click',function(){
    if($topContainer.hasClass('top-open')){
        $topContainer.removeClass('top-open');
        $bottomContainer.removeClass('bottom-open');
    }else{
        $topContainer.addClass('top-open');
        $bottomContainer.addClass('bottom-open');
    }
});