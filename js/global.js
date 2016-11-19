;(function($) {

//杩欐槸涓囨伓鐨勫叏灞€鍙橀噺
var Global = {
    section_name : [],
    isScrolling : true,
    section_num : 1
};
//缂撳嚭鐜板嚱鏁�
Global.fadeInByOrder = function(selector,interval,callback){
    var i = 1,
        length = $(selector+' .fade').length + 1,
        intervala = interval || 100,
        callbacka = callback || function(){ return; };

    (function fadeInIt(){
        if ( i < length ) {
            $(selector+' .fade'+i).addClass('fade-in');
            i++;
            setTimeout( arguments.callee , intervala );
            if ( i === length) {
                callbacka();
            }
        }
    })();
};
//鍑芥暟鑺傛祦
Global.throttle = function(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};
//閲嶆柊璁＄畻鍏冪礌浣嶇疆
Global.reCal = function(){

    //灞呬腑鍔犺浇鍔ㄧ敾
    (function centerLoading() {
        if ( !$('body').hasClass('finish-loading') ) {
            var topOffset = ( $(window).height() - 175 ) / 2  ,
                leftOffset = ( $(window).width() - $('loading').width() ) / 2 - 60;

            $('.loading').css({
                top: topOffset,
                left: leftOffset,
                right: 'auto',
                bottom: 'auto'
            });
        }
    })();

    //澶勭悊姣忎釜鍖哄潡
    $('.section-wrap').each(function(index, el) {
        Global.section_name[index] = $(this).attr('class').substr(($(this).attr('class').indexOf('section-wrap ')+13));
        $(this).find('.section').height($(window).height());
    });

    //楂樺害灞呬腑涓讳綋鍐呭
    $('.section-content').each(function(){
        $(this).css({
            marginTop: ( $(window).height() - 40 - $(this).height() ) / 2
        });
    });

};
//澶勭悊棣栭〉鑳屾櫙鍥剧墖
Global.fixedbg = function(){
    var slide_rate = 1000 / 667,
        window_rate;
    (function(){
        window_rate = $(window).width() / $(window).height();
        if ( window_rate < slide_rate ) {
            $('.home-bg img').css({height:$(window).height()+'px',width:($(window).height()*slide_rate)+'px','margin-left':'-'+($(window).height()*slide_rate-$(window).width())/2+'px'});
        }else{
            $('.home-bg img').css({height:($(window).width()/slide_rate)+'px',width:$(window).width()+'px','margin-left':0});
        }
    })();
};
//澶撮儴浜や簰
Global.shrinkHeader = function(doShrink){
    if (doShrink) {
        $('.section-header').addClass('shrink');
    }else{
        $('.section-header').removeClass('shrink');
    }
};
//楂樹寒鑿滃崟
Global.fire_nav = function(theNav){
    $('.nav .fade').removeClass('hover');
    switch(theNav){
        case 2:
            $('.nav .fade1').addClass('hover');
            break;
        case 3:
            $('.nav .fade4').addClass('hover');
            break;
        case 4:
            $('.nav .fade2').addClass('hover');
            break;
        case 5:
            $('.nav .fade3').addClass('hover');
            break;
    }
};
//榧犳爣婊氬姩鍚庡鐞嗗嚱鏁�
Global.scrollHandle = function(scrollDown){
    if (!Global.isScrolling) {
        
        Global.isScrolling = true;
        var targetScrollTopValue = scrollDown ? Global.targetScrollTop(++Global.section_num) : Global.targetScrollTop(--Global.section_num);
        
        if ( scrollDown ) {
            if ( Global.section_num > 1 ) {
                Global.shrinkHeader(true);
            }
        }else{
            if ( Global.section_num === 1 ) {
                Global.shrinkHeader(false);
            }
        }

        $('html,body').animate({scrollTop: targetScrollTopValue}, 600,function(){
            Global.isScrolling = false;
        });
        Global.fire_nav(Global.section_num);
    
    }
};
//璁＄畻瑕佹粴鍔ㄥ埌鐨勯珮搴�
Global.targetScrollTop = function(n){
    if(n > Global.section_name.length){
        Global.section_num = Global.section_name.length;    
    }
    if(n < 1){
        Global.section_num = 1; 
    }
    return ($(window).height() * (Global.section_num - 1));
};
//鏍规嵁 CSS3 鍒ゆ柇灞忓箷
//鍘熺悊锛歨ttp://yujiangshui.com/use-javascript-css-media-queries-detect-device-state/
Global.forRetina = function(){

    $('body').append('<div class="state-indicator"></div>');

    function getDeviceState() {
        switch(parseInt($('.state-indicator').css('z-index'),10)) {
            case 1:
                return false;
            case 2:
                return true;
        }
    }

    if( getDeviceState() ){
        Global.changeDBImg();
    }

    $('.state-indicator').remove();
};
//灏� img 澶勭悊鎴� @2x 鍍忕礌
Global.changeDBImg = function(){
    function changeDBURL(imgURL,imgType){
        return imgURL.substring(0,imgURL.indexOf('.'+imgType)) + '@2x.' + imgType;
    }
    $('.my-photo').attr('src',function(){
        return changeDBURL($(this).attr('src'),'jpg');
    });
};
//闈㈠悜骞虫澘鐢佃剳鐨勮Е鎽告墜鍔�
Global.handleTouchEvent = function(event){
    if (event.touches.length == 1) {

        var touchStartY,
            touchMoveY;

        switch (event.type) {
            case "touchstart":
                touchStartY =  event.touches[0].clientY;
                break;
            case "touchmove":
                touchMoveY  =  event.changedTouches[0].clientY;
                break;
        }
        Global.scrollHandle( touchStartY > touchMoveY ? true : false );

    }
    event.preventDefault();
};


$(document).ready(function() {

    $('a[href="#"]').click( function(e) { e.preventDefault(); return false; } );

    Global.reCal();
    Global.fixedbg();
    Global.forRetina();

    $('.nav a').click(function(e) {

        var target = $(this).attr('href');
        switch(target){
            case '#top':
                target = 1;
                break;
            case '#about':
                target = 2;
                break;
            case '#works':
                target = 3;
                break;
            case '#skill':
                target = 4;
                break;
            case '#contact':
                target = 5;
                break;
        }
        Global.section_num = target;
        if ( target == 1 ) {
            Global.shrinkHeader(false);
            $('.nav .fade').removeClass('hover');
        }else{
            Global.fire_nav(target);
            Global.shrinkHeader(true);
        }
        $('body,html').animate({scrollTop:Global.targetScrollTop(target)},600,function(){
            
        });

        e.preventDefault(); return false;
    });

    $('.scroll-tip').click(function(event) {
        if(Global.section_num == 5){
            $('html,body').animate({scrollTop: 0}, 1000,function(){
                Global.section_num =1
             }); 
        }else{
            if (!Global.isScrolling) {
                Global.isScrolling = true;
                $('html,body').animate({scrollTop: Global.targetScrollTop(++Global.section_num)}, 400,function(){
                    Global.isScrolling = false;
                });
                if ( Global.section_num > 1 ) {
                    Global.shrinkHeader(true);
                }
            }  
        }

    });

});


window.onresize = Global.throttle(function(){
        Global.reCal();
        Global.fixedbg();
    },50);


$(window).load(function() {

    Global.fixedbg();
    Global.reCal();
    $('html,body').animate({scrollTop:0}, 100);
    Global.isScrolling = false;

    (function load_init(){

        //璧勬簮鍔犺浇瀹屾垚涔嬪悗锛屽紑濮嬪垵濮嬪寲

        $("body").addClass('finish-loading');

        $('.finish-loading .loading').animate({top:"20px"},600,function(){
            $('.back-home').css('opacity',0);
            //$('.loading').remove();
            $('.loading').css({"margin-top":"-10px","z-index":"99"})
        });

        setTimeout(function(){
            $('body').removeClass('loading-process');
        },600);

        Global.fadeInByOrder('.nav',100,function(){
            Global.fadeInByOrder('.section-fristpage',300);
        });

    })();

});

window.onscroll = Global.throttle(function(){

        $('body').removeClass('finish-loading');
        var fadeInTarget;
        switch(Global.section_num){
            case 1:
                fadeInTarget = '.section-fristpage';
                $('body').addClass('finish-loading');
                break;
            case 2:
                fadeInTarget = '.about-content';
                break;
            case 3:
                fadeInTarget = '.works-list';
                break;
            case 4:
                fadeInTarget = '.skill-content';
                break;
            case 5:
                fadeInTarget = '.contact-content';
                break;
        }

        Global.fadeInByOrder(fadeInTarget,200);

    },50);

//鍒ゆ柇榧犳爣婊氬姩鏂瑰悜
$(document).on('mousewheel DOMMouseScroll', function(e){
    var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail,
        isMouseScrollDown = delta < 0 ? true : false;

    //澶勭悊濂戒笂涓嬪厓绱犳暟缁勶紝寮€濮嬫粴鍔�
    if (isMouseScrollDown) { //榧犳爣鍚戜笅婊氬姩

        Global.scrollHandle(true);

    }else{

        Global.scrollHandle(false);

    }

    e.preventDefault();
});


})(jQuery);
