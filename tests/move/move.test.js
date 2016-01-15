"@fixture move";
"@page http://localhost:3002/move/index.html";

var shadowUI = window['%hammerhead%'].shadowUI;

var userAgent = navigator.userAgent.toLowerCase();
var isIE11    = !!(navigator.appCodeName === 'Mozilla' && /Trident\/7.0/i.test(userAgent));
var isMSEdge  = !!(/Edge\//.test(userAgent));
var isIE      = /(msie) ([\w.]+)/.test(userAgent) || isIE11 || isMSEdge;

var events = [];

function bindHandlers () {
    $('*').on('mouseover mouseenter mouseout mouseleave mousemove', function (e) {
        var id   = this.id || this.tagName.toLowerCase();
        var type = e.type;

        console.log(id, '-', type, '-', e.clientX, e.clientY);

        events.push(id + '-' + type);
        e.stopPropagation();
    });
}

function getCursorUIElement () {
    return shadowUI.select('.cursor')[0];
}

function getIntValue (strValue) {
    return parseInt(strValue.replace('px', ''));
}

"@test"["Move to the element in the scrolled container"] = {
    "1.Hover over the target point": function () {
        var data = this;

        $('#point1').on('mousemove', function (e) {
            data.clientX = e.clientX;
            data.clientY = e.clientY;
        });

        bindHandlers();
        act.hover('#point1', {
            offsetX: 0,
            offsetY: 0
        });
    },

    "2.Check the events and move to the center element by default": function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mouseout',
                'point1-mousemove',
                'point1-mouseover',
                'point1-mouseenter',
                'point1-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mouseout',
                'point1-mouseover',
                'point1-mouseenter',
                'point1-mousemove',
                'point1-mousemove'
            ];
        }

        eq(events, expectedEvents);
        eq(this.clientX, 154);
        eq(this.clientY, 239);

        act.hover('#point1');
    },

    "3.Check event coordinates": function () {
        eq(this.clientX, 156);
        eq(this.clientY, 241);
    }
};

