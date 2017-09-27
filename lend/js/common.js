screen.orientation.lock('landscape')

//stars
paper.install(window);
var SQRT_3 = Math.pow(3, 0.5);
var triangle, D, mousePos, position;
var count = 50;

window.onload = function() {
    paper.setup('triangle-lost-in-space');

    D = Math.max(paper.view.getSize().width, paper.view.getSize().height);

    mousePos = paper.view.center.add([view.bounds.width / 3, 100]);
    position = paper.view.center;

    // Draw the BG
    var background = new Path.Rectangle(view.bounds);
    background.fillColor = '#1f516e';
    buildStars();
    triangle = new Triangle(50);

    paper.view.draw();

    paper.view.onFrame = function(event) {
        position = position.add( (mousePos.subtract(position).divide(10) ) );
        var vector = (view.center.subtract(position)).divide(10);
        moveStars(vector.multiply(3));
        triangle.update();
    };
};



// ---------------------------------------------------
//  Helpers
// ---------------------------------------------------
window.onresize = function() {
    var counter = 0;
    paper.view.size.width = window.innerWidth;
    paper.view.size.height = window.innerHeight;
    project.clear();
    // Draw the BG
    var background = new Path.Rectangle(view.bounds);
    background.fillColor = '#1f516e';
    buildStars();
    triangle.build(50);
};

var random = function(minimum, maximum) {
    return Math.round(Math.random() * (maximum - minimum) + minimum);
};

var map = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};


// ---------------------------------------------------
//  Triangle
// ---------------------------------------------------
var Triangle = function(a) {
    this.build(a);
};

Triangle.prototype.build = function(a) {
    // The points of the triangle
    var segments = [new paper.Point(0),
        new paper.Point(0),
        new paper.Point(0)];

    this.flameSize = 0;
    var flameSegments = [new paper.Point(0, this.flameSize),
        new paper.Point(0),
        new paper.Point(0)];

    this.flame = new Path({
        segments: flameSegments,
        closed: true,
        fillColor: 'rgba(0,0,0,0.1);'
    });
    this.ship = new Path({
        segments: segments,
        closed: true,
        fillColor: 'rgba(0,0,0,0.1);'
    });
    this.group = new Group({
        children: [this.flame, this.ship],
        position: view.center
    });
};

Triangle.prototype.update = function() {
    this.flame.segments[0].point.x = random(this.flame.segments[1].point.x, this.flame.segments[2].point.x);

    var dist = mousePos.subtract(paper.view.center).length;
    var angle = mousePos.subtract(paper.view.center).angle;
    var spread = map(dist, 0, D/2, 10, 30);

    this.flame.segments[0].point = paper.view.center.subtract(new Point({
        length: map(dist, 0, D/2, 2*this.flameSize/3, this.flameSize),
        angle: random(angle - spread, angle + spread)
    }));
};

Triangle.prototype.rotate = function() {
    var angle = paper.view.center.subtract(mousePos).angle - paper.view.center.subtract(this.ship.segments[0].point).angle;

    this.group.rotate(angle, paper.view.center);
};



// ---------------------------------------------------
//  Stars (from paperjs.org examples section)
// ---------------------------------------------------
window.onmousemove = function(event) {
    mousePos.x = event.x;
    mousePos.y = event.y;
    triangle.rotate();
};

var buildStars = function() {
    // Create a symbol, which we will use to place instances of later:
    var path = new Path.Circle({
        center: [0, 0],
        radius: 4,
        fillColor: 'rgba(255,255,255, .7)',
        strokeColor: 'rgba(255,255,255, .7)'
    });

    var symbol = new Symbol(path);

    // Place the instances of the symbol:
    for (var i = 0; i < count; i++) {
        // The center position is a random point in the view:
        var center = Point.random().multiply(paper.view.size);
        var placed = symbol.place(center);
        placed.scale(i / count + 0.01);
        placed.data = {
            vector: new Point({
                angle: Math.random() * 360,
                length : (i / count) * Math.random() / 5
            })
        };
    }

    var vector = new Point({
        angle: 45,
        length: 0
    });
};

