
const {ccclass, property} = cc._decorator;

@ccclass
export default class ComboEffect extends cc.Component {

    @property([cc.SpriteFrame])
    comboSpriteFrames: cc.SpriteFrame[] = [];

    @property([cc.AudioClip])
    audioClips: cc.AudioClip[] = [];

    onLoad () {
        this.node.opacity = 0;
        cc.director.on('elimate-effect', this.showEffect, this);
    }

    private showEffect(num: number): void{
        let spriteFrame: cc.SpriteFrame = null;
        let clip: cc.AudioClip = null;
        if(num < 5){
            return;
        }
        if( num >= 5 && num <= 7 ){
            spriteFrame = this.comboSpriteFrames[0];
        } else if( num >= 8 && num <= 10 ){
            clip = this.audioClips[0];
            spriteFrame = this.comboSpriteFrames[1];
        } else if( num >= 11 && num <= 13 ){
            clip = this.audioClips[1];
            spriteFrame = this.comboSpriteFrames[2];
        } else {
            clip = this.audioClips[2];
            spriteFrame = this.comboSpriteFrames[3];
        }
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        if( clip ){
            cc.audioEngine.play(clip, false, 1);
        }
        this.node.opacity = 255;
        let ac: cc.FiniteTimeAction = cc.fadeOut(1.2);
        this.node.runAction(ac);
    }




}
