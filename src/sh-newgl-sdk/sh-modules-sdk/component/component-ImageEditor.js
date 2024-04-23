export class ImageEditor{
    constructor(){
        this.ctx = null;
        this.canvasDom = null;
    }

    init(canvasDomElement) {

        this.canvasDom = document.getElementById(canvasDomElement)
        this.ctx = this.canvasDom.getContext('2d');
    
    };
    
    
    // 清除画布
    clear() {
    
        this.ctx.clearRect(0, 0, 1000, 1000);
    
    };
    
    
    
    
    // 上传一张图片到图片编辑器
    // 参数：file，代表通过input file拿到的文件
    upload(file) {
    
        let reader = new FileReader();
    
        reader.onload = function(e) {
    
            let img = new Image();
            img.src = e.target.result;
    
            img.onload = function() {
    
                putImageInEditor(this, ImageEditor.ctx);
            }
    
        };
    
        reader.readAsDataURL(file);
    
    }
    
    
    modify(src) {
    
        this.clear();
    
        let img = new Image();
        img.src = src;
    
        putImageInEditor(img, this.ctx);
    
    }
    
    
    
    // 用来将canvas转换为img元素，并返回这个元素
    convertCanvasToImage() {
    
        let img = Canvas2Image.convertToPNG(this.canvasDom, this.canvasDom.width, this.canvasDom.height);
        img.style.height = '100%';
    
        return img;
    
    }
    
    
    // 该方法用来将canvas图片”贴在“某个dom元素下面
    // 参数 targetDom：代表将要把canvas图片贴在的那个目标元素
    assignCanvasImageTo(targetDom, img) {
    
        targetDom.innerHtml = '';
        targetDom.appendChild(img);
    
    }

     putImageInEditor(img, ctx) {

        let w = img.width;
        let h = img.height;
    
    
        let cw = 1000;
        let ch = 1000;
    
        let iw, ih;
    
        if (w >= h) {
            iw = cw;
            ih = iw * (h / w);
        } else {
            ih = ch;
            iw = ih * (w / h);
        }
    
    
        ctx.clearRect(0, 0, cw, ch);
    
        ctx.save();
    
        ctx.translate(cw / 2, ch / 2);
        ctx.drawImage(img, 0, 0, w, h, -iw / 2, -ih / 2, iw, ih);
    
        ctx.restore();
    
    }
    
}
// 环绕海报
/*
const ImageEditor = {

    ctx: null,
    canvasDom: null

};

ImageEditor.init = function(canvasDomElement) {

    this.canvasDom = document.getElementById(canvasDomElement)
    this.ctx = this.canvasDom.getContext('2d');

};


// 清除画布
ImageEditor.clear = function() {

    this.ctx.clearRect(0, 0, 1000, 1000);

};




// 上传一张图片到图片编辑器
// 参数：file，代表通过input file拿到的文件
ImageEditor.upload = function(file) {

    let reader = new FileReader();

    reader.onload = function(e) {

        let img = new Image();
        img.src = e.target.result;

        img.onload = function() {

            putImageInEditor(this, ImageEditor.ctx);
        }

    };

    reader.readAsDataURL(file);

}


ImageEditor.modify = function(src) {

    this.clear();

    let img = new Image();
    img.src = src;

    putImageInEditor(img, this.ctx);

}



// 用来将canvas转换为img元素，并返回这个元素
ImageEditor.convertCanvasToImage = function() {

    let img = Canvas2Image.convertToPNG(this.canvasDom, this.canvasDom.width, this.canvasDom.height);
    img.style.height = '100%';

    return img;

}


// 该方法用来将canvas图片”贴在“某个dom元素下面
// 参数 targetDom：代表将要把canvas图片贴在的那个目标元素
ImageEditor.assignCanvasImageTo = function(targetDom, img) {

    targetDom.innerHtml = '';
    targetDom.appendChild(img);

}







function putImageInEditor(img, ctx) {

    let w = img.width;
    let h = img.height;


    let cw = 1000;
    let ch = 1000;

    let iw, ih;

    if (w >= h) {
        iw = cw;
        ih = iw * (h / w);
    } else {
        ih = ch;
        iw = ih * (w / h);
    }


    ctx.clearRect(0, 0, cw, ch);

    ctx.save();

    ctx.translate(cw / 2, ch / 2);
    ctx.drawImage(img, 0, 0, w, h, -iw / 2, -ih / 2, iw, ih);

    ctx.restore();

}


"object" == typeof exports && "object" == typeof module ?
    (module.exports = t()) :
    "";

function t() {
    return { ImageEditor };
}*/