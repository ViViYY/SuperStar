export class GameData
{
    //当前关卡
    private _chapter: number = 0;
    public get chapter() : number {
        return this._chapter;
    }
    public set chapter(v : number) {
        this._chapter = v;
    }
    //当前得分
    private _score: number = 0;
    public get score() : number {
        return this._score;
    }
    public set score(v : number) {
        this._score = v;
    }
    //星星样式
    private _starPattern: string = "";
    public get starPattern() : string {
        return this._starPattern;
    }
    public set starPattern(v : string) {
        this._starPattern = v;
    }
    

    constructor()
    {

    }
    public reset(): void{
        this.chapter = 1;
        this.score = 0;
        this._starPattern = "";
    }
    //注意，Singleton是要替换成你自己实现的子类 这里没有实际的作用
    private static instance: GameData = null;
    /**
     * 获取实例的静态方法实例
     * @return
     *
     */
    public static getInstance(): GameData
    {
        if(!this.instance)
        {
            this.instance = new GameData();
        }
        return this.instance;
    }

    //关卡结束
    public chapterEnd(): void{
        this.chapter++;
    }

    //保存当前数据
    public saveCurrentData(): void{
        //chapter
        let str: string = this.chapter.toString();
        cc.sys.localStorage.setItem('superstar_cur_chapter', str);
        //score
        str = this.score.toString();
        cc.sys.localStorage.setItem('superstar_cur_score', str);
        //pattern
        str = this.starPattern.toString();
        cc.sys.localStorage.setItem('superstar_cur_pattern', str);
    }

    //读取当前数据
    public loadCurrentData(): void{
        this.chapter = cc.sys.localStorage.getItem('superstar_cur_chapter');
        this.score = cc.sys.localStorage.getItem('superstar_cur_score');
        this.starPattern = cc.sys.localStorage.getItem('superstar_cur_pattern');
    }

    // 获取指定关卡的历史最高分记录
    public getHistoryChapter(chapter: number): number {
        let history = cc.sys.localStorage.getItem('superstar_history');
        if(!history){
            return 0;
        }
        let data: Object = JSON.parse(history);
        if(!data || !data[chapter]){
            return 0;
        }
        return data[chapter];
    }
    // 对比并保存指定关卡的历史最高分记录
    public saveHistoryChapter(chapter: number): void{
        let history = cc.sys.localStorage.getItem('superstar_history');
        if(!history){
            history = {};
        } else {
            history = JSON.parse(history);
        }
        history[chapter] = this.score;
        let str: string = JSON.stringify(history);
        cc.sys.localStorage.setItem('superstar_history', str);
    }

    //得分
    public addScore(num: number): void{
        this.score += num;
        let historyBest = this.getHistoryChapter(this.chapter);
        if(this.score > historyBest){
            this.saveHistoryChapter(this.chapter);
        }
    }

    //获取过关目标分数
    public getTargetScore(): number{
        // 1000 2500 4500 7000 9000 12000 14000 17000 19000 22000 25000 28000 31000 ...... +3000
        const scores: number[] = [500, 1000, 2500, 4500, 7000, 9000, 12000, 14000, 17000, 19000];
        if( this.chapter <= 9 ){
            return scores[this.chapter];
        }
        return 19000 + ( this.chapter - 9 ) * 3000;
    }

    public printHistory(): void{
        let history = cc.sys.localStorage.getItem('superstar_history');
        cc.log(' history data:  ' + JSON.stringify(history));
    }
    
}
