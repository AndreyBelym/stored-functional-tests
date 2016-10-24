"@fixture scroll";
"@page http://localhost:3002/scroll/index.html";

var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;

"@test"["Scroll to an element"] = {
    "1.Hover over div": function () {
        act.hover("#div1", {
            offsetX: 10,
            offsetY: 10
        });
    },
    "2.Assert":         function () {
        eq($(window).scrollLeft(), 1333 + 984 - clientWidth);
        eq($(window).scrollTop(), 1030 + 487 - clientHeight);
    }
};

"@test"["Scroll to the point of the scrolled element"] = {
    "1.Hover over div": function () {
        act.hover("#div1", {
            offsetX: 380,
            offsetY: 280
        });
    },
    "2.Assert":         function () {
        eq($(window).scrollLeft(), 1333 + 984 - clientWidth);
        eq($(window).scrollTop(), 1030 + 487 - clientHeight);
        eq($("#div1").scrollLeft(), 130);
        eq($("#div1").scrollTop(), 130);
    }
};

"@test"["Scroll to the nested scrolled element"] = {
    "1.Hover over div": function () {
        $('#div2').scrollLeft(500);
        $('#div2').scrollTop(500);

        act.hover("#div2", {
            offsetX: 0,
            offsetY: 0
        });
    },
    "2.Assert":         function () {
        eq($(window).scrollLeft(), 1333 + 984 - clientWidth);
        eq($(window).scrollTop(), 1030 + 487 - clientHeight);
        eq($("#div1").scrollLeft(), 267);
        eq($("#div1").scrollTop(), 167);
        eq($("#div2").scrollLeft(), 0);
        eq($("#div2").scrollTop(), 0);
    }
};

"@test"["Scroll to scrolled document point"] = {
    "1.Hover over body": function () {
        act.hover(document.documentElement, {
            offsetX: 2e3,
            offsetY: 1300
        });
    },
    "2.Assert":          function () {
        eq($(window).scrollLeft(), 1083 + 984 - clientWidth);
        eq($(window).scrollTop(), 880 + 487 - clientHeight);
    }
};

"@test"["Don't scroll if the element is visible"] = {
    "1.Hover over div": function () {
        window.scroll(1815, 1046);
        
        this.scrollLeft = $(window).scrollLeft();
        this.scrollTop = $(window).scrollTop();
        
        act.hover("#div1", {
            offsetX: 10,
            offsetY: 10
        });
    },
    "2.Assert":         function () {
        eq($(window).scrollLeft(), this.scrollLeft);
        eq($(window).scrollTop(), this.scrollTop);
    }
};

"@test"["Scroll to the scrolled iframe point"] = {
    "1.Scroll to iframe": inIFrame('#iframe', function () {
        act.hover(document.documentElement, {
            offsetX: 500,
            offsetY: 400
        });
    }),

    "2.Assert": function () {
        eq($(window).scrollLeft(), 1645 + 984 - clientWidth);
        eq($(window).scrollTop(), 1646 + 487 - clientHeight);
    },

    "3.Assert in iframe": inIFrame('#iframe', function () {
        eq($(window).scrollLeft(), 267);
        eq($(window).scrollTop(), 267);
    })
};

"@test"["Scroll to element when page doesn't have DOCTYPE"] = {
    "0.": function () {
        act.navigateTo('gh-883.html');
    },
    "1.": function () {
        act.hover('#target');
    }
};