// JavaScript source code
//   <video src="Billard/IMG_0529.MOV" style="display: none"></video>
document.querySelector('input').addEventListener('change', extractFrames, false);
//var canvas = document.createElement('canvas');
//var pro = document.querySelector('#progress');
//pro.appendChild(canvas);
let db1 = document.querySelector('#canvas_debug1')
let db2 = document.querySelector('#canvas_debug2')
let vid = document.querySelector('#canvas_video');
let ctx = vid.getContext('2d');
let pro = document.querySelector('#progress');
let txt = document.querySelector('#frameTime');
let cnt = 0, pastTime = 0;
let img, hsv , table , pocket, kernel, lines, contour,centroid;
//var video = document.createElement('video');
var video = document.querySelector('video');
play_button()


function image_process(img) {  // the main loop for each image processing
    //opencv_canny(img);
    cv.cvtColor(img, hsv, cv.COLOR_RGB2HSV, 0);
    find_table(hsv, table);    find_pocket(hsv, pocket);
    remove_line(table, 10)
    lines=find_lines(table); plot_lines(lines, img); 

    //cv.imshow(db1, pocket);
    [contour, centroid] = find_table_contour();
    //if (lines.rows != 3) { console.log("at", cnt, "line#=", lines.rows); }
    console.log("at", cnt, "line#=", lines.length, "centroid=", centroid);
    all_vertex=get_all_vertex();
    //cv.imshow(db1, table);
    cv.imshow(db2, pocket);
}
function drawFrame(e) {
    this.pause();
    ctx.drawImage(this, 0, 0, vid.width, vid.height);

    txt.innerText += "\n" + cnt + " " + this.currentTime + "\t " + (this.currentTime - pastTime);
    cnt++; pastTime = this.currentTime
    pro.innerHTML = ((this.currentTime / this.duration) * 100).toFixed(2) + ' %';
    //await sleep(0);
    ctx.font = "150% Verdana";
    ctx.fillText(this.currentTime, 10, 50)
    img = cv.imread(vid)
    //image_process(img);
    //img.delete();  // possible memory leak, TBD

    if (this.currentTime < this.duration) {
        this.play();
    }
    //if (is_playing) this.play(); else this.pause();
}

function extractFrames() {

    cnt=0
    vid.width = 800;//canvas_video.parentElement.width;
    vid.height = 800 / 1920 * 1080
    canvas_debug3.width = vid.width;
    canvas_debug3.height = vid.height;
    clearMsg();


    function initCanvas(e) {
        //canvas_video.width = this.videoWidth;
        //canvas_video.height = this.videoHeight;
        vid.width  = 800;//canvas_video.parentElement.width;
        vid.height = 800 / this.videoWidth * this.videoHeight;
        clearMsg();
    }


    function clearMsg() {
        all_p = document.querySelectorAll("body div p")
        all_p.forEach(p => p.innerText = "")
    }
    function saveFrame(blob) {
        array.push(blob);
    }

    function revokeURL(e) {
        URL.revokeObjectURL(this.src);
    }

    function onend(e) {
        console.log("video end event") // No this event in Chrome !!
        this.pause();
    }

    video.muted = true;

    video.addEventListener('loadedmetadata', initCanvas, false);
    video.addEventListener('timeupdate', drawFrame, false);
    video.addEventListener('ended', onend, false);


    //video.src = URL.createObjectURL(this.files[0]);
    //video.srcObject=this.files[0]
    video.play();
}

function onOpenCvReady() {
    console.log('OpenCV.js is ready.')
    setTimeout(() => {
        hsv = new cv.Mat();
        table = new cv.Mat();
        pocket = new cv.Mat();
        kernel = cv.Mat.ones(9, 9, cv.CV_8U);

        extractFrames.call(video);
    }, 1000)
}
