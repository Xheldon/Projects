window.onload = function () {
    let canvas = document.getElementById('paint');
    let control = {
        color: 'black',
        tool: 'pencil',
        toolOption: {
            nibType: 'arc'
        },
        thickness: 1
    };
    //工具选择
    let tools = document.getElementById('tools');

    // 铅笔绘图函数
    let draw  = function (ctx, radius, pointer) {
        ctx.beginPath();
        ctx.fillStyle = control.color;
        ctx.arc(pointer.x, pointer.y, 50, 0, Math.PI*2, true);
        ctx.save();
        ctx.clip();
        let img = new Image();
        img.src = './img/bg_1.png';
        ctx.drawImage(img, 0, 0, 400, 250);
        ctx.restore();


    };
    if (canvas && canvas.getContext) {
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = './img/fg.png';
        let downFlag = 0;
        ctx.drawImage(img, 0, 0, 400, 250);
        canvas.addEventListener('mousedown', function (e) {
            e.preventDefault();
            console.log('start');
            downFlag = 1;
            draw(ctx, control.thickness, {
                x: e.offsetX,
                y: e.offsetY,
                type: control.toolOption.nibType
            })
        });
        canvas.addEventListener('mousemove', function (e) {
            e.preventDefault();
            if (downFlag) {
                draw(ctx, control.thickness, {
                    x: e.offsetX,
                    y: e.offsetY,
                    type: control.toolOption.nibType
                });
            }
        });
        canvas.addEventListener('mouseup', function (e) {
            e.preventDefault();
            downFlag = 0;
        });
    }
};