var keepInView = function(item) {
    var position = item.position;
    var viewBounds = paper.view.bounds;
    if (position.isInside(viewBounds))
        return;
    var itemBounds = item.bounds;
    if (position.x > viewBounds.width + 5) {
        position.x = -item.bounds.width;
    }

    if (position.x < -itemBounds.width - 5) {
        position.x = viewBounds.width;
    }

    if (position.y > viewBounds.height + 5) {
        position.y = -itemBounds.height;
    }

    if (position.y < -itemBounds.height - 5) {
        position.y = viewBounds.height
    }
};

var moveStars = function(vector) {
    // Run through the active layer's children list and change
    // the position of the placed symbols:
    var layer = project.activeLayer;
    for (var i = 1; i < count + 1; i++) {
        var item = layer.children[i];
        var size = item.bounds.size;
        var length = vector.length / 10 * size.width / 10;
        item.position = item.position.add( vector.normalize(length).add(item.data.vector));
        keepInView(item);
    }
};






$(document).ready(function() {

    $('#fullpage').fullpage({
        autoScrolling: false,
    });

    $(".go-next").click(function() {
        var val = $("#select").val();
        var text = $("#select option:selected").text();

        if (val === "") {
            $("#select-selectized").fadeIn( 400 ).delay( 400 ).fadeOut( 400 );
        } else {
            $(".work-type").html( text );
            $.fn.fullpage.moveSectionDown();
        }
    });

    $(".go-back").click(function() {
        $.fn.fullpage.moveSectionUp();
    });


    $('#select').selectize({
        create: true,
        sortField: 'text'
    });

    var $select = $('select').selectize();
    var selectize = $select[0].selectize;



    var destination = "https://www.zaochnik.com";
    var receivedWorktypes = [];
    var worktypes = $.get(destination + '/rest/worktypes/');

    worktypes.done(function(data) {
        worktypes = data.results;

        receivedWorktypes = data.results;

        for (i = 0; i < receivedWorktypes.length; i++) {
            selectize.addOption({ value: receivedWorktypes[i].id, text: receivedWorktypes[i].title });
        }
    });



    var rega = /^\w+@\w+\.\w{2,4}$/i;

    $( "[name = email]" ).change(function() {
        var email = $('[name = email]').val();

        if(!rega.test(email)) {
            $('[name = email]').addClass('invalid');
            $('[name = email]').removeClass('valid');
        } else {
            $('[name = email]').addClass('valid');
            $('[name = email]').removeClass('invalid');
        }
    });

    $( "[name = theme]" ).change(function() {
        if( $('[name = theme]').val() === "" ) {
            $("[name = theme]").addClass('invalid');
            $("[name = theme]").removeClass('valid');
        }else {
            $("[name = theme]").addClass('valid');
            $("[name = theme]").removeClass('invalid');
        }
    });





    $(".main-form").submit(function (event) {
        event.preventDefault();


        var email = $('[name = email]').val();

        if(!rega.test(email)) {
            $('[name = email]').addClass('invalid');
            $('[name = email]').removeClass('valid');
        } else {
            $('[name = email]').addClass('valid');
            $('[name = email]').removeClass('invalid');
        }


        if( $('[name = theme]').val() === "" ) {
            $("[name = theme]").addClass('invalid');
            $("[name = theme]").removeClass('valid');
        }else {
            $("[name = theme]").addClass('valid');
            $("[name = theme]").removeClass('invalid');
        }




        if( $('[name = email]').val() === "" || !rega.test(email) ) {
            return;
        }

        // dataClient = {};
        // dataOrder = {};
        //
        // dataClient.email  = $('[name = email]').val();
        //
        // dataOrder.worktype     = $('[name = type]').val();
        // dataOrder.theme     = $("[name = theme]").val();
        // dataOrder.phone     = 80293046227;


        // var url = "https://www.zaochnik.com";

        // var client = $.post(url + "/rest/client/", dataClient, function (data, textStatus, jqXhr) {
        //     return data;
        // });
        //
        // client.done(function (data, textStatus, jqXhr) {
        //
        //     var token = data.Token;
        //
        //     document.cookie = "token=" + token + "; path=/; domain=." + 'zaochnik.com' + ";";
        //
        // var order = $.ajax({
        //         headers: {
        //             'token': token
        //         },
        //         url: destination + "/rest/client/orders/",
        //         type: "POST",
        //         data: JSON.stringify(dataOrder),
        //         contentType: "application/json"
        //     });
        //
        //     order.done(function (data, textStatus, jqXhr){
        //         console.log(textStatus);
        //         console.log(data);
        //     });

        //
        //     return
        // });


    });








    //button code
    function getRandom(min, max){
        return Math.random() * (max - min) + min;
    }

    var isSafari = /constructor/i.test(window.HTMLElement);
    var isFF = !!navigator.userAgent.match(/firefox/i);

    if (isSafari) {
        document.getElementsByTagName('html')[0].classList.add('safari');
    }

// Remove click on button for demo purpose
    Array.prototype.slice.call(document.querySelectorAll('.button'), 0).forEach(function(bt) {
        bt.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    initBt1();

// Button 1
    function initBt1() {
        var bt1 = document.querySelectorAll('#component-1')[0];
        var bt1c = document.querySelector('.button__container');
        var $circlesTopLeft = bt1.querySelectorAll('.circle.top-left');
        var $circlesBottomRight = bt1.querySelectorAll('.circle.bottom-right');

        var filter = document.querySelectorAll('#filter-goo-1 feGaussianBlur')[0];

        var tl = new TimelineLite();
        var tl2 = new TimelineLite();

        var btTl = new TimelineLite({
            paused: true,
            onUpdate: function() {
                filter.setAttribute('x', 0);
            },
            onComplete: function() {
                bt1c.style.filter = 'none';
            }
        });

        tl.to($circlesTopLeft, 1.2, { x: -25, y: -25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
        tl.to($circlesTopLeft[0], 0.1, { scale: 0.2, x: '+=6', y: '-=2' });
        tl.to($circlesTopLeft[1], 0.1, { scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
        tl.to($circlesTopLeft[2], 0.1, { scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
        tl.to($circlesTopLeft[0], 1, { scale: 0, x: '-=5', y: '-=15', opacity: 0 });
        tl.to($circlesTopLeft[1], 1, { scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
        tl.to($circlesTopLeft[2], 1, { scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');

        var tlBt1 = new TimelineLite();
        var tlBt2 = new TimelineLite();

        tlBt1.set($circlesTopLeft, { x: 0, y: 0, rotation: -45 });
        tlBt1.add(tl);

        tl2.to($circlesBottomRight, 1.2, { x: 25, y: 25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
        tl2.to($circlesBottomRight[0], 0.1, { scale: 0.2, x: '-=6', y: '+=3' });
        tl2.to($circlesBottomRight[1], 0.1, { scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
        tl2.to($circlesBottomRight[2], 0.1, { scale: 0.2, x: '+=15', y: '-=6' }, '-=0.1');
        tl2.to($circlesBottomRight[0], 1, { scale: 0, x: '+=5', y: '+=15', opacity: 0 });
        tl2.to($circlesBottomRight[1], 1, { scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
        tl2.to($circlesBottomRight[2], 1, { scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');

        tlBt2.set($circlesBottomRight, { x: 0, y: 0, rotation: -45 });
        tlBt2.add(tl2);

        btTl.add(tlBt1);
        btTl.to(bt1.parentNode.querySelectorAll('.button__bg'), 0.8, { scaleY: 1.1 }, 0.1);
        btTl.add(tlBt2, 0.2);
        btTl.to(bt1.parentNode.querySelectorAll('.button__bg'), 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 1.2);

        btTl.timeScale(2.6);

        bt1.addEventListener('mouseover', function() {
            bt1c.style.filter = 'url(#filter-goo-1)';
            btTl.restart();
        });

        bt1.addEventListener('click', function() {
            bt1c.style.filter = 'url(#filter-goo-1)';
            btTl.restart();
        });
    }



});
