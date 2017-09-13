require('../../assets/images/Shop.png');
require('../../assets/images/Play.png');
export default class MainMenuState extends Phaser.State {
    preload() {
        this.game.load.image('shop_button', '/assets/Shop.png');
        this.game.load.image('play_button', '/assets/Play.png');
    }

    create() {
        var button_width = this.game.width / 2;
        var button_height = this.game.height / 10;
        this.game.stage.backgroundColor = '#182d3b';

        this.game.shopButton = this.game.add.button(button_width / 2, button_height * 2, 'shop_button', function(){this.game.state.start('Shop')}, this);
        this.game.playButton = this.game.add.button(button_width / 2, button_height * 6, 'play_button', function(){this.game.state.start('Play')}, this);
    }

    update() {
    }

};
