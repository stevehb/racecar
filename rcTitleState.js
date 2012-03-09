RC = RC || {};

RC.TitleState = function() {
    // display the logo and start button
    $("#img-logo").show();
    $("#img-start").show();

    // position logo and start button
    var canvasWidth = $("#canvas-container").width();
    var canvasHeight = $("#canvas-container").height();
    var leftOffset = (canvasWidth - $("#img-logo").width()) / 2;
    var topOffset = 30;
    $("#img-logo").css({ 
        "left" :  leftOffset,
        "top" : topOffset
    });
    leftOffset = (canvasWidth - $("#img-start").width()) / 2;
    topOffset = (canvasHeight - $("#img-start").height()) / 2;

    RC.log("canvasHeight=" + canvasHeight);
    RC.log("$('#img-logo').height()=" + $("#img-logo").height());
    RC.log("$('#img-start').height()=" + $("#img-start").height());
    RC.log("$('#img-logo').offset().top=" + $("#img-logo").offset().top);
    RC.log("setting leftOffset=" + leftOffset + ", topOffset=" + topOffset);

    $("#img-start").css({
        "left" : leftOffset,
        "top" : topOffset 
    });

    // add mouse listener
    $("#img-start").bind("click dblclick", function(ev) {
        $("#img-logo").fadeOut(1000);
        $("#img-start").fadeOut(1000, function() {
            RC.log("creating play state...");
            RC.stateStack.push(new RC.PlayState());
        });
    });

    this.update = function(elapsed) {
        // some sort of title animation?
    };

};
