
const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {

    @property(cc.Node)
    layerStar: cc.Node = null;

    @property(cc.Label)
    labelChapter: cc.Label = null;

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Label)
    labelHistory: cc.Label = null;


    onLoad (){
        this.layerStar.getComponent('StarController').initStar();
    }

    onPause (): void {
        cc.log('onPause');
    }



}