"@test"["Move between an iframe and top document"] = {
    "1.Bind handlers": function () {
        bindHandlers();

        $('body').mouseout(function (e) {
            $(this).data('mouseoutCtrlKey', e.ctrlKey);
        });
    },

    "2.Bind handlers in iframe": inIFrame('#iframe1', function () {
        bindHandlers();

        $('body').mouseout(function (e) {
            $(this).data('mouseoutCtrlKey', e.ctrlKey);
        });
    }),

    "3.Move into iframe": inIFrame('#iframe1', function () {
        var data = this;

        $('body').on('mouseover', function (e) {
            data.iframeBodyMouseOverX    = e.clientX;
            data.iframeBodyMouseOverY    = e.clientY;
            data.iframeBodyMouseOverCtrl = e.ctrlKey;
        });

        act.hover('body', {
            offsetX: 5,
            offsetY: 5,
            ctrl:    true
        });
    }),

    "4.Check events in top document": function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mouseout',
                'iframe1-mousemove',
                'iframe1-mouseover',
                'iframe1-mouseenter',
                'iframe1-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mouseout',
                'iframe1-mouseover',
                'iframe1-mouseenter',
                'iframe1-mousemove',
                'iframe1-mousemove'
            ];
        }

        ok($('body').data('mouseoutCtrlKey'));
        eq(events, expectedEvents);
        events = [];
    },

    '5.Check cursor position': function () {
        var cursorElement = getCursorUIElement();

        eq(getIntValue(cursorElement.style.left), isIE ? 74 : 73);
        eq(getIntValue(cursorElement.style.top), isIE ? 323 : 322);
    },

    "6.Check event in iframe": inIFrame('#iframe1', function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mousemove'
            ];
        }

        eq(this.iframeBodyMouseOverX, 12);
        eq(this.iframeBodyMouseOverY, 1);
        eq(this.iframeBodyMouseOverCtrl, true);

        eq(events, expectedEvents);
        events = [];
    }),

    "7.Move inside iframe": inIFrame('#iframe1', function () {
        act.hover('#point', {
            offsetX: 0,
            offsetY: 0
        });
    }),

    "8.Check events in top document": function () {
        eq(events, []);
        events = [];
    },

    '9.Check cursor position': function () {
        var cursorElement = getCursorUIElement();

        eq(getIntValue(cursorElement.style.left), isIE ? 99 : 98);
        eq(getIntValue(cursorElement.style.top), isIE ? 348 : 347);
    },

    "10.Check event in iframe": inIFrame('#iframe1', function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'body-mousemove',
                'body-mouseout',
                'point-mousemove',
                'point-mouseover',
                'point-mouseenter',
                'point-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'body-mousemove',
                'body-mouseout',
                'point-mouseover',
                'point-mouseenter',
                'point-mousemove',
                'point-mousemove'
            ];
        }

        eq(events, expectedEvents);
        events = [];
    }),

    "11.Move from iframe": function () {
        var data = this;

        $('#iframe1').on('mouseout', function (e) {
            data.iframeMouseOutX    = e.clientX;
            data.iframeMouseOutY    = e.clientY;
            data.iframeMouseOutCtrl = e.ctrlKey;
        });

        act.hover('body', {
            offsetX: 10,
            offsetY: 10,
            ctrl:    true
        });
    },

    "11.Check events in top document": function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'iframe1-mousemove',
                'iframe1-mouseout',
                'iframe1-mouseleave',
                'body-mousemove',
                'body-mouseover',
                'body-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'iframe1-mousemove',
                'iframe1-mouseout',
                'iframe1-mouseleave',
                'body-mouseover',
                'body-mousemove',
                'body-mousemove'
            ];
        }

        eq(this.iframeMouseOutX, 18);
        eq(this.iframeMouseOutY, 18);
        eq(this.iframeMouseOutCtrl, true);

        eq(events, expectedEvents);
    },

    '12.Check cursor position': function () {
        var cursorElement = getCursorUIElement();

        eq(getIntValue(cursorElement.style.left), 18);
        eq(getIntValue(cursorElement.style.top), 18);
    },

    "12.Check event in iframe": inIFrame('#iframe1', function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'point-mouseout',
                'point-mouseleave',
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mouseout',
                'body-mouseleave',
                'html-mousemove',
                'html-mouseover',
                'html-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'point-mouseout',
                'point-mouseleave',
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mouseout',
                'body-mouseleave',
                'html-mouseover',
                'html-mousemove',
                'html-mousemove'
            ];
        }

        eq(events, expectedEvents);
        ok($('body').data('mouseoutCtrlKey'));
    })
};

"@test"["Check IsInRectangle"] = {
    "1.Bind handlers": function () {
        bindHandlers();
    },

    "2.Bind handlers in iframe": inIFrame('#iframe1', function () {
        bindHandlers();
    }),

    "3.Move to iframe with offsets": function () {
        var data = this;

        act.hover('#iframe1', {
            offsetX: 15,
            offsetY: 15
        });
    },

    "4.Check events in top document": function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mouseout',
                'iframe1-mousemove',
                'iframe1-mouseover',
                'iframe1-mouseenter',
                'iframe1-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mouseout',
                'iframe1-mouseover',
                'iframe1-mouseenter',
                'iframe1-mousemove',
                'iframe1-mousemove'
            ];
        }

        eq(events, expectedEvents);
        events = [];
    },

    "5.Check event in iframe": inIFrame('#iframe1', function () {
        var expectedEvents = [];

        eq(events, expectedEvents);
        events = [];
    }),

    "6.Move inside iframe": inIFrame('#iframe1', function () {
        act.hover('#point', {
            offsetX: 0,
            offsetY: 0
        });
    }),

    "7.Check events in top document": function () {
        eq(events, []);
        events = [];
    },

    "8.Check event in iframe": inIFrame('#iframe1', function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mouseout',
                'point-mousemove',
                'point-mouseover',
                'point-mouseenter',
                'point-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mouseout',
                'point-mouseover',
                'point-mouseenter',
                'point-mousemove',
                'point-mousemove'
            ];
        }

        eq(events, expectedEvents);
        events = [];
    })
};

