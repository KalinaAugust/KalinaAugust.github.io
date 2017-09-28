$(document).ready(function() {

    $(".go-next").click(function() {
        var id = $("#select").val();
        var val = $("#select option:selected").text();

        if (id === "") {
            $("#select-selectized").fadeIn( 400 ).delay( 400 ).fadeOut( 400 );
        } else {
            var params = '?id=' + id + '&val=' + val;
            window.location.href = '/second.html' + params;
        }
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
            selectize.addOption({
                value: receivedWorktypes[i].id,
                text: receivedWorktypes[i].title
            });
        }
    });


});