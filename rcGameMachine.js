var RC = RC || {};

RC.GameMachine = function() {
    RC.GameStateEnum = {
        TITLE : { value : 0, name : "title" },
        PLAY_COUNT : { value : 1, name : "play_count" },
        PLAY_LIVE : { value : 2, name : "play_live" },
        WIN : { value : 3, name : "win" },
        LOSE : { value : 4, name : "lose" }
    };

    this.state = RC.GameStateEnum.TITLE;

    this.update = function(elapsed) {
        switch(this.state) {
        case RC.GameStateEnum.TITLE:
            // display title and wait for click
            // on click should load track, racers, etc
            this.state = RC.GameStateEnum.PLAY_COUNT;
            break;
        case RC.GameStateEnum.PLAY_COUNT:
            // display the world and do a 
            // countdown 3...2...1..GO!
            this.state = RC.GameStateEnum.PLAY_LIVE;
            break;
        case RC.GameStateEnum.PLAY_LIVE:
            // display race time, player laps, other HUD
            // elements, wait for win/lose condition
            break;
        case RC.GameStateEnum.WIN:
            // display win overlay, wait for click to reload
            break;
        case RC.GameStateEnum.LOSE:
            // display lose overlay, wait for click to reload
            break;
        }
    };
};