"@test"["Move from the scrolled iframe to the start of top document"] = {
    "1.Move into iframe with scroll": inIFrame('#iframe3', function () {
        act.hover('#point', {
            offsetX: 1,
            offsetY: 1
        });
    }),

    "2.Bind handlers": function () {
        bindHandlers();
    },

    "3.Bind handlers in iframe": inIFrame('#iframe3', function () {
        bindHandlers();
    }),

    "4.Move from iframe": function () {
        act.hover('body', {
            offsetX: 10,
            offsetY: 10
        });
    },

    "5.Check events in top document": function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'iframe3-mouseout',
                'iframe3-mouseleave',
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'iframe3-mouseout',
                'iframe3-mouseleave',
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mousemove'
            ];
        }

        eq(events, expectedEvents);
    },

    "6.Check event in iframe": inIFrame('#iframe3', function () {
        var expectedEvents = [
            'point-mouseout',
            'point-mouseleave'
        ];

        eq(events, expectedEvents);
    })
};

"@test"["Move between two iframes"] = {
    "1.Move into first iframe": inIFrame('#iframe1', function () {
        act.hover('#point', {
            offsetX: 1,
            offsetY: 1
        });
    }),

    "2.Bind handlers": function () {
        bindHandlers();
    },

    "3.Bind handlers in first iframe": inIFrame('#iframe1', function () {
        bindHandlers();
    }),

    "4.Bind handlers in second iframe": inIFrame('#iframe3', function () {
        bindHandlers();
    }),

    "5.Move into second iframe": inIFrame('#iframe3', function () {
        act.hover('#point', {
            offsetX: 1,
            offsetY: 1
        });
    }),

    "6.Check events in top document": function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'iframe1-mouseout',
                'iframe1-mouseleave',
                'body-mousemove',
                'body-mouseover',
                'body-mousemove',
                'body-mouseout',
                'iframe3-mousemove',
                'iframe3-mouseover',
                'iframe3-mouseenter',
                'iframe3-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'iframe1-mouseout',
                'iframe1-mouseleave',
                'body-mouseover',
                'body-mousemove',
                'body-mousemove',
                'body-mouseout',
                'iframe3-mouseover',
                'iframe3-mouseenter',
                'iframe3-mousemove',
                'iframe3-mousemove'
            ];
        }

        eq(events, expectedEvents);
        events = [];
    },

    "7.Check event in iframe": inIFrame('#iframe1', function () {
        var expectedEvents = [
            'point-mouseout',
            'point-mouseleave'
        ];

        eq(events, expectedEvents);
        events = [];
    }),

    "8.Check event in iframe": inIFrame('#iframe3', function () {
        var expectedEvents = [];

        if (isIE) {
            expectedEvents = [
                'html-mousemove',
                'html-mouseover',
                'html-mousemove',
                'html-mouseout',
                'point-mousemove',
                'point-mouseover',
                'point-mouseenter',
                'point-mousemove'
            ];
        }
        else {
            expectedEvents = [
                'html-mouseover',
                'html-mousemove',
                'html-mousemove',
                'html-mouseout',
                'point-mouseover',
                'point-mouseenter',
                'point-mousemove',
                'point-mousemove'
            ];
        }

        eq(events, expectedEvents);
        events = [];
    })
};

"@test"["Move after an active iframe is removed"] = {
    '1.Move into the first iframe': inIFrame('#iframe1', function () {
        act.hover('#point');
    }),

    '2.Bind handler and remove the iframe': function () {
        $('#point2').on('mouseover', function () {
            $(this).data('mouseover', true);
        });

        $('#iframe1').remove();
    },

    '3.Move to the point': function () {
        act.hover('#point2');
    },

    '4.Check event is raised': function () {
        ok($('#point2').data('mouseover'));
    }
};
