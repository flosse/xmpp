$(document).ready(function() {
	jQuery.timeago.settings.allowFuture = true;
	
	function timeSpan(from, to) {
		function tD(d) {
			if (d < 10) {
				return "0" + d;
			}
			return d;
		}
		
		var str;
		str = tD(from.getHours()) + ":" + tD(from.getMinutes()) + " - " + tD(to.getHours()) + ":" + tD(to.getMinutes());
		return str;
	}
	
	function gotFile(data, textStatus) {
		function eventCmp(a, b) {
			if (a.start < b.start) { return -1; }
			if (a.start > b.start) { return 1; }
			return 0;
		}
		
		var eventData = new Array();
		var ical = $.icalendar.parse(data);
		
		var now = new Date();
		for (var i=0; i < ical.vevent.length; i++) {
			var event = ical.vevent[i];
			if (event.dtstart >= now) {
				var allDay = false;
				if (event.dtend - event.dtstart == 60 * 60 * 24 * 1000) { allDay = true; }
				eventData.push({	"id": i,
									"start": event.dtstart ,
									"end": event.dtend ,
									"title": event.summary,
									"allday": allDay});
			}
		}
		eventData.sort(eventCmp);
		eventData.length = 5;
		$("h3#upcomingevents").fadeIn();
		for (var i=eventData.length - 1; i >= 0; i--) {
			var ev = eventData[i];
			if (ev.allday) {
				$("h2#upcoming").after("<p class='nav'>"ev.title + "[" + ev.start.getFullYear() + "-" + (ev.start.getMonth() + 1) + "-" + ev.start.getDate() + "]</p>");
			} else {
				$("h2#upcoming").after("<p class='nav'>"ev.title + " [" + ev.start.getFullYear() + "-" + (ev.start.getMonth() + 1) + "-" + ev.start.getDate() + "  " + timeSpan(ev.start, ev.end) + "]</p>");
			}
		}
	}
	$.get("/calendar/xsf-all.ics", null, gotFile, "text");
});