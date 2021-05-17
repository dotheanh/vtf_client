/**
 * Created by GSN on 7/9/2015.
 */

const duration = 60*1;

const itemsData = [
    {
        itemType: 1,
        itemValue: 10,
        itemSpeed: 120,
    },
    {
        itemType: 2,
        itemValue: 20,
        itemSpeed: 110,
    },
    {
        itemType: 3,
        itemValue: 30,
        itemSpeed: 100,
    },
    {
        itemType: 4,
        itemValue: 50,
        itemSpeed: 80,
    },
    {
        itemType: 5,
        itemValue: 100,
        itemSpeed: 60,
    },
    {
        itemType: 6,
        itemValue: 5,
        itemSpeed: 100,
    },
    {
        itemType: 7,
        itemValue: 10,
        itemSpeed: 80,
    },
    {
        itemType: 8,
        itemValue: 15,
        itemSpeed: 60,
    },
    {
        itemType: 9,
        itemValue: 20,
        itemSpeed: 50,
    },
    {
        itemType: 10,
        itemValue: randomInt(50, 200),
        itemSpeed: 80,
    },
    {
        itemType: 11,
        itemValue: 0,
        itemSpeed: 100,
    },
    {
        itemType: 12,
        itemValue: 100,
        itemSpeed: 150,
    },
    {
        itemType: 13,
        itemValue: 110,
        itemSpeed: 150,
    },
    {
        itemType: 14,
        itemValue: 120,
        itemSpeed: 150,
    },
    {
        itemType: 15,
        itemValue: 10,
        itemSpeed: 120,
    },
    {
        itemType: 16,
        itemValue: 180,
        itemSpeed: 60,
    },
    {
        itemType: 17,
        itemValue: 20,
        itemSpeed: 120,
    },
];


// generate random
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getItemSpeed(itemType) {
    let speed = 0;
    itemsData.every(function(item, index) {
        if (item.itemType === itemType) {
            speed = item.itemSpeed;
            return false;
        }
        else return true;
    })
    return speed;
}
function getItemValue(itemType) {
    let value = 0;
    itemsData.every(function(item, index) {
        if (item.itemType === itemType) {
            value = item.itemValue;
            return false;
        }
        else return true;
    })
    return value;
}

var ScreenGoldDigger = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this.gameState = 0; // not started: 0, playing: 1, game over: 2, level passed: 3
        this.claw = null;
        this.itemSprites = [];
        this._super();
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
        this.background.setLocalZOrder(0);
        this.addChild(this.background);

        // btn Tap to play
        this.playTxt = cc.Sprite.create("assests/game/images/texttaptoplay-sheet0.png");
        this.playTxt.setScale(this.SCALE_RATE*1.5);
        this.playTxt.attr({ x: this.scrSize.width/2, y: this.scrSize.height/2 - this.scrSize.height/7 });
        this.playTxt.setLocalZOrder(5);
        this.addChild(this.playTxt);
        this.playTxt.runAction(cc.repeat(cc.sequence(cc.scaleBy(1.5, 1.1),cc.scaleBy(1.5, 0.9)),3));

        // add click listener to start game
        this.addClickListener();

        // add money, level, target, countdown box
        this.leftGuiframe = cc.Sprite.create("assests/game/images/guiframe-sheet0.png");
        this.leftGuiframe.setScale(this.SCALE_RATE);
        this.leftGuiframe.attr({ x: this.scrSize.width/7, y: this.scrSize.height - this.scrSize.height/5 });
        this.addChild(this.leftGuiframe);
        this.rightGuiframe = cc.Sprite.create("assests/game/images/guiframe-sheet0.png");
        this.rightGuiframe.setScale(this.SCALE_RATE);
        this.rightGuiframe.attr({ x: this.scrSize.width - this.scrSize.width/7, y: this.scrSize.height - this.scrSize.height/5 });
        this.rightGuiframe.runAction(cc.flipX(true));
        this.addChild(this.rightGuiframe);
        //money icon
        this.moneyIcon = cc.Sprite.create("assests/game/images/guiscore-sheet0.png");
        this.moneyIcon.setScale(this.SCALE_RATE);
        this.moneyIcon.attr({ x: this.scrSize.width/21, y: this.scrSize.height - this.scrSize.height/19 });
        this.moneyIcon.setLocalZOrder(5);
        this.addChild(this.moneyIcon);
        //star icon
        this.starIcon = cc.Sprite.create("assests/game/images/guilevel-sheet0.png");
        this.starIcon.setScale(this.SCALE_RATE);
        this.starIcon.attr({ x: this.scrSize.width/21, y: this.scrSize.height - this.scrSize.height/6.7 });
        this.starIcon.setLocalZOrder(5);
        this.addChild(this.starIcon);
        //target icon
        this.targetIcon = cc.Sprite.create("assests/game/images/guitarget-sheet0.png");
        this.targetIcon.setScale(this.SCALE_RATE);
        this.targetIcon.attr({ x: this.scrSize.width-this.scrSize.width/21, y: this.scrSize.height - this.scrSize.height/19 });
        this.targetIcon.setLocalZOrder(5);
        this.addChild(this.targetIcon);
        //time icon
        this.timeIcon = cc.Sprite.create("assests/game/images/guitime-sheet0.png");
        this.timeIcon.setScale(this.SCALE_RATE);
        this.timeIcon.attr({ x: this.scrSize.width-this.scrSize.width/21, y: this.scrSize.height - this.scrSize.height/6.7 });
        this.timeIcon.setLocalZOrder(5);
        this.addChild(this.timeIcon);
        // init values for level
        this.level = 1;
        this.score = 0;
        this.target = 800;
        this.countdown = 60;
        this.levelBox = gv.commonText(this.level, this.scrSize.width/10, this.scrSize.height - this.scrSize.height/6.7);
        this.addChild(this.levelBox);
        this.targetBox = gv.commonText(this.target, this.scrSize.width-this.scrSize.width/8, this.scrSize.height - this.scrSize.height/19);
        this.addChild(this.targetBox);
        this.scoreBox = gv.commonText(this.score, this.scrSize.width/9, this.scrSize.height - this.scrSize.height/19);
        this.addChild(this.scoreBox);
        this.countdownBox = gv.commonText(this.countdown, this.scrSize.width-this.scrSize.width/9, this.scrSize.height - this.scrSize.height/6.7);
        this.addChild(this.countdownBox);


        var xPos = (this.scrSize.width - 220)/2
        // add character
        this.character = cc.Sprite.create("assests/game/images/excavator-sheet0.png", cc.rect(0,0,512,180));
        this.character.attr({
            x: xPos,
            y: this.scrSize.height - this.scrSize.height*0.24
        });
        this.character.setAnchorPoint(0,0.5);
        this.addChild(this.character);

        this.nodeAnimation = new cc.Node();
        this.nodeAnimation.setPosition(xPos, this.scrSize.height*0.5);
		this.nodeAnimation.setScaleX(-1);///
        this.addChild(this.nodeAnimation);
        this.explodeAnimation = null;
        this.schedule(this.update);
    },
    onEnter:function(){
        this._super();
    },
    onRemoved:function()
    {
        fr.unloadAllAnimationData(this);
    },
    updateTest:function(dt)
    {
        this.nodeAnimation.setScale(0.5);
        this.nodeAnimation.runAction(cc.scaleTo(0.5, 1.0).easing(cc.easeBounceOut()));
    },
    onSelectReset:function(sender)
    {
        fr.view(ScreenGoldDigger);
    },
    update: function (dt){
        // mỗi khi màn hình được vẽ lại thì hàm này được gọi => tính toán vị trí, tọa độ
        if (this.claw != null) {
            this.angle = 270-this.claw.getRotation();
        }
        // Todo: check collition
        if (this.ableToTouchItem) {
            this.itemSprites.forEach((item, index) => {
                if (this.checkTouchItem(item.sprite)) {
                    this.ableToTouchItem = false;
                    this.claw.stopAction(this.normalClawCycle);
                    let distance = this.calDistance(item.sprite.getPositionX(), item.sprite.getPositionY(), this.initClawX, this.initClawY);
                    let v = getItemSpeed(item.itemType);
                    let t = distance/v;
                    this.absolutelyReturnClawAction = cc.moveTo(t, this.initClawX, this.initClawY); /// khai báp trùng lặp
                    this.score = this.score + getItemValue(item.itemType);
                    if (item.itemType === 15) {
                        this.explosion(item.sprite, this);
                        this.claw.runAction(cc.sequence(this.absolutelyReturnClawAction,cc.callFunc(this.onNormalReturnClaw, this),cc.callFunc(()=>{this.scoreBox.setString(this.score)})));
                    }
                    else {
                        item.sprite.runAction(cc.moveTo(t*1.15, this.initClawX, this.initClawY));
                        this.claw.runAction(cc.sequence(this.absolutelyReturnClawAction,cc.callFunc(this.onNormalReturnClaw, this),cc.callFunc(()=>{item.sprite.getParent().removeChild(item.sprite,true);}),cc.callFunc(()=>{this.scoreBox.setString(this.score)})));
                        this.itemSprites.splice(index, 1);
                    }
                }
            })
        }
    },
    throwClaw:function()
    {
        this.onThrowClaw();
    },   
    onStartGame:function()
    {
        this.initTheClaw();
        this.generateItem();
        this.startCountDown();
        this.gameState = 1;
    },
    initTheClaw:function() {
        // hiện móc câu
        this.claw = cc.Sprite.create("assests/game/images/hook-sheet0.png");
        this.initClawX = (this.scrSize.width - 220)/2;
        this.initClawY = this.scrSize.height - this.scrSize.height*0.21;
        this.claw.attr({
            x: this.initClawX,
            y: this.initClawY
        });
        this.claw.anchorY = 1;
        this.claw.setLocalZOrder(10);
        this.addChild(this.claw);

        let angle = 180;
        var initRotateClaw = cc.rotateBy(0, 90);
        var rotateClawLR = cc.rotateBy(2, -angle);
        var rotateClawRL = cc.rotateBy(2, angle);
        this.rotatingAction = cc.sequence(initRotateClaw, cc.repeat(cc.sequence(rotateClawLR, rotateClawRL), 99));
        this.claw.runAction(this.rotatingAction);
    },
    generateItem:function()
    {
        // generate random gold and diamond
        let itemsCount = 80;
        let itemsCoord = []; // ghi lại tọa độ các item đã tồn tại để tránh trùng tọa độ
        for(var i = 0; i < itemsCount; i++)
        {
            let item;
            let itemType = randomInt(1, 17);
            switch (itemType) {
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
                case 17: item = cc.Sprite.create("assests/game/images/skull-sheet0.png"); break;
            }
            let overwrite = false;
            let randomCount = 0;
            let newCoord;
            do {
                randomCount++;
                newCoord = {
                    xPosition: randomInt(40, this.scrSize.width-40), // random( 40 to this.scrSize.width-40)
                    yPosition: randomInt(40, this.scrSize.height - this.scrSize.height/2.2) // random( this.scrSize.height/4 to this.scrSize.height - this.scrSize.height/3)
                }
                itemsCoord.forEach(coord => {
                    if (Math.abs(coord.xPosition - newCoord.xPosition) < 50 && Math.abs(coord.yPosition - newCoord.yPosition) < 50) { // quá gần nhau
                        overwrite = true;
                    }
                });
            }
            while (overwrite === true && randomCount < 10); // sau 10 lần thử mà ko tìm ra vị trí phù hợp thì bỏ

            if (overwrite === false && randomCount <= 10) { // tọa độ hợp lệ => hiển thị
                itemsCoord.push(newCoord);
                item.attr({
                    x: newCoord.xPosition,
                    y: newCoord.yPosition 
                });
                item.setScale(this.SCALE_RATE);
                this.addChild(item);
                item.anchorX = 0.5;item.anchorY = 0.5;
                this.itemSprites.push({
                    sprite: item,
                    itemType: itemType
                });
            }

        }

    },
    startCountDown:function() {
        const cThis = this;
        cThis.countdown = 59;
        setInterval(function () {
            cThis.countdownBox.setString(cThis.countdown);

            if (--cThis.countdown < 0) {
                cThis.countdownBox.setString("TIME OUT");
                cThis.gameState = 2;
                // Todo: game over
            }
        }, 1000);
    },
    addClickListener:function() {
        // add event listener for layer
        const cThis = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                if (cThis.gameState === 0) {
                    // start the game
                    cThis.removeChild(cThis.playTxt,true);
                    cThis.onStartGame();
                }
                else if (cThis.gameState === 1) {
                    // check if touched in mining area
                    if (40 < touch.getLocation().x && touch.getLocation().x < cThis.scrSize.width-40 && 40 < touch.getLocation().y && touch.getLocation().y < cThis.scrSize.height - cThis.scrSize.height/2.2) {
                        cThis.throwClaw();
                    }
                }
                return true;
            },
        }, this);
        
    },
    onThrowClaw:function()
    {
        this.ableToTouchItem = true;
        // di chuyển móc câu
        let radian = this.angle/360 * 2 * Math.PI;
        let deltaX = Math.cos(radian)*this.scrSize.width/1.2;
        let deltaY = Math.sin(radian)*this.scrSize.width/1.2;
        this.claw.stopAction(this.rotatingAction);
        this.throwClawAction = cc.moveBy(2, deltaX, deltaY);
        this.normalClawCycle = cc.sequence(this.throwClawAction, cc.callFunc(this.onNormalReturnClaw, this))
        this.claw.runAction(this.normalClawCycle); // quăng móc và quay về
        //this.claw.stopActionByTag(100)
    },
    onNormalReturnClaw: function(){
        this.ableToTouchItem = false;
        this.absolutelyReturnClawAction = cc.moveTo(2, this.initClawX, this.initClawY);
        let angle = 180;
        var backtoRotationClaw = cc.rotateTo(1, 90);
        var rotateClawLR = cc.rotateBy(2, -angle);
        var rotateClawRL = cc.rotateBy(2, angle);
        this.rotateAction = cc.sequence(backtoRotationClaw, cc.repeat(cc.sequence(rotateClawLR, rotateClawRL), 99));
        this.rotatingAction = cc.sequence(cc.delayTime(this.absolutelyReturnClawAction.getDuration()), this.rotateAction);
        this.claw.runAction(this.absolutelyReturnClawAction);
        this.claw.runAction(this.rotatingAction);
    },
    explosion: function(spriteBomb, thisCursor) {
        // do explosion animate
        spriteBomb.anchorX = 0.5;spriteBomb.anchorY = 0.5;
        explosionCenter_x = spriteBomb.getPositionX();
        explosionCenter_y = spriteBomb.getPositionY();
        thisCursor.doExplodeAnimation(explosionCenter_x, explosionCenter_y);
        thisCursor.itemSprites.forEach((item, index) => {
            let distance = thisCursor.calDistance(explosionCenter_x, explosionCenter_y, item.sprite.getPositionX(), item.sprite.getPositionY());
            if ( distance - item.sprite.getBoundingBox().width/2 < 200) {   // item nằm trong bán kính nổ
                item.sprite.getParent().removeChild(item.sprite,true);
                thisCursor.itemSprites.splice(index, 1);
            }
        })
    },
    checkTouchItem: function(item){
        let x = this.claw.getPositionX();
        let y = this.claw.getPositionY();
        let itemX = item.getPositionX();
        let itemY = item.getPositionY();
        let itemWidth = item.getBoundingBox().height/1.3;
        let itemHeight = item.getBoundingBox().width/1.3;
        return ((itemX - itemWidth/2 <= x && x <= itemX + itemWidth/2) && (itemY - itemHeight/2 <= y && y <= itemY + itemHeight/2));
    },
    calDistance: function(x1, y1, x2, y2) {
        let deltaX = x1 - x2;
        let deltaY = y1 - y2;
        return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    },
    doExplodeAnimation:function(explosionCenter_x, explosionCenter_y)
    {
        cc.spriteFrameCache.addSpriteFrames(explosion_res.explosion_plist, explosion_res.e_png);
		this._sprite_explosion = new cc.Sprite("#explosion_1.png");
        this._sprite_explosion.setPosition(explosionCenter_x, explosionCenter_y);
		this._sprite_explosion.anchorX = 0.5;
		this._sprite_explosion.anchorY = 0.5;
		this._sprite_explosion.setScale(this.SCALE_RATE);
		this.addChild(this._sprite_explosion);
		
		//load anim info from plist file
		cc.animationCache.addAnimations(explosion_res.explosion_anim);
		var explosion_animation_1 = cc.animationCache.getAnimation("explosion");
		//create animate action
		var action_animate_1 = cc.animate(explosion_animation_1);
		//run action
        const cThis = this;
		this._sprite_explosion.runAction(cc.sequence(action_animate_1,cc.callFunc(()=>{cThis.removeChild(cThis._sprite_explosion,true)})));
    },

});