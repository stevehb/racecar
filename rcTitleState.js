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
    $("#img-start").css({
        "left" : leftOffset,
        "top" : topOffset 
    });

    // add mouse listener, create play state when faded out
    $("#img-start").bind("click dblclick", function(ev) {
        $("#img-logo").fadeOut(1000);
        $("#img-start").fadeOut(1000, function() {
            RC.log("creating play state...");
            RC.stateStack.push(new RC.PlayCountdownState());
        });
    });

    this.update = function(elapsed) {
        // some sort of title animation?
    };

};
