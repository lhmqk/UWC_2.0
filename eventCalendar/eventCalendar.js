var events = []
events=parselocalstorage('events')
var renderPopup = function (jsEvent, start, end, calEvent) {
    var $popup = $('#calendar-popup');
    var $eventForm = $('#event-form');
    $event = $('#event');
    var $selectedElmt = $(jsEvent.target);

    var relativeStartDay = start.calendar(null, { lastDay: '[yesterday]', sameDay: '[today]'});
    var endNextDay = '';

    if(relativeStartDay === 'yesterday') {
        endNextDay = '[Today at] ';
    }
    else if(relativeStartDay === 'today') {
        endNextDay = '[Tomorrow at] ';
    }
    else {
        endNextDay = 'dddd ';
    }

    $('.start-time').html(
    ' <p><i class="fa fa-play" aria-hidden="true"></i>' + (start.isSameOrBefore(moment()) ? 'Started' : 'Starts') + '</p>'
        + '<time datetime="' + start.format() + '">'
        + start.calendar(null, {
        lastWeek: 'L LT',
        nextWeek: 'dddd LT',
        sameElse: 'L LT'
        })
        + '</time>'
    );
    $('.end-time').html(
    '<p><i class="fa fa-stop" aria-hidden="true"></i> '
        + (end.isSameOrBefore(moment()) ? 'Ended' : 'Ends')
        + (end.isSame(start, 'day') ? ' at' : '')
        + '</p>'
        + '<time datetime="' + end.format() + '">'
        + end.calendar(start, {
        sameDay: 'LT',
        nextDay: endNextDay + 'LT',
        nextWeek: 'dddd LT',
        sameElse: 'L LT'
        })
        + '</time>'
    );

    if(calEvent) {
        $eventForm.hide();
        $event.children('header').html(`<i class="fa fa-calendar-o"></i>`+calEvent.title);
        $event.find('.employee').text(calEvent.employee ? calEvent.employee : '(No employee information.)');
        $event.find('.details').text(calEvent.details ? calEvent.details : '');
        $event.show();
    }
    else {
        $event.hide();  
        $('#event-start').val(start.format('YYYY-MM-DD[T]HH:mm'));
        $('#event-end').val(end.format('YYYY-MM-DD[T]HH:mm'));
        $eventForm.show();
    }

    var leftPosition = 0;
    var $prong = $('.prong');
    var prongPos = 0;

    if($selectedElmt.hasClass('fc-highlight')) {
        leftPosition = $selectedElmt.offset().left - $popup.width() + ($selectedElmt.width() / 2);
        if(leftPosition <= 0) {
            leftPosition = 5;
            prongPos = $popup.width() - $selectedElmt.offset().left - 30
        }
        else {
            prongPos = 15;
        }
        $popup.css('left', leftPosition);
        $prong.css({
            'left': '',
            'right': prongPos,
            'float': 'right'
        });
    }
    else {
        leftPosition = jsEvent.originalEvent.pageX - $popup.width()/2;
        if(leftPosition <= 0) {
            leftPosition = 5;
        }
        prongPos = jsEvent.originalEvent.pageX - leftPosition - ($prong.width() * 1.7);
        $popup.css('left', leftPosition);
        $prong.css({
            'left': prongPos,
            'float': 'none',
            'right': ''
        });
    }

    var topPosition = (calEvent ? jsEvent.originalEvent.pageY : $selectedElmt.offset().top) - $popup.height() - 15;

    if((topPosition <= window.pageYOffset)
    && !((topPosition + $popup.height()) > window.innerHeight)) {
        $popup.css('top', jsEvent.originalEvent.pageY + 15);
        $prong.css('top', -($popup.height() + 12))
        .children('div:first-child').removeClass('bottom-prong-dk').addClass('top-prong-dk')
        .next().removeClass('bottom-prong-lt').addClass('top-prong-lt');
    }
    else {
        $popup.css('top', topPosition);
        $prong.css({'top': 0, 'bottom': 0})
        .children('div:first-child').removeClass('top-prong-dk').addClass('bottom-prong-dk')
        .next().removeClass('top-prong-lt').addClass('bottom-prong-lt');
    }

    $popup.show();
    $popup.find('input[type="text"]:first').focus();
}

