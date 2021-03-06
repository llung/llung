/************************************************************
 Start Framework Script
 ************************************************************/
/* ==========================================================
 * Lynda Overlay Plugin
 * ==========================================================
 * Copyright 1995�2012 lynda.com, Inc. All rights reserved.
 *
 * ---------Options:-----------------------------------------
 *
 *  href: Used for the Ajax and External calls.
 *  css_class: Class on the elements that you are wanting to call.
 *  title: HTML title attribute if passed the title will appear in a h1 tag inside the overlay.
 *  type: Currently supports Image, JSON, File, External, Default
 *  element: Name of the hidden element on page you which to show.
 *  data_class: Class that is applied to the opened overlay.
 *  call: Name of the JSON object on page you which to page to overlay. (currently just supports title, and content)
 *  width: Width of overlay
 *  height: Height of overlay
 *  rounded: Amount to round the corners of the overlay (CSS3)
 *  start: auto initialize the overlay?
 *  show: Used by show overlay function when javascript is calling the overlay
 *  close: Used by close overlay function when javascript is closing the overlay
 *
 * ---------Usage: (with options)---------------------------
 $(document).ready(function () {
 $('body').overlay({start: true});
 });
 * ========================================================== */
function show_overlay(ov, options){
    $(ov).show_ov(ov, options);
}
function close_overlay(ov){
    $(ov).close_ov(ov);
}
(function($){
    $.fn.extend({
        show_ov: function(ov, options){
            //alert($(ov).text());
            $(ov).overlay(options);
        },
        close_ov: function(ov){
            $(ov).overlay({close: true});
        },
        overlay: function(options, callback) {
            var defaults = {
                href: '',
                css_class: 'overlay',
                title: '',
                type: 'regular',
                element: 'overlay',
                data_class: 'my_overlay',
                call: {},
                width: 'user',
                height: 'user',
                rounded: '7px',
                start: true,
                show: false,
                close: false,
                sticky: false
            };
            var is_mobile = function(){
                return (navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod') ? true : false;
            };
            this.reposition = function () {
                return this.each(function() {
                    if($('.overlay_holder').length){
                        $('.overlay_holder').each(function(){
                            $("#modal_bg").css({ 'width': $(window).width(), 'height': $(window).height() });
                            if (is_mobile()) {
                                $("#modal_bg").css("top", $(window).scrollTop());
                            }
                            var overlay_top = (((Number($(window).height()) - Number($(this).height())) / 2));
                            var overlay_left = (((Number($('body').width()) - Number($(this).width())) / 2));
                            overlay_top = (overlay_top < 0) ? 50 : overlay_top;
                            $(this).css({'left': overlay_left, 'top': overlay_top + $(window).scrollTop()});
                        });
                    }
                });
            };
            this.reposition_bg = function () {
                if ($('.overlay_holder').length) {
                    $("#modal_bg").css({"top": ($(window).scrollTop()), 'left': $(window).scrollLeft(), "height": ($(window).height() + 30), "width": ($(window).width())});
                }
            };
            options =  $.extend(defaults, options);
            return this.each(function() {
                var o = options;
                
                if(o.start){
                    var fob = this;
                    
                    if ($('#overlay_frame').length) {
                        $('#overlay_frame').remove();
                    }
                    $("<div/>", {
                        id: "overlay_frame",
                        'class': "overlay_frame"
                    }).appendTo('body');
                    var i = 1;
                    if ($('.overlay').find("img").length) {
                        $('.overlay').each(function () {
                            $(this).find("img").attr('id', 'od_' + i).clone().appendTo("#overlay_frame").attr('id', 'image_od_' + i).attr('class', '');
                            i++;
                        });
                    }
                    
                    /*Start Public*/
                    fob.init = function(e){
                        var ov = $(e);
                        var config = {
                            href: ov.attr('href'),
                            css_class: ov.attr('class'),
                            title: (ov.attr('title') !== undefined) ? ov.attr('title') : o.title,
                            type: ov.data('type'),
                            element: (ov.data('element') !== undefined) ? ov.data('element') : o.element,
                            data_class: (ov.data('class') !== undefined) ? ov.data('class') : o.data_class,
                            call: (ov.data('call') !== undefined) ? ov.data('call') : o.call,
                            width: (ov.data('width') !== undefined) ? ov.data('width') : o.width,
                            height: (ov.data('height') !== undefined) ? ov.data('height') : o.height,
                            rounded: (ov.data('rounded') !== undefined) ? ov.data('rounded') : o.rounded
                        };
                        add_bg(), 300;
                        add_content(e, config);
                    };
                    fob.reposition = function () {
                        if($('.overlay_holder').length){
                            $('.overlay_holder').each(function(){
                                $("#modal_bg").css({ 'width': '100%', 'height': document.body.clientHeight });
                                /*if (is_mobile()) {
                                    $("#modal_bg").css("top", $(window).scrollTop());
                                }*/;
                                var overlay_top = (((Number($(window).height()) - Number($(this).height())) / 2));
                                var overlay_left = (((Number($('body').width()) - Number($(this).width())) / 2));
                                overlay_top = (overlay_top < 0) ? 50 : overlay_top;
                                $(this).css({'left': overlay_left, 'top': overlay_top + $(window).scrollTop()});
                            });
                        }
                    };
                    fob.reposition_bg = function () {
                        if ($('.overlay_holder').length) {
                            $("#modal_bg").css({"top": ($(window).scrollTop()), 'left': $(window).scrollLeft(), "height": ($(window).height() + 30), "width": ($(window).width())});
                        }
                    };
                    /*End Public*/
                    /*Start Private*/
                    var is_mobile = function(){
                        return (navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod') ? true : false;
                    };
                    var add_content = function(e, config){
                        if ($('#overlay').length) {
                            $('#overlay').remove();
                        }
                        if ($("#overlay_bar").length) {
                            $("#overlay_bar").remove();
                        }

                        var overlay_padding = $("#" + config.element).css('padding'),
                            overlay_height = $("#" + config.element).height(),
                            overlay_width = $("#" + config.element).width(),
                            content_html = '';

                        $("<div/>", {
                            id: "overlay",
                            'class': "overlay_holder " + config.data_class
                        }).prependTo('body');
                        var total_width = ((config.width == 'user') ? overlay_width : config.width ),
                            total_height = ((config.height == 'user') ? overlay_height : config.height ),
                            overlay_top = (((Number($(window).height()) - Number(total_height)) / 2)),
                            overlay_left = (((Number($('body').width()) - Number(total_width)) / 2));

                        if (total_width >= ($(document).width()-50)) {
                            total_width = (Number($('body').width()) - 100);
                            total_height = 'auto';
                            overlay_top = 50;
                        } else if (total_height >= ($(window).height()-50)) {
                            overlay_top = 50;
                        }
                        $("<div/>", {
                            id: "overlay_bar",
                            'class': "overlay_bar",
                            html: '<a href="#nogo" class="overlay_close"><img src="images/btn_close_22x22_black.png" alt=""/></a>'
                        }).prependTo("#overlay");
                        switch(config.type)
                        {
                            case 'image':
                                $("#overlay").css({'width': 'auto', 'height': 'auto'});
                                var src = $(e).find('img').attr('src'),
                                    image_id = $(e).find('img').attr('id'),
                                    width = $("#image_"+ image_id).width(),
                                    height = $("#image_"+ image_id).height();
                                    total_width = width;
                                    total_height = height;
                                    overlay_top = (((Number($(window).height()) - Number(height)) / 2));
                                    overlay_left = (((Number($('body').width()) - Number(width)) / 2));

                                if (width >= ($(document).width()-100)) {
                                    total_width = (Number($('body').width()) - 100);
                                    total_height = 'auto';
                                    overlay_top = 50;
                                } else if (height >= ($(window).height()-100)) {
                                    overlay_top = 50;
                                    total_width = 'auto';
                                }
                                $('<div id="overlay_image_content" class="overlay_content"><img src="' + src + '" width="' + total_width + '" height="' + total_height + '" alt="'+config.title+'" style="height: ' + total_height + ''+((total_height =="auto") ? '':'px')+';width: ' + total_width + ''+((total_width =="auto")? '':'px')+';" alt="" /></div>').insertAfter('#overlay_bar');
                                if(config.title !== ""){
                                    $('<div class="overlay_caption"><h1>'+config.title+'</h1></div>').appendTo('.overlay_content');
                                    $('.overlay_caption').fadeTo("slow", 0.60);
                                }
                                $("#overlay").hide().fadeTo("slow", 1).show().css({ 'left': overlay_left}).width((Number(total_width) + overlay_padding));
                                $("#overlay").css('top', overlay_top + $(window).scrollTop());
                                break;
                            case 'json':
                                $("#overlay").append('<div class="overlay_content">'+ ((window[config.call].title !== "") ? '<h1>'+window[config.call].title+'</h1>': '')+ '' + window[config.call].content + '</div>');
                                show_overlay(overlay_top, overlay_left, total_width, total_height);
                                break;
                            case 'file':
                                $.ajax({
                                    dataType: "text",
                                    url: config.href,
                                    success: function (data) {
                                        $('#overlay').html('<div class="overlay_content">'+ data + '</div>');
                                        show_overlay(overlay_top, overlay_left, total_width, total_height);
                                    }
                                });
                                break;
                            case 'external':
                                $.ajax({
                                    url: config.href,
                                    success: function (data) {
                                        if($('#overlay').find(".overlay_content").length){
                                            $('#overlay').find(".overlay_content").remove();
                                        }
                                        $('#overlay').append('<div class="overlay_content">' + data + '</div>');
                                        show_overlay(overlay_top, overlay_left, total_width, total_height);
                                    }
                                });
                                break;
                            default:
                                $("#overlay").append('<div class="overlay_content">'+ ((config.title !== "") ? '<h1>'+config.title+'</h1>': '')+ '' + $("#"+ config.element).html() + '</div>');
                                show_overlay(overlay_top, overlay_left, total_width, total_height);
                        }
                        add_rounded(config.rounded);
                        add_shadow('5px 5px 5px', '#666666');

                        $('.overlay_close').on('click', function () {
                            close();
                        });
                    };
                    var add_rounded = function(amount){
                        $("#overlay").css({ '-moz-border-radius': amount, '-webkit-border-radius': amount, 'border-radius': amount, '-khtml-border-radius': amount });
                    };
                    var add_shadow = function(shadow_size, shadow_color){
                        $("#overlay").css({ '-moz-box-shadow': ''+shadow_size+' '+shadow_color+'', '-webkit-box-shadow': ''+shadow_size+' '+shadow_color+'', 'box-shadow': ''+shadow_size+' '+shadow_color+'' });
                    };
                    var add_bg = function(){
                        if ($("#modal_bg").length > 0) {
                            $('#modal_bg').remove();
                        }
                        if(is_mobile()){
                            $("#modal_bg").css("top", $(window).scrollTop());
                        }
                        $("<div/>", {
                            id: "modal_bg",
                            'class': "modal_bg",
                            css: {
                                'width': '100%',
                                'height': document.body.clientHeight
                            }
                        }).appendTo("body");
                        $('#modal_bg').fadeTo('fast', '0.50');
                        $('#modal_bg').on('click', function () {
                            close();
                        });
                    };
                    var show_overlay = function(overlay_top, overlay_left, total_width, total_height){
                        $("#overlay").hide().fadeTo("slow", 1).show().css({ 'left': overlay_left, 'width': total_width, 'height': total_height });
                        $("#overlay").css('top', overlay_top + $(window).scrollTop());
                        fob.reposition();
                    };
                    var close = function () {
                        $("#overlay").fadeOut();
                        $('#modal_bg').hide();
                    };
                    $(document).ready(function () {
                        $('.' + o.css_class).on('click', function () {
                            fob.init($(this));
                            return false;
                        });
                    });
                    if(o.sticky){
                        $(window).resize(function () {
                            fob.reposition();
                        });
                        $(window).scroll(function () {
                            fob.reposition();
                        });
                    }else{
                        fob.reposition_bg();
                    }
                    if(o.show){
                        fob.init($(this));
                    }else if(o.close){
                        close();
                    }
                    if (typeof (callback) === 'function') {
                        callback();
                    }
                    /*End Private*/
                }
            });
        }
    });
    $(document).ready(function () {
        $('body').overlay({start: true});
    });
})(jQuery);