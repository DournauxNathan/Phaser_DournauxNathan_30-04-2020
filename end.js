class end extends Phaser.Scene {
    constructor() {
        super("end");
    }

    init() {

	}

	preload() {
	}

	create() {
		this.dJumpText = this.add.text(325, 300,'Thanks for playing');
	}

	update() {
	}
}