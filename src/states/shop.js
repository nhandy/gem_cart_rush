import shopconfig from '../../assets/json/shop_config.json';
export default class ShopState extends Phaser.State {
    preload() {
        this.game.load.image('back_button', '/assets/Back.png');
    }

    create() {
        this.game.stage.backgroundColor = '#182d3b';
        this.game.shopButton = this.game.add.button(0, 0, 'back_button', function(){this.game.state.start('MainMenu')}, this);
    }

    update() {
    }
};
