/**
 * Created by GSN on 7/9/2015.
 */

const duration = 60*1;

// generate random
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var ScreenGoldDigger = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this.claw = null;
        this.itemSprites = [];
        this._super();
        var size = cc.director.getVisibleSize();

        // add background
        this.background = cc.Sprite.create("assests/game/images/background-sheet0.png");
        this.background.setScale(size.width/this.background.getContentSize().width)
        this.background.attr({
            x: size.width/2,
            y: size.height/2
        });
        this.background.setLocalZOrder(0);
        this.addChild(this.background);

        // SCALE RATE
        this.SCALE_RATE = size.width/this.background.getContentSize().width

        var btnGenerate = gv.commonButton(100, 34, size.width - 80, size.height - 52,"Generate");
        btnGenerate.setTitleFontSize(15);
        this.addChild(btnGenerate);
        btnGenerate.addClickEventListener(this.generateItem.bind(this));
        

        var btnReset = gv.commonButton(100, 34, 70, size.height - 30,"Reset");
        btnReset.setTitleFontSize(15);
        this.addChild(btnReset);
        btnReset.addClickEventListener(this.onSelectReset.bind(this));


        var xPos = (size.width - 220)/2;
        this.score = 0;
        this.scoreBox = gv.commonText(fr.Localization.text("0"), size.width*1/6, size.height-size.height/6);
        this.addChild(this.scoreBox);

        this.countdownBox = gv.commonText(fr.Localization.text("01:00"), size.width*1/6, size.height-size.height/10);
        this.addChild(this.countdownBox);

        // add character
        this.character = cc.Sprite.create("assests/game/images/excavator-sheet0.png", cc.rect(0,0,512,180));
        this.character.attr({
            x: xPos,
            y: size.height - size.height*0.24
        });
        this.character.setAnchorPoint(0,0.5);
        this.addChild(this.character);

        //this.character = null;
        //this.testPlayAnimation();
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
            this.itemSprites.forEach((sprite, index) => {
                if (this.checkTouchItem(sprite)) {
                    this.ableToTouchItem = false;
                    this.claw.stopAction(this.normalClawCycle);
                    this.absolutelyReturnClawAction = cc.moveTo(2, this.initClawX, this.initClawY); /// khai báp trùng lặp
                    sprite.runAction(cc.moveTo(2, this.initClawX, this.initClawY));
                    this.itemSprites.splice(index, 1);//////////////////
                    this.claw.runAction(cc.sequence(this.absolutelyReturnClawAction,cc.callFunc(this.onNormalReturnClaw, this),cc.callFunc(()=>{sprite.getParent().removeChild(sprite,true);}),cc.callFunc(()=>{this.scoreBox.setString(++this.score)})));
                }
            })
        }
    },
    // testAnimationBinding:function()
    // {
    //     if(this.character)
    //         this.character.removeFromParent();
    //     this.character = fr.createAnimationById(resAniId.chipu,this);
    //     this.nodeAnimation.addChild(this.character);
    //     this.character.setPosition(cc.p(0,0));
    //     this.character.setScale(2);
    //     this.character.getAnimation().gotoAndPlay("win_0_",-1,-1,1);
    //     this.character.setCompleteListener(function () {
    //         this.testAnimationBinding();
    //     }.bind(this));

    // },
    // testPlayAnimation:function()
    // {
    //     if(this.character)
    //         this.character.removeFromParent(true);

    //     this.character = fr.createAnimationById(resAniId.chipu,this);
    //     //doi mau, yeu cau phai co file shader, nhung bone co ten bat dau tu color_ se bi doi mau
    //     this.character.setBaseColor(255,255,0);
    //     //chinh toc do play animation
    //     this.character.getAnimation().setTimeScale(0.5);
    //     this.nodeAnimation.addChild(this.character);
    //     //play animation gotoAndPlay(animationName, fadeInTime, duration, playTimes)
    //     this.character.getAnimation().gotoAndPlay("idle_0_",-1);

    // },
    throwClaw:function()
    {
        // if(this.character)
        //     this.character.removeFromParent();
        // this.character = fr.createAnimationById(resAniId.chipu,this);
        // this.nodeAnimation.addChild(this.character);
        // this.character.getAnimation().gotoAndPlay("win_0_",-1,-1,1);
        // this.character.setCompleteListener(this.onFinishAnimations.bind(this));
        
        this.onThrowClaw();
    },

    // onFinishAnimations:function()
    // {
    //     this.character.getAnimation().gotoAndPlay("idle_0_",0);
    // },
    // onFinishEffect:function(animation)
    // {
    //     animation.removeFromParent();
    // },
    generateItem:function()
    {
        // hiện móc câu
        let scrSize = cc.director.getVisibleSize();
        this.claw = cc.Sprite.create("assests/game/images/hook-sheet0.png");
        this.initClawX = (scrSize.width - 220)/2;
        this.initClawY = scrSize.height - scrSize.height*0.21;
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

        // generate random gold and diamond
        let itemsCount = 100;
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
                    xPosition: randomInt(40, scrSize.width-40), // random( 40 to size.width-40)
                    yPosition: randomInt(40, scrSize.height - scrSize.height/2.2) // random( size.height/4 to size.height - size.height/3)
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
                this.itemSprites.push(item);
            }

        }

        // hiển thị thời gian đếm ngược
        var timer = duration, minutes, seconds;
        const countdownBox = this.countdownBox;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            //display.textContent = minutes + ":" + seconds;/// update tẽt
            countdownBox.setString(minutes + ":" + seconds);

            if (--timer < 0) {
                countdownBox.setString("TIME OUT");
            }
        }, 1000);

        // hiển thị nút đào vàng
        var btnThrowClaw = gv.commonButton(100, 34, scrSize.width - 80, scrSize.height - 132,"Dig it!");
        btnThrowClaw.setTitleFontSize(15);
        this.addChild(btnThrowClaw);
        btnThrowClaw.addClickEventListener(this.throwClaw.bind(this));   // testFinishAnimationEvent: do animation

        // const cThis = this;
        // this.digScreen = new cc.Node();
        // this.digScreen.attr({
        //     x: 0,
        //     y: 0
        // });
        // this.digScreen.setContentSize(cc.size(scrSize.width,scrSize.height - scrSize.height/2.2));
        // //digScreen.addClickEventListener(this.testFinishAnimationEvent.bind(this));   // testFinishAnimationEvent: do animation
        // cc.eventManager.addListener({
        //     event: cc.EventListener.MOUSE,
        //     onMouseDown: function(event){
        //         cThis.testFinishAnimationEvent.bind(cThis);
        //     }
        // }, cThis.digScreen);
        // this.addChild(this.digScreen);
    },
    onThrowClaw:function()
    {
        this.ableToTouchItem = true;
        // di chuyển móc câu
        let scrSize = cc.director.getVisibleSize();
        let radian = this.angle/360 * 2 * Math.PI;
        let deltaX = Math.cos(radian)*scrSize.width/1.5;
        let deltaY = Math.sin(radian)*scrSize.width/1.5;
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
        this.claw.runAction(this.absolutelyReturnClawAction);    //=> ko thể stop rotatingAction!!!!!!!!
        this.claw.runAction(this.rotatingAction);
    },
    checkTouchItem: function(item){
        let x = this.claw.getPositionX();
        let y = this.claw.getPositionY();
        let itemX = item.getPositionX();
        let itemY = item.getPositionY();
        let itemWidth = item.getBoundingBox().height/2;
        let itemHeight = item.getBoundingBox().width/2;
        return ((itemX - itemWidth <= x && x <= itemX + itemWidth) && (itemY - itemHeight <= y && y <= itemY + itemHeight));
    }

});