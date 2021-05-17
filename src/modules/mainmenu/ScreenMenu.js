/**
 * Created by GSN on 7/6/2015.
 */

// generate random
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        this.sound = true;
        cc.audioEngine.setMusicVolume(0.7);
        this.checkSystemAndPlaySound("gamemusic", true);
        this.scrSize = cc.director.getVisibleSize();
        // add background
        this.background = cc.Sprite.create("assests/game/images/background-sheet0.png");
        // SCALE RATE
        this.SCALE_RATE = this.scrSize.width/this.background.getContentSize().width;
        this.background.setScale(this.SCALE_RATE);
        this.background.attr({
            x: this.scrSize.width/2,
            y: this.scrSize.height/2
        });
        this.background.setLocalZOrder(-10);
        this.addChild(this.background);

        // button start
        this.btnStart = cc.Sprite.create("assests/game/images/buttonstart-sheet0.png");
        this.btnStart.setScale(this.SCALE_RATE*1.5);
        this.btnStart.attr({ x: this.scrSize.width/2, y: this.scrSize.height/2 - this.scrSize.height/7 });
        this.btnStart.setLocalZOrder(5);
        this.addChild(this.btnStart);
        this.sunrays = cc.Sprite.create("assests/game/images/sunrays-sheet0.png");
        this.sunrays.setScale(this.SCALE_RATE*1.5);
        this.sunrays.attr({ x: this.scrSize.width/2, y: this.scrSize.height/2 - this.scrSize.height/7 });
        this.sunrays.setLocalZOrder(3);
        this.addChild(this.sunrays);
        this.btnStart.runAction(cc.repeat(cc.sequence(cc.scaleBy(1.5, 1.5),cc.scaleBy(1.5, 2/3)),3));
        this.sunrays.runAction(cc.repeat(cc.sequence(cc.scaleBy(1.5, 1.5),cc.scaleBy(1.5, 2/3)),3));

        // logo
        this.logo = cc.Sprite.create("assests/game/images/gamelogo-sheet0.png");
        this.logo.setScale(this.SCALE_RATE);
        this.logo.attr({ x: this.scrSize.width/2, y: this.scrSize.height/2 + this.scrSize.height/5 });
        this.logo.setLocalZOrder(5);
        this.addChild(this.logo);

        // generate item
        this.generateItem();

        // add event listener for layer to handle click start
        const cThis = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                // start button area
                let x1 = cThis.btnStart.getPositionX() - cThis.btnStart.getBoundingBox().width/2;
                let x2 = cThis.btnStart.getPositionX() + cThis.btnStart.getBoundingBox().width/2;
                let y1 = cThis.btnStart.getPositionY() - cThis.btnStart.getBoundingBox().height/2;
                let y2 = cThis.btnStart.getPositionY() + cThis.btnStart.getBoundingBox().height/2;
                // check if touched in button area
                if (x1 < touch.getLocation().x && touch.getLocation().x < x2 && y1 < touch.getLocation().y && touch.getLocation().y < y2) {
                    cThis.onStart();
                }
                return true;
            },
        }, this);

    },
    onEnter:function(){
        this._super();
    },
    onStart:function(sender)
    {
        this.checkSystemAndPlaySound("button");
        fr.view(ScreenGoldDigger);
    },
    generateItem:function()
    {
        // generate random gold and diamond
        let itemsCount = 100;
        for(var i = 1; i <= itemsCount; i++)
        {
            let item;
            switch (i%17) {
                case 0: item = cc.Sprite.create("assests/game/images/skull-sheet0.png"); break;
                case 1: item = cc.Sprite.create("assests/game/images/gold_01-sheet0.png"); break;
                case 2: item = cc.Sprite.create("assests/game/images/gold_02-sheet0.png"); break;
                case 3: item = cc.Sprite.create("assests/game/images/gold_03-sheet0.png"); break;
                case 4: item = cc.Sprite.create("assests/game/images/gold_05-sheet0.png"); break;
                case 5: item = cc.Sprite.create("assests/game/images/gold_10-sheet0.png"); break;
                case 6: item = cc.Sprite.create("assests/game/images/rock_01-sheet0.png"); break;
                case 7: item = cc.Sprite.create("assests/game/images/rock_04-sheet0.png"); break;
                case 8: item = cc.Sprite.create("assests/game/images/rock_07-sheet0.png"); break;
                case 9: item = cc.Sprite.create("assests/game/images/rock_10-sheet0.png"); break;
                case 10: item = cc.Sprite.create("assests/game/images/bonus-sheet0.png"); break;
                case 11: item = cc.Sprite.create("assests/game/images/bonusbomb-sheet0.png"); break;
                case 12: item = cc.Sprite.create("assests/game/images/jewel_01-sheet0.png"); break;
                case 13: item = cc.Sprite.create("assests/game/images/jewel_02-sheet0.png"); break;
                case 14: item = cc.Sprite.create("assests/game/images/jewel_03-sheet0.png"); break;
                case 15: item = cc.Sprite.create("assests/game/images/barrel-sheet0.png"); break;
                case 16: item = cc.Sprite.create("assests/game/images/treasure-sheet0.png"); break;
            }
            let overwrite = false;
            let randomCount = 0;
            do {
                randomCount++;
                newCoord = {
                    xPosition: randomInt(40, this.scrSize.width-40), // random( 40 to this.scrSize.width-40)
                    yPosition: randomInt(40, this.scrSize.height - this.scrSize.height/2.2) // random( this.scrSize.height/4 to this.scrSize.height - this.scrSize.height/3)
                }
            }
            while (overwrite === true && randomCount < 10); // sau 10 lần thử mà ko tìm ra vị trí phù hợp thì bỏ

            if (overwrite === false && randomCount <= 10) { // tọa độ hợp lệ => hiển thị
                item.attr({
                    x: newCoord.xPosition,
                    y: newCoord.yPosition 
                });
                item.setScale(this.SCALE_RATE);
                this.addChild(item);
            }

        }
    },
    checkSystemAndPlaySound: function(soundName, isLoop = false) {
        let soundFile_ogg = "assests/game/media/" + soundName + ".ogg";
        let soundFile_mp3 = "assests/game/media/" + soundName + ".mp3";
        if (this.sound)
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? soundFile_ogg : soundFile_mp3, isLoop);
    }

});