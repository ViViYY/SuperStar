import { Star } from "./Star";

const {ccclass, property} = cc._decorator;

@ccclass
export class StarController extends cc.Component {

    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;

    _starList: Star[] = [];

    onLoad () {

    }

    public initStar = function(): void {
        for(let i: number = 0; i < 10; i++){
            for(let j: number = 0; j < 10; j++){
                let starNode = cc.instantiate(this.starPrefab);
                starNode.parent = this.node;
                starNode.getComponent('Star').init(Math.floor(Math.random() * 5), i, j);
                this._starList.push(starNode.getComponent('Star'));
            }
        }
        cc.log('_starList = ' + this._starList[0]._type);
    }

}
