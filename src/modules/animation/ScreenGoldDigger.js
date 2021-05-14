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

        var btnPlayIdle = gv.commonButton(100, 34, size.width - 80, size.height - 52,"Idle");
        btnPlayIdle.setTitleFontSize(15);
        this.addChild(btnPlayIdle);
        btnPlayIdle.addClickEventListener(this.testPlayAnimation.bind(this));   // testPlayAnimation: stop animation

        var btnGenerate = gv.commonButton(100, 34, size.width - 80, size.height - 92,"Generate");
        btnGenerate.setTitleFontSize(15);
        this.addChild(btnGenerate);
        btnGenerate.addClickEventListener(this.generateItem.bind(this));
        // var btn_change_display = gv.commonButton(200, 64, size.width - 120, size.height - 220,"Change display");
        // btn_change_display.setTitleFontSize(28);
        // this.addChild(btn_change_display);
        // btn_change_display.addClickEventListener(this.testChangeDisplayOnBone.bind(this));

        // var btn_test_load = gv.commonButton(200, 64, size.width - 120, size.height - 304,"Test load ani");
        // this.addChild(btn_test_load);
        // btn_test_load.addClickEventListener(this.testLoadAnimation.bind(this));
        

        var btnReset = gv.commonButton(100, 64, size.width - 70, 52,"Reset");
        this.addChild(btnReset);
        btnReset.addClickEventListener(this.onSelectReset.bind(this));


        var xPos = (size.width - 220)/2;
        this.score = gv.commonText(fr.Localization.text("..."), size.width*2/3, size.height-size.height/8);
        this.addChild(this.score);

        this.countdownBox = gv.commonText(fr.Localization.text("01:00"), size.width*1/6, size.height-size.height/8);
        //countdown.setTitleFontSize(15);
        this.addChild(this.countdownBox);

        this.nodeAnimation = new cc.Node();
        this.nodeAnimation.setPosition(xPos, size.height - size.height*0.2);    // vị trí nhân vật character
		this.nodeAnimation.setScaleX(-1);
        this.addChild(this.nodeAnimation);

        this.character = null;
        this.lblResult = new cc.LabelBMFont("",res.FONT_BITMAP_DICE_NUMBER);

        this.lblResult.setAnchorPoint(0.5,0.5);
        this.lblResult.retain();
        this.testPlayAnimation();
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
        //console.log("update: " + dt);    // mỗi khi màn hình được vẽ lại thì hàm này được gọi => tính toán vị trí, tọa độ
        if (this.claw != null) {
            this.angle = 270-this.claw.getRotation();
        }
        // Todo: check collition
        if (this.ableToTouchItem) {
            this.itemSprites.forEach(sprite => {
                if (this.checkTouchItem(sprite)) {
                    console.log("Touch!!");
                    this.ableToTouchItem = false;
                    this.claw.stopAction(this.normalClawCycle);
                    this.absolutelyReturnClawAction = cc.moveTo(2, this.initClawX, this.initClawY); /// khai báp trùng lặp
                    this.claw.runAction(cc.sequence(this.absolutelyReturnClawAction,cc.callFunc(this.onNormalReturnClaw, this)));
                }
            })
        }
    },
    testAnimationBinding:function()
    {
        if(this.character)
            this.character.removeFromParent();
        this.character = fr.createAnimationById(resAniId.chipu,this);
        this.nodeAnimation.addChild(this.character);
        this.character.setPosition(cc.p(0,0));
        this.character.setScale(2);
        this.character.getAnimation().gotoAndPlay("win_0_",-1,-1,1);
        this.character.setCompleteListener(function () {
            this.testAnimationBinding();
        }.bind(this));

    },
    testPlayAnimation:function()
    {
        if(this.character)
            this.character.removeFromParent(true);

        this.character = fr.createAnimationById(resAniId.chipu,this);
        //doi mau, yeu cau phai co file shader, nhung bone co ten bat dau tu color_ se bi doi mau
        this.character.setBaseColor(255,255,0);
        //chinh toc do play animation
        this.character.getAnimation().setTimeScale(0.5);
        this.nodeAnimation.addChild(this.character);
        //play animation gotoAndPlay(animationName, fadeInTime, duration, playTimes)
        this.character.getAnimation().gotoAndPlay("idle_0_",-1);

    },
    testFinishAnimationEvent:function()
    {
        if(this.character)
            this.character.removeFromParent();
        this.character = fr.createAnimationById(resAniId.chipu,this);
        this.nodeAnimation.addChild(this.character);
        this.character.getAnimation().gotoAndPlay("win_0_",-1,-1,1);
        this.character.setCompleteListener(this.onFinishAnimations.bind(this));
        
        this.onThrowClaw();
    },
    // testChangeDisplayOnBone:function()
    // {
    //     if(this.character)
    //         this.character.removeFromParent();
    //     this.character = fr.createAnimationById(resAniId.eff_dice_number,this);
    //     this.nodeAnimation.addChild(this.character);
    //     this.lblResult.removeFromParent();
    //     this.character.getArmature().getCCSlot("2").setDisplayImage(this.lblResult);
    //     var number = 2 + cc.random0To1()*10;
    //     this.lblResult.setString(Math.floor(number).toString());
    //     this.lblResult.retain();
    //     this.character.getAnimation().gotoAndPlay("run",0);

    // },
    // testLoadAnimation:function()
    // {
    //     var testCount = 100;
    //     var start = Date.now();

    //     for(var i = 0; i< testCount; i++)
    //     {
    //         var ani  = fr.createAnimationById(resAniId.firework_test,this);
    //         this.addChild(ani);
    //         ani.setPosition(cc.random0To1()*cc.winSize.width, cc.random0To1()*cc.winSize.height);
    //         ani.getAnimation().gotoAndPlay("run",cc.random0To1()*5,-1,1);
    //         ani.setCompleteListener(this.onFinishEffect.bind(this));
    //     }
    //     var end = Date.now();
    //     cc.log("time: " + (end - start));
    //     this.lblLog.setString("time: " + (end - start));
    // },

    onFinishAnimations:function()
    {
        this.character.getAnimation().gotoAndPlay("idle_0_",0);
    },
    onFinishEffect:function(animation)
    {
        animation.removeFromParent();
    },
    generateItem:function()
    {
        // hiện móc câu
        let scrSize = cc.director.getVisibleSize();
        this.claw = cc.Sprite.create("assests/game/animation/golddigger/claw2.png");
        let clawType = randomInt(1, 6);
        this.claw = cc.Sprite.create("assests/game/animation/golddigger/claw"+clawType+".png");
        this.initClawX = (scrSize.width - 220)/2;
        this.initClawY = scrSize.height - scrSize.height*0.21;
        this.claw.attr({
            x: this.initClawX,
            y: this.initClawY
        });
        this.claw.anchorY = 0.5;
        this.addChild(this.claw);

        let angle = 180;
        var initRotateClaw = cc.rotateBy(0, 90);
        var rotateClawLR = cc.rotateBy(2, -angle);
        var rotateClawRL = cc.rotateBy(2, angle);
        this.rotatingAction = cc.sequence(initRotateClaw, cc.repeat(cc.sequence(rotateClawLR, rotateClawRL), 30));
        this.claw.runAction(this.rotatingAction);

        // generate random gold and diamond
        let itemsCount = 100;
        let itemsCoord = []; // ghi lại tọa độ các item đã tồn tại để tránh trùng tọa độ
        for(var i = 0; i < itemsCount; i++)
        {
            let item;
            let itemType = randomInt(1, 8);
            switch (itemType) {
                case 1: item = cc.Sprite.create("assests/game/animation/golddigger/rock20.png"); break;
                case 2: item = cc.Sprite.create("assests/game/animation/golddigger/rock50.png"); break;
                //case 3: item = cc.Sprite.create("assests/game/animation/golddigger/rock100.png"); break;
                case 3: item = cc.Sprite.create("assests/game/animation/golddigger/gold50.png"); break;
                case 4: item = cc.Sprite.create("assests/game/animation/golddigger/gold20.png"); break;
                case 5: item = cc.Sprite.create("assests/game/animation/golddigger/gold50.png"); break;
                case 6: item = cc.Sprite.create("assests/game/animation/golddigger/gold80.png"); break;
                case 7: item = cc.Sprite.create("assests/game/animation/golddigger/diamond20.png"); break;
                case 8: item = cc.Sprite.create("assests/game/animation/golddigger/diamond50.png"); break;
            }
            let overwrite = false;
            let randomCount = 0;
            let newCoord;
            do {
                randomCount++;
                newCoord = {
                    xPosition: randomInt(40, scrSize.width-40), // random( 40 to size.width-40)
                    yPosition: randomInt(scrSize.height/4, scrSize.height - scrSize.height/3) // random( size.height/4 to size.height - size.height/3)
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
        var btnTestFinishEvent = gv.commonButton(100, 34, scrSize.width - 80, scrSize.height - 132,"Dig it!");
        btnTestFinishEvent.setTitleFontSize(15);
        this.addChild(btnTestFinishEvent);
        btnTestFinishEvent.addClickEventListener(this.testFinishAnimationEvent.bind(this));   // testFinishAnimationEvent: do animation
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
        this.rotateAction = cc.sequence(backtoRotationClaw, cc.repeat(cc.sequence(rotateClawLR, rotateClawRL), 30));
        this.rotatingAction = cc.sequence(cc.delayTime(this.absolutelyReturnClawAction.getDuration()), this.rotateAction);
        this.claw.runAction(this.absolutelyReturnClawAction);    //=> ko thể stop rotatingAction!!!!!!!!
        this.claw.runAction(this.rotatingAction);
        //this.rotatingAction.setTag(100);

        //cc.sequence(this.claw.runAction(this.absolutelyReturnClawAction),this.claw.runAction(this.rotatingAction));
    },
    checkTouchItem: function(item){
        let x = this.claw.getPositionX();
        let y = this.claw.getPositionY();
        let itemX = item.getPositionX();
        let itemY = item.getPositionY();
        let itemWidth = 10;
        let itemHeight = 10;
        return ((itemX - itemWidth <= x && x <= itemX + itemWidth) && (itemY - itemHeight <= y && y <= itemY + itemHeight));
    }

});