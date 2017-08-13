$(document).ready(function() {
    (function() {
        //settings
        var fadeSpeed = 200, fadeTo = 0.5, topDistance = 30;
        var topbarME = function() { $('#tracebar').fadeTo(fadeSpeed,1); }, topbarML = function() { $('#tracebar').fadeTo(fadeSpeed,fadeTo); };
        var inside = false;
        //do
        $(window).scroll(function() {
            position = $(window).scrollTop();
            if(position > topDistance && !inside) {
                //add events
                topbarML();
                $('#tracebar').bind('mouseenter',topbarME);
                $('#tracebar').bind('mouseleave',topbarML);
                inside = true;
            }
            else if (position < topDistance){
                topbarME();
                $('#tracebar').unbind('mouseenter',topbarME);
                $('#tracebar').unbind('mouseleave',topbarML);
                inside = false;
            }
        });
    })();
});