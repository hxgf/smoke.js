$(function() {

    $('.btn').on('click', function () {

        for(i = 0; i < 3; i++) {
            smoke.alert('Hey, you!' + i, function(e) {

            }, {
                ok: "Got it! " + i,
                cancel: "Nope " + i,
                classname: "cancel-classname-" + i
            });
        }
    });

});
