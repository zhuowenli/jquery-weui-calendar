/*
* @Author: 卓文理
* @Email : 531840344@qq.com
* @Desc  : 基于jQuery的多日期选择插件
*/

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function ($) {
    var ua = navigator.userAgent;
    var isMobile = /(iPhone|Android|Mobile)/.test(ua);
    var EVENT_TAP = isMobile && !jQuery ? 'tap' : 'click';

    var numToStr = function(n,num) {
        numStr = num.toString();
        var l = numStr.length;
        for (var i=1; i<= n - l;++i) {
            numStr = '0' + numStr;
        }
        return numStr;
    }

    var calendar = function(e, options) {
        options = options || {};

        if (options.checkIn && typeof options.checkIn === 'string') {
            options.checkIn = new Date(options.checkIn) || new Date();
        }
        if (options.checkOut && typeof options.checkOut === 'string') {
            options.checkOut = new Date(options.checkOut) || new Date();
        }

        this.classWeek   = options.classWeek || 'calendar-week';
        this.classTitle   = options.classTitle || 'calendar-title';
        this.classMonth   = options.classMonth || 'calendar-month';
        this.classDay   = options.classDay || 'calendar-day';
        this.classDayBase   = options.classDayBase || 'line2';
        this.classDaySelect = options.classDaySelect || 'cal_select';
        this.classDayPass = options.classDayPass || 'old';
        this.checkedday = options.checkedday || 'checkedday';
        this.class   = options.class || '';
        this.class   = options.class || '';
        this.prependHtml   = options.prependHtml || '';
        this.today   = options.today || new Date();

        this.fillDayInfo = options.fillDayInfo || null;
        this.getDayInfo  = options.getDayInfo || null;
        this.dayText     = options.dayText || ['开始', '结束'];

        this.checkState = 0;
        this.doColor = false;

        this.checkIn      = options.checkIn || null;
        this.checkOut     = options.checkOut || null;
        this.checkDayChange = options.checkDayChange || function(){};
        this.setDay = new Date();
        this.dateArray      = [];
        this.monthArray     = [];
        this.calendarHTML   = '';
        this.totalMohth     = options.totalMohth || 6;
        this.firstGray = false;
        this.markAsGray = false;

        this.e = typeof(e) == 'object' ? e : $(e);

        this.init();

        return(this);
    }

    calendar.prototype.init = function() {
        this.dateArray      = [];
        this.monthArray     = [];
        this.calendarHTML   = '';
        this.checkState = 0;
        this.gengerateCalArray().gengerateCalHtml().fillCalender();
        this.bindEvent();
        return(this);
    }
    calendar.prototype.setYmd = function(y,m,d, isDisplay) {
        var cdate = new Date();
        this.setDay = new Date();
        m = isDisplay ? m - 1 : m;
        cdate.setDate(1);
        cdate.setMonth(m);
        cdate.setFullYear(y);
        cdate.setDate(d);
        return cdate;
    }
    calendar.prototype.getYmd = function(s) {
        return s.getFullYear() + '-' + numToStr(2,s.getMonth() + 1) + '-' + numToStr(2,s.getDate());// + '  ' + s.getDay();
    }

    calendar.prototype.gengerateCalArray = function() {
        for (var i = 0; i <= this.totalMohth; i++) {
            var toMonth = this.setDay.getMonth();
            for (var j = 1; j <= 37; j++) {
                this.setDay.setDate(j);
                if (this.setDay.getMonth() != toMonth){
                    break;
                }
                this.dateArray.push({y:this.setDay.getFullYear(),m:this.setDay.getMonth(),d:this.setDay.getDate(),w:this.setDay.getDay()});
            };
        };
        this.firstDate = this.dateArray[0];
        this.lastDate  = this.dateArray[this.dateArray.length -1];
        return(this);
    }

    calendar.prototype.gengerateCalHtml = function() {
        this.calendarHTML = '';
        this.monthArray = [];
        var m = -1;
        var len = this.dateArray.length - 1;
        for (var i = 0; i <= len; i++) {
            var day = this.dateArray[i];
            var cc = this.setYmd(day.y,day.m,day.d,false);
            if (m == -1) m = day.m;
            if (m != day.m) {
                this.calendarHTML += this.genMonth();
                this.monthArray = [];
                m = day.m;
            }
            this.monthArray.push(day);
        };
        return(this);
    }

    calendar.prototype.genDate = function(day) {
        var writeDay = this.setYmd(day.y,day.m,day.d,false);
        var old = '';
        var checkDay = '';
        var isToday = this.getYmd(writeDay) == this.getYmd(this.today) ? 1 : 0;
        var dayText = isToday ? '今天' : day.d;
        if (writeDay < this.today) old = this.classDayPass;
        if ((this.checkIn && writeDay <= this.checkOut && writeDay > this.checkIn) ||
            (this.checkOut && this.getYmd(writeDay) == this.getYmd(this.checkOut))) {
            checkDay = this.classDaySelect + ' ' + this.checkedday;
        }
        if (this.checkIn && this.getYmd(writeDay) == this.getYmd(this.checkIn)) dayText = this.dayText[0];
        if (this.checkOut && this.getYmd(writeDay) == this.getYmd(this.checkOut)) dayText = this.dayText[1];

        var li_classes = [this.classDayBase, old, checkDay];
        var li_html =  '<li class="'+ li_classes.join(' ') +'" d="'+day.d+'" m="'+day.m+'" y="'+day.y+'" w="'+day.w+'" today="'+isToday+'" ymd="'+this.getYmd(writeDay)+'" ><span>'+ dayText +'</span></li>';
        var new_html = '';
        if ( this.fillDayInfo) new_html = this.fillDayInfo(li_html);
        return new_html == '' ? li_html : new_html;
    }

    calendar.prototype.genMonth = function() {
       var dayHtml = '';
        var len = this.monthArray.length - 1;
        for (var i = 0; i <= len ; i++) {
            var day = this.monthArray[i];
            if (i==0) dayHtml+=this.genEmptyDay(day.w);
            var dayHtml = dayHtml + this.genDate(day);
        };
        dayHtml+=this.genEmptyDay(6 - day.w);
        var preHtml =
        '<div class="'+this.classMonth+'">'+
            '<div class="'+this.classTitle+'">'+
                '<h2 cury="'+day.y+'" curm="'+(day.m + 1)+'">'+day.y+'年'+(day.m + 1)+'月</h2>'+
            '</div>'+
            '<ul class="'+this.classWeek+'">'+
                '<li>日</li>' +
                '<li>一</li>' +
                '<li>二</li>' +
                '<li>三</li>' +
                '<li>四</li>' +
                '<li>五</li>' +
                '<li>六</li>' +
            '</ul>';
        var afterHtml = '</div>';
        return preHtml + '<ul class="'+this.classDay+'">'+dayHtml+'</ul>' + afterHtml;
    }

    calendar.prototype.genEmptyDay = function(num) {
        var emptyday = '';
        for (var i = 1; i<= num; i++) {
            emptyday+='<li class="'+this.classDayPass+' '+this.classDayBase+'"></li>';
        }
        return emptyday;
    }

    calendar.prototype.fillCalender = function() {
        this.e.html(this.prependHtml + this.calendarHTML);
        return(this);
    }
    calendar.prototype.clearSelect = function() {
        var _this = this;
        this.e.find('.' + _this.checkedday + ',' + '.' + this.classDaySelect).each(function(){
            //$(this).find('span').html($(this).attr('d'));
            if ($(this).attr('today') == '1') {
                $(this).find('span').html('今天');
            } else {
                $(this).find('span').html($(this).attr('d'));
            }
            if (_this.fillDayInfo) _this.fillDayInfo($(this));
        })
        .removeClass(_this.checkedday);
        this.e.find('.' + this.classDaySelect).removeClass(this.classDaySelect);
        this.checkOut = null;
        this.checkIn  = null;
        this.firstGray = false;
        this.markAsGray = false;
        return(this);
    }

    calendar.prototype.bindEvent = function() {
        var _this = this;

        this.e.find('.' + this.classDayBase).on(EVENT_TAP, function(){
            if ($(this).hasClass(_this.classDayPass)) return false;
            if ($(this).hasClass('cal_noRoom')) return false;
            var thisday = $(this).find('span');
            var me = $(this);
            if (me.hasClass(_this.checkedday)) {
                _this.clearSelect();

                if (_this.checkIn && !_this.checkOut) {
                } else {
                _this.refreshCheckState();
                return false;
                }
            }
            if (!_this.checkIn && !_this.checkOut) {
                $('.' + _this.checkedday).removeClass(_this.checkedday);
                $(this).addClass(_this.checkedday);
            } else if (_this.checkIn && !_this.checkOut) {
                $(this).addClass(_this.checkedday);
            } else if (_this.checkIn && _this.checkOut) {
                _this.clearSelect();
                $(this).addClass(_this.checkedday);
            } else if (!_this.checkIn && _this.checkOut) {
                alert('出错了,请刷新页面');
            }
            $(this).toggleClass(_this.classDaySelect);
            _this.refreshCheckState();
        })
        return(this);
    }
    calendar.prototype.refreshCheckState = function() {
        _this = this;
        var checkedday = this.e.find('.' + _this.checkedday);
        var checkFirst = checkedday.first();
        var checkLast = checkedday.last();

        checkLast.find('span').html(this.dayText[1]);
        checkFirst.find('span').html(this.dayText[0]);
        if (_this.fillDayInfo) {
            this.fillDayInfo(checkLast);
            this.fillDayInfo(checkFirst);
        }

        var leaveday = checkLast.attr('ymd');
        var enterday = checkFirst.attr('ymd');
        this.doColor = leaveday == enterday ? false : true;

        doColorState = false;

        if (checkFirst.length) {
            this.checkIn = this.setYmd(checkFirst.attr('y'),checkFirst.attr('m'),checkFirst.attr('d'));
        }
        if(leaveday != enterday) {
            this.checkOut = this.setYmd(checkLast.attr('y'),checkLast.attr('m'),checkLast.attr('d'));
        }
        this.e.find('.' + this.classDayBase).not('.old').each(function(){
            var liYmd = $(this).attr('ymd');
            if (_this.doColor) {
                if ($(this).hasClass(_this.classDaySelect)) doColorState = !doColorState;
                if (doColorState){
                    $(this).addClass(_this.classDaySelect);
                    $(this).addClass(_this.checkedday);
                    if (_this.getDayInfo) _this.getDayInfo($(this));
                }
            }
            if (_this.fillDayInfo) _this.fillDayInfo($(this));
        })
        this.checkDayChange();
        return(this);
    }

    $.fn.extend({
        MultiCalendar: function(options) {
            if (this[0].tagName === 'DIV') {
                new calendar(this, options);
            }
            if (this[0].tagName === 'INPUT') {
                new CalendarBox (this, options);
            }
        },
    });


    Date.prototype.format = function(formatStr) {
        var str = formatStr;
        var Week = ['日','一','二','三','四','五','六'];

        str = str.replace(/yyyy|YYYY/,this.getFullYear());
        str = str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

        str = str.replace(/MM/,this.getMonth()>8?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));
        str = str.replace(/M/g,this.getMonth()+1);

        str = str.replace(/w|W/g,Week[this.getDay()]);

        str = str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
        str = str.replace(/d|D/g,this.getDate());

        str = str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
        str = str.replace(/h|H/g,this.getHours());
        str = str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
        str = str.replace(/m/g,this.getMinutes());

        str = str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
        str = str.replace(/s|S/g,this.getSeconds());

        return str;
    }

    var CalendarBox = function (e, options) {
        var $input = this.$input = typeof(e) == 'object' ? e : $(e);

        this.fillHTML(options);
        this.init(options);
        this.bindEvent(options);
    }

    CalendarBox.prototype.init = function(options){
        var $input = this.$input;
        var $checkinDate = $('#checkin-date');
        var $checkoutDate = $('#checkout-date');
        var $totalDays = $('#total-days');

        $.extend(options, {
            checkDayChange: function(){
                if (this.checkOut == null && this.checkOut == null) {
                    $checkinDate.html('请选择');
                    $checkoutDate.html('请选择');
                }
                if (this.checkIn ) {
                    $checkinDate.html(this.checkIn.format('yyyy-MM-dd'));
                    $checkoutDate.html('请选择');
                }
                if (this.checkOut ) {
                    $checkoutDate.html(this.checkOut.format('yyyy-MM-dd'));
                }

                $totalDays.text('_');

                if (this.checkIn && this.checkOut) {
                    var totalDays = parseInt(Math.abs((this.checkOut - this.checkIn) / 1000 / 60 / 60 /24));

                    $totalDays.text(' ' + totalDays + ' ');
                }
            }
        });

        $input.attr('placeholder', "请选择");
        $input.attr('readonly', '');
    }

    CalendarBox.prototype.fillHTML = function(options) {
        var title = options.title || '时间选择';
        var html = '\
            <div class="weui-calendar-container">\
                <div class="page">\
                    <div class="fixed-room">\
                        <div class="toolbar"><div class="toolbar-inner"><a href="javascript:;" class="cancel-button btn-cancel">取消</a><a href="javascript:;" class="picker-button btn-close">确定</a><h1 class="title">$title</h1></div></div>\
                        <div class="weui_cells_access">\
                            <div class="weui_cell">\
                                <div class="weui_cell_bd weui_cell_primary">\
                                    $start时间：<em id="checkin-date">请选择</em>\
                                </div>\
                                $checkin-value\
                            </div>\
                            <div class="weui_cell">\
                                <div class="weui_cell_bd weui_cell_primary">\
                                    $end时间：<em id="checkout-date">请选择</em>\
                                </div>\
                                $checkout-value\
                            </div>\
                        </div>\
                    </div>\
                    <div class="weui-calendar-centent">\
                        <div id="calendar-box" class="calendar"></div>\
                    </div>\
                </div> \
            </div> \
        ';

        if (options.valueTypes && options.valueTypes.length) {
            html = html.replace(/\$checkin\-value/gi,
                '<div class="weui_cell_ft"><input id="checkin-value" class="weui_input" type="text" value="请选择"></div>');
            html = html.replace(/\$checkout\-value/gi,
                '<div class="weui_cell_ft"><input id="checkout-value" class="weui_input" type="text" value="请选择"></div>');
        } else {
            html = html.replace(/\$checkin\-value/gi, '');
            html = html.replace(/\$checkout\-value/gi, '');
        }

        html = html.replace(/\$title/gi, title);
        html = html.replace(/\$start/gi, options.dayText ? options.dayText[0] : '开始');
        html = html.replace(/\$end/gi,  options.dayText ? options.dayText[1] : '结束');

        var $calendar = $(html);

        $(document.body).append($calendar);
    }

    CalendarBox.prototype.bindEvent = function(options) {
        var $input = this.$input;
        var $calendar = $('.weui-calendar-container');
        var $calendarBox = $('#calendar-box');
        var $checkinDate = $('#checkin-date');
        var $checkoutDate = $('#checkout-date');
        var $checkinValue = $("#checkin-value");
        var $checkoutValue = $("#checkout-value");
        var $btnClose = $calendar.find('.btn-close');
        var $btnCancel = $calendar.find('.btn-cancel');

        var _calendar;

        $input.on(EVENT_TAP, function(){
            var _start_time = $input.data('start-time');
            var _end_time = $input.data('end-time');

            if (_start_time && _end_time) {
                $.extend(options, {
                    checkIn: new Date(_start_time),
                    checkOut: new Date(_end_time),
                });
                $checkinDate.html(options.checkIn.format('yyyy-MM-dd'));
                $checkoutDate.html(options.checkOut.format('yyyy-MM-dd'));
            }

            $calendar.show();
            _calendar = new calendar($calendarBox, options);

            setTimeout(function() {
                $calendar.addClass('weui-calendar-container-visible');
            }, 50);

            if (options.valueTypes && options.valueTypes.length) {
                var _start_value = $input.data('start-value');
                var _end_value = $input.data('end-value');

                $checkinValue.select({
                  title: "请选择",
                  items: options.valueTypes
                });
                $checkoutValue.select({
                  title: "请选择",
                  items: options.valueTypes
                });

                if (_start_value && _end_value) {
                    $checkinValue.val(eachValue(null, _start_value));
                    $checkoutValue.val(eachValue(null, _end_value));
                }
            }
        });
        $btnClose.on(EVENT_TAP, function() {
            $calendar.removeClass('weui-calendar-container-visible');

            setTimeout(function() {
                $calendar.hide();
            }, 300);

            var checkIn = _calendar.checkIn ? _calendar.checkIn.format('yyyy-MM-dd') : null;
            var checkOut = _calendar.checkOut ? _calendar.checkOut.format('yyyy-MM-dd') : null;
            var checkinValue = $checkinValue.val() ? $checkinValue.val().replace('请选择', '') : '';
            var checkoutValue = $checkoutValue.val() ? $checkoutValue.val().replace('请选择', '') : '';

            if (checkIn && checkOut) {
                $input.attr('data-start-value', eachValue(checkinValue));
                $input.attr('data-end-value', eachValue(checkoutValue));
                $input.attr('data-start-time', _calendar.checkIn.format('yyyy-MM-dd'));
                $input.attr('data-end-time', _calendar.checkOut.format('yyyy-MM-dd'));

                if (options.valueTypes && options.valueTypes.length) {
                    $input.val(checkIn + ' ' + checkinValue + ' 至 ' + checkOut + ' ' + checkoutValue);
                } else {
                    $input.val(checkIn + ' 至 ' + checkOut);
                }
            } else {
                $input.val('');
                $input.removeAttr('data-start-value');
                $input.removeAttr('data-end-value');
                $input.removeAttr('data-start-time');
                $input.removeAttr('data-end-time');
            }
        });
        $btnCancel.on(EVENT_TAP, function(){
            $calendar.removeClass('weui-calendar-container-visible');

            setTimeout(function() {
                $calendar.hide();
            }, 300);
        });

        function eachValue(title, value) {
            for(var inx in options.valueTypes) {
                var type = options.valueTypes[inx];

                if (title && type.title === title) {
                    return type.value;
                }
                if (value && type.value === value) {
                    return type.title;
                }
            }
        }
    }
}));