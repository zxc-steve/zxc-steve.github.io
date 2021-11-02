// JavaScript source code
/*
function mat2value(m, x, y) {
    switch (m.type()) {
        case cv.CV_8U: return m.ucharAt(x, y)     break;
        case cv.CV_8S: return m.charAt      break;
        case cv.CV_16U: return m.ushortAt   break;
        case cv.CV_16S: return m.shortAt    break;
        case cv.CV_32S: return m.intAt      break;
        case cv.CV_32F: return m.floatAt    break;
        case cv.CV_64F: return m.doubleAt   break;

        default:
            console.log(`MAT type error of ${m}.`);
    }
}*/


let ctx_plotlines = canvas_debug3.getContext('2d');
function plot_lines(lines, img) {
    // draw lines
    let path2d = new Path2D();
    //for (let i = 0; i < lines.rows; ++i) {
    for (let i = 0; i < lines.length; ++i) {
        //let rho = lines.data32F[i * 2];
        //let theta = lines.data32F[i * 2 + 1];
        let rho = lines[i][0];
        let theta = lines[i][1];
        let a = Math.cos(theta);
        let b = Math.sin(theta);
        let x0 = a * rho;
        let y0 = b * rho;
        let startPoint = [Math.round(x0 - 1000 * b), Math.round(y0 + 1000 * a) ];
        let endPoint = [Math.round(x0 + 1000 * b), Math.round(y0 - 1000 * a) ];
        //cv.line(img, startPoint, endPoint, [255, 0, 0, 255]);
        
        path2d.moveTo(...startPoint)
        path2d.lineTo(...endPoint)
 
    }
    ctx.strokeStyle = "rgb(255, 0, 0)"; // or "red"
    ctx.lineWidth = 3;
    ctx.stroke(path2d);
    ctx_plotlines.clearRect(0, 0, canvas_debug3.width, canvas_debug3.height);
    ctx_plotlines.strokeStyle = "rgb(255, 0, 0)"; // or "red"
    ctx_plotlines.lineWidth = 3;  // for  find_table_contour, cannot use img to find red lines ???
    ctx_plotlines.stroke(path2d);
}
function plot_vertex(vs,color) {
    vs.forEach(v => {
        ctx.beginPath();
        ctx.arc(...v, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color;ctx.fill();
    })
}
function data_grouping(din) {
    let groups = [];    //grouping output=[[group0],[group1],[group2]
    // =[[d0,d2,d4,d5],[d1,d6],[d3]]. 2D array
    /*
        def same_line(a,b):
        return( (abs(a[0]-b[0]) < 100)   # pixel difference
              & (abs(a[1]-b[1]) < 0.10)) # angle differenece
     */
    function dataDistance(a, b) {
        return !((Math.abs(a[0] - b[0]) < 100)   // pixel difference
            & (Math.abs(a[1] - b[1]) < 0.10)) // angle differenece
    }
    function dataInGroup(d, group) {
        min_dist = group.map(d0 => dataDistance(d0, d)).reduce((a, b) => Math.min(a, b));
        return (min_dist < 0.5)
    }
    function addData(d) {
        is_new_data = true;
        for (group of groups) {
            if (dataInGroup(d, group)) {
                is_new_data = false;
                group.push(d);
                break;
            }
        }
        if (is_new_data) { groups.push([d]) }
    }
    
    din.forEach(d => addData(d));
    //groups.forEach(x => console.log(JSON.stringify(x)))
    //let average = array => array.reduce((a, b) => a + b) / array.length;
    let groupMean = g => g.reduce((acc, line) => point_add(acc, line)).map(x => x / g.length);
    return groups.map(x=>groupMean(x))
}
function find_lines(t) {
    let edges = new cv.Mat();
    let linesMat = new cv.Mat();
    cv.Canny(t, edges, 255*0.3, 255*0.7, 3, false);
    //edges = cv.Canny(t, 0.3, 0.7, apertureSize = 3)
    cv.HoughLines(edges, linesMat, 2, Math.PI / 180, 130) // 160 in python video, try smaller
    //cv.HoughLinesWithAccumulator(edges, lines, 2, Math.PI / 180, 160)
    //cv.HoughLinesP(edges, linesP, 2, Math.PI / 90, 100, 50, 50); // not useful, too many line segments

    lines = mat2lines(linesMat);
    lines = data_grouping(lines);
    [linesMat, edges].forEach(x => x.delete());
    return (lines.slice(0,3));
}
function mat2stats(stats) {
    if (stats.type() != cv.CV_32S) { console.log("error in mat2"); return ([]); }
    let points = []
    for (let j = 0; j < stats.data32S.length; j += stats.cols) {
        let row = [];
        for (let i = 0; i < stats.cols; i++) {
            row.push([stats.data32S[j+i]])
        }
        points.push(row)
    }
    return (points)
}
function mat2points(contour) {
    if (contour.type() != cv.CV_32SC2) { console.log("error in mat2point"); return ([]); }
    let points = []
    for (let j = 0; j < contour.data32S.length; j += 2) {
        points.push([contour.data32S[j], contour.data32S[j + 1]])
    }
    return (points)
}
function mat2centroid(centroids) {
    if (centroids.type() != cv.CV_64F) { console.log("error in mat2centroid"); return ([]); }
    let points = []
    for (let j = 0; j < centroids.data64F.length; j += 2) {
        points.push([Math.round(centroids.data64F[j]), Math.round(centroids.data64F[j + 1])])
    }
    return (points)
}
function mat2lines(lines) {
    if (lines.type() != cv.CV_32FC2) { console.log("error in mat2lines"); return ([]); }
    let points = []
    for (let j = 0; j < lines.data32F.length; j += 2) {
        points.push([lines.data32F[j], lines.data32F[j + 1]])
    }
    return (points)
}
function find_table_contour() {
    let t = new cv.Mat(), t1 = new cv.Mat();
    let marker = new cv.Mat();
    let Moments = cv.moments(table, true)
    let cx = Math.round(Moments.m10 / Moments.m00);
    let cy = Math.round(Moments.m01 / Moments.m00); //centroid at [cx,cxy]

    let img0 = cv.imread(canvas_debug3)
    opencv_inrange(img0, [255, 0, 0, 0], [255, 0, 0, 255], t)
    opencv_inrange(t, [0, 0, 0, 0], [0, 0, 0, 255], t1)
    cv.connectedComponents(t1, marker)
    //i=6;opencv_inrange(marker,[i,i,i,i],[i,i,i,i],t);cv.imshow(canvas_debug2,t); to show area at 6
    c = marker.intAt(cy, cx)
    opencv_inrange(marker, [c, c, c, c], [c, c, c, c], t)    // t is now table area defined by lines

    find_new_pocket(t)
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat(), contour0 = new cv.Mat();
    cv.findContours(t, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    //contour = contours.get(0);
    epsilon = 0.01 * cv.arcLength(contours.get(0), true)
    cv.approxPolyDP(contours.get(0), contour0, epsilon, true);
    contour_points = mat2points(contour0);

    [img0, t, t1, marker,  contours, contour0, hierarchy].forEach(x => x.delete());
    return ([contour_points, [cx,cy]])
}
function get_pocket_vertex() {
    let marker = new cv.Mat(), stats = new cv.Mat(), centroids = new cv.Mat();
    cv.connectedComponentsWithStats(pocket, marker, stats, centroids);
    let cs = mat2centroid(centroids).slice(1);    // cs centroids: standard javascript array
    let ss = mat2stats(stats).slice(1);          // ss stats
    let p_vertex = [];
    for (let i = 0; i < cs.length; i++) {
        let c = cs[i], s = ss[i];
        if (point2poly(c, contour) < 20 & s[4] > 300) { p_vertex.push(point2polyPoint(c,contour));}
    }
    [marker, stats, centroids].forEach(x => x.delete());
    return (p_vertex);
}
function get_all_vertex() {
    let min_point_dist = (v, vs) => Math.min(...vs.map(d => point_dist(v, d)));
    let min_dist_point = (v, vs) => vs.reduce((acc, cur) => point_dist(acc, v) > point_dist(cur, v) ? cur : acc);
    let rect = [[0, 0], [img.cols, img.rows]];
    let L = contour.length, B=10;
    t_vertex = contour.filter(v => point2rect(v, rect) > B);
    b_vertex = contour.filter((v, i) => (point2rect(v, rect) <= B) &
        ((point2rect(contour[(i + 1) % L], rect) > B) | (point2rect(contour[(i - 1 + L) % L], rect) > B)));
    p_vertex = get_pocket_vertex();
    plot_vertex(t_vertex, '#ff0000'); plot_vertex(p_vertex, '#ffff00'); plot_vertex(b_vertex, '#ff00ff');
    p_vertex = p_vertex.filter(v => min_point_dist(v, t_vertex) > 100);
    if (p_vertex.length > 2) p_vertex = b_vertex.map(v => min_dist_point(v, p_vertex));
    all_vertex = t_vertex.length == 4 ? t_vertex : [...t_vertex, ...p_vertex];
    let atan2 = v => Math.atan2(...point_sub(v, centroid));
    all_vertex.sort((v1, v2) => atan2(v1) - atan2(v2));
    return (all_vertex);           
}
/*
function find_table_contour(){
    let t = new cv.Mat(), t1 = new cv.Mat(); 
    let marker = new cv.Mat(), stats = new cv.Mat(), centroids = new cv.Mat();
    let img0 = cv.imread(canvas_debug3)
    opencv_inrange(img0, [255, 0, 0, 0], [255, 0, 0, 255], t)
    opencv_inrange(t, [0, 0, 0, 0], [0, 0, 0, 255], t1)
    cv.connectedComponentsWithStats(t1, marker, stats, centroids)
    //i=6;opencv_inrange(marker,[i,i,i,i],[i,i,i,i],t);cv.imshow(canvas_debug2,t); to show area at 6
    c = marker.intAt(vid.height / 2 * 1.1, vid.width / 2)
    opencv_inrange(marker, [c, c, c, c], [c, c, c, c], t)    // t is now table area defined by lines
    cv.imshow(db1, t);

    find_new_pocket(t)
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat(), contour0 = new cv.Mat();
    cv.findContours(t, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    //contour = contours.get(0);
    epsilon = 0.01 * cv.arcLength(contours.get(0), true)
    cv.approxPolyDP(contours.get(0), contour0, epsilon, true);
    contour_points = mat2points(contour0);
    centroid = mat2centroid(centroids)[c];
    [img0, t, t1, marker, stats, centroids, contours, contour0, hierarchy].forEach(x => x.delete());
    return([contour_points,centroid])
}*/

function find_new_pocket(t) {
    let p2 = new cv.Mat();
    let t_inv = new cv.Mat(); 
    let mask = new cv.Mat();
    cv.bitwise_not(t, t_inv); cv.dilate(t_inv, t_inv, kernel); cv.dilate(t_inv, t_inv, kernel);
    cv.bitwise_xor(table, t, p2, mask);  //# p2: where table and  contour inside are different
    cv.bitwise_and(p2, t_inv, p2, mask);
    remove_line(p2, 13);
    cv.bitwise_or(pocket, p2, pocket, mask);
    cv.morphologyEx(pocket, pocket, cv.MORPH_CLOSE, kernel);

    [p2,mask].forEach(x => x.delete());
}
function find_table(hsv,table) {
    opencv_inrange(hsv, [100, 150, 0, 0], [120, 250, 255, 255], table);
    //cv.morphologyEx(table, table, cv.MORPH_CLOSE, kernel, iterations = 3)
    cv.morphologyEx(table, table, cv.MORPH_CLOSE, kernel)
    cv.morphologyEx(table, table, cv.MORPH_CLOSE, kernel)
}

function find_pocket(hsv,pocket) {
    opencv_inrange(hsv, [90, 50, 0, 0], [130, 200, 80, 255], pocket);
    cv.erode(       pocket, pocket, kernel)
    //cv.morphologyEx(pocket, pocket, cv.MORPH_CLOSE, kernel, iterations = 2)
    cv.morphologyEx(pocket, pocket, cv.MORPH_CLOSE, kernel)
    cv.morphologyEx(pocket, pocket, cv.MORPH_CLOSE, kernel)
    cv.dilate(      pocket, pocket, kernel)
}
function remove_line(src, size) {
    k = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, size))
    cv.erode(src, src, k); cv.dilate(src, src, k);
    k = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(size, 1))
    cv.erode(src, src, k); cv.dilate(src, src, k);
}
function opencv_inrange(src,low,high,dst) {
    //let dst = new cv.Mat();
    low = new cv.Mat(src.rows, src.cols, src.type(), low);
    high = new cv.Mat(src.rows, src.cols, src.type(), high);
    //let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    //let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
    // You can try more different parameters
    cv.inRange(src, low, high, dst);
    //cv.imshow('canvasOutput', dst);
    low.delete(); high.delete();
}
function opencv_hsv(img) {  // cv.imread(imageSource): return mat with channels stored in RGBA order
    let dst = new cv.Mat();
    cv.cvtColor(img, dst, cv.COLOR_RGB2HSV, 0);
    //cv.imshow(canvas_debug, dst);
    //cv.imshow('canvas_debug1', dst);
    return(dst)
}
function opencv_canny(img) {
    let dst = new cv.Mat();
    cv.cvtColor(img, dst, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Canny(dst, dst, 50, 100, 3, false);
    cv.imshow(db1, dst);
    dst.delete()
}
//let is_playing = true;
function play_button() {
    let bt = document.querySelector('#play_button')
    bt.addEventListener('click', e => {
        /*if (is_playing) { is_playing = false; bt.innerText = "Play"; ;}
        else { is_playing = true; bt.innerText = "Pause";}*/
        video.play();
    })
}
