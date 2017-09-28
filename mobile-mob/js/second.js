

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

    // get GET params
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });

    var val = $_GET["val"];
    var id = $_GET["id"];

    $(".work-type").html( val );

    // $(".go-back").click(function() {
    //
    // });



    var destination = "https://www.zaochnik.com";
    var receivedWorktypes = [];
    var worktypes = $.get(destination + '/rest/worktypes/');

    worktypes.done(function(data) {
        worktypes = data.results;

        receivedWorktypes = data.results;

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
        // dataOrder.worktype     = id;
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

});