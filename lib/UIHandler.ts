///<reference path="WebSheet.ts"/>
///<reference path="../js/jquery.d.ts"/>
/**
 * Created by SiamandM on 6/17/2016.
 */
class UIHandler {
    constructor(public controler:UIHandlerControler ){
    }

    click(){

    }

    dblClick(){

    }

    mouseDown(x,y){

    }

    mouseMove(x,y){

    }

    mouseUp(x,y){

    }

    mouseWheel(dx,dy){

    }

    keyDown(evt){

    }

    keyPress(evt){

    }

    keyUp(evt){

    }
}

class WebSheetUIHandler  extends  UIHandler{

    mouseUp(x,y){
        if(y<this.controler.websheet.height - WebSheet.SheetTitleHeight){
            return;
        }

        x=x-Row.HeaderWidth;

        let sheets = this.controler.websheet.sheets;
        let tx = 0;
        for(let i=0;i<sheets.length;i++){
            let sheet = sheets[i];
            let min = tx;
            let max = tx + sheet.tabWidth + 5;

            if(x > min && x< max){
                this.controler.websheet.setActiveSheet(sheet);
                break;
            }
            tx += sheet.tabWidth ;
        }
    }

}

class SheetUIHandler extends  UIHandler{

    private  wheelDeltaX:number=0;
    private  wheelDeltaY:number=0;

    mouseWheel(dx, dy) {

        this.wheelDeltaX += dx;
        this.wheelDeltaY += dy;

        let websheet = this.controler.websheet;
        let sheet =websheet.getActiveSheet();
        let delta = 120;

        if (this.wheelDeltaX > delta) {
            sheet.scrollLeft();
            this.wheelDeltaX = 0;
        } else if (this.wheelDeltaX < -delta) {
            sheet.scrollRight();
            this.wheelDeltaX = 0;
        }

        if (this.wheelDeltaY > delta) {
            sheet.scrollDown();
            this.wheelDeltaY = 0;
        } else if (this.wheelDeltaY < -delta) {
            sheet.scrollUp();
            this.wheelDeltaY = 0;
        }
        websheet.render();

    }

}

class UIHandlerControler {

    handlers:UIHandler[]=[];

    constructor(public websheet:WebSheet){
        this.addHandlers();
        this.attachEvents();
    }

    addHandlers(){
        this.handlers.push(new WebSheetUIHandler(this));
        this.handlers.push(new SheetUIHandler(this));
    }

    attachEvents(){
        let element = this.websheet.element;
        let controler = this;

        let getXY = function (evt) {
            var x = evt.offsetX || evt.layerX || (evt.clientX - element.offsetLeft);
            var y = evt.offsetY || evt.layerY || (evt.clientY - element.offsetTop);

            return {'x': x, 'y': y}
        };

        $(element)
            .mousedown(function (evt) {
                let pos = getXY(evt);
                controler.mouseDown( pos.x, pos.y);
            })
            .mousemove(function (evt) {
                let pos = getXY(evt);
                controler.mouseMove(pos.x, pos.y);
            })
            .mouseup(function (evt) {
                let pos = getXY(evt);
                controler.mouseUp(pos.x, pos.y);
            })
            .click(function (evt) {
                controler.click();
            })
            .dblclick(function (evt) {
                controler.dblClick();
            })
            .bind('mousewheel', function (evtE) {
                var evt:any = evtE;
                let dx = evt.originalEvent.wheelDeltaX;
                let dy = evt.originalEvent.wheelDeltaY;
                controler.mouseWheel(dx, dy);
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            })
            .keydown(function (evt) {
                controler.keyDown(evt.originalEvent)
            })
            .keypress(function (evt) {
                controler.keyPress(evt.originalEvent);
            })
            .keyup(function (evt) {
                controler.keyUp(evt.originalEvent);
            });


        $(window).resize(function () {
            controler.websheet.resize();
        });


    }

    click(){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].click();
        }
    }

    dblClick(){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].dblClick();
        }
    }

    mouseDown(x,y){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].mouseDown(x,y);
        }
    }

    mouseMove(x,y){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].mouseMove(x,y);
        }
    }

    mouseUp(x,y){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].mouseUp(x,y);
        }
    }

    mouseWheel(dx,dy){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].mouseWheel(dx,dy);
        }
    }

    keyDown(evt){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].keyDown(evt);
        }
    }

    keyPress(evt){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].keyPress(evt);
        }
    }

    keyUp(evt){
        for(let i=0;i<this.handlers.length;i++){
            this.handlers[i].keyUp(evt);
        }
    }

}