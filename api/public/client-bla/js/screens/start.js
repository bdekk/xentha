game.StartScreen = me.ScreenObject.extend({
    init : function () {
        // this.parent(true);
        this.font = new me.Font("Verdana", 12, "#fff", "center");
    },

    onResetEvent : function () {
        // var logo = new me.ImageLayer("logo", 0, 0, "logo", 2, 1);
        me.game.world.addChild(new me.ColorLayer("background", "#fff"), 0);
        // var logo = new me.ImageLayer("logo", 0, 0, "logo", 2, 1);
        // me.game.world.addChild(logo, 2);
        // me.game.add(logo, 2);
        // me.game.sort(game.sort);
        //
        // $('.name').css('visibility', 'visible');


        me.game.world.addChild(new game.gui.Button(global.WIDTH / 2, global.HEIGHT /2, "joinbutton"));
        me.game.world.addChild(new game.gui.Button(global.WIDTH / 2, global.HEIGHT / 2, "createbutton"));
        me.game.world.addChild(new game.gui.TextInput(global.WIDTH / 2, global.HEIGHT / 2, 'input', 10));


        // me.game.viewport.fadeOut("#000", 250);
    },


    onDestroyEvent: function() {
            me.game.viewport.fadeOut("#000", 250);
    },

    update: function () {
        if (me.input.isKeyPressed("action")) {
            me.input.unbindKey(me.input.KEY.ENTER, "action");

            global.state.playername = $("#nameinput :input").val().length > 0 ? $("#nameinput :input").val() : "Nameless";

            $('.name').hide();

            me.game.viewport.fadeIn("#000", 500, function () {
                me.state.change(me.state.LOBBY);
            });
        }

        return true;
    },

    draw: function (context) {
            var msg =  "Input your name and press enter to start";

            this.font.draw(
                context,
                msg,
                global.WIDTH / 2,
                global.HEIGHT - 120
            );

            this.parent(context);
    }
});