$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
        left: 'title',
        right: 'prev,next today'
        },
        timezone: 'local',
        defaultView: 'month',
        allDayDefault: false,
        allDaySlot: false,
        slotEventOverlap: true,
        slotDuration: "01:00:00",
        slotLabelInterval: "01:00:00",
        snapDuration: "00:15:00",
        contentHeight: 700,
        scrollTime :  "8:00:00",
        axisFormat: 'h:mm a',
        timeFormat: 'h:mm A()',
        selectable: true,
        events: function(start, end, timezone, callback) {
            let arr = parselocalstorage('events')  
            callback(arr);
        },
        eventColor: '#008080',
        eventClick: function (calEvent, jsEvent) {
            renderPopup(jsEvent, calEvent.start, calEvent.end, calEvent);
        },
        eventRender: function(event, element) {
            element.append( `<span class='I_delete'><i class="fa fa-remove fa-2x"></i></span>` );
            element.append( `<span class='I_edit'><i class="fa fa-edit fa-2x"></i></span>` );
            element.find(".I_delete").click(function() {
                $('#calendar-popup').hide();
                if(confirm('are you sure want to delete event?')) {
                    $('#calendar').fullCalendar('removeEvents',event._id);
                    var index=events.map(function(x){ return x.id; }).indexOf(event.id);
                    events.splice(index,1);
                    localStorage.setItem('events', JSON.stringify(events));
                    events=parselocalstorage('events')   
                }
            });
            element.find(".I_edit").click(function() {
                $('#calendar-popup').hide();
                $('#taskname').val(event.title)
                $('#employee').val(event.employee)
                $('#eventdetails').val(event.details)
                $('input#eventstart').val(event.start._i)
                $('input#eventend').val(event.end._i)
                $('#simplemodal').show();
                //update events
                var that=event;
                $('#edit-form').on('submit', function(e) {
                    e.preventDefault();
                    $form = $(e.currentTarget);
                    $title = $form.find('input#taskname');
                    $employee = $form.find('input#employee');
                    $details = $form.find('textarea#eventdetails');
                    $start= $form.find('input#eventstart');
                    $end= $form.find('input#eventend');
                    //update value
                    that.title=$title.val();
                    that.employee=$employee.val();
                    that.details=$details.val();
                    that.start=$start.val();               
                    that.end=$end.val();
                
                    $('#calendar').fullCalendar('updateEvent', that);
                    console.log('after update',events)
                    $('#simplemodal').hide();
                    $('#calendar-popup').hide();
                });
                $('#calendar').fullCalendar('updateEvent', event);
            });
            
            $('#close-btnid').click(function(){
                $('#simplemodal').hide();
            })

            var modal=document.getElementById('simplemodal')

            window.addEventListener('click',clickOutside)
            function clickOutside(e){
                if(e.target==modal){
                    modal.style.display='none';
                }
            }
        }
        ,
        select: function(start, end, jsEvent) {
            $('.btn-primary').css('opacity',1)
            $('.btn-primary').click(function(){
                renderPopup(jsEvent, start.local(), end.local());
            }) 
            renderPopup(jsEvent, start.local(), end.local());
        }
    });

    $('#event-form').on('submit', function(e) {
        e.preventDefault();
        $form = $(e.currentTarget);
        $title = $form.find('input#event-title');
        $employee = $form.find('input#event-employee');
        $details = $form.find('textarea#event-details');
        $ID = '_' + Math.random().toString(36).substr(2, 9)
        events.push({
            id:$ID,
            title: $title.val(),
            start: $form.find('input#event-start').val(),
            end: $form.find('input#event-end').val(),
            employee: $employee.val(),
            details: $details.val()
        });

        $title.val('');
        $employee.val('');
        $details.val('');

        $form.parent().blur().hide();
        localStorage.setItem('events', JSON.stringify(events));
        $('#calendar').fullCalendar('refetchEvents');
    });

    //Set hide action for lost focus event
    $('#calendar-popup').on('focusout', function(e) {
        $this = $(this);
        if($this.is(':visible') && !$(e.relatedTarget).is('#calendar-popup, #calendar-popup *')) {
            $this.hide();
        }
    });
});


function parselocalstorage(name){
    var str= localStorage.getItem(name);
    var obj=JSON.parse(str)||[]
    let arr = Object.keys(obj).map((k) => obj[k])||[]
    return arr
}
