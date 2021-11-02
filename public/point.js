// JavaScript source code
/*point=[x,y] or [x,y,z] or n-dimention
 * contour=[point0,point1,...]=[[x0,y0],[x1,y1],[x2,y2]]
 * contours=[contour0,contour1,countou2,...]
 * line=[point0,point1]  the start/end point
 */

function point_add(p0, p1) { return p0.map((e, i) => e + p1[i]); }
function point_sub(p0, p1) { return p0.map((e, i) => e - p1[i]); }
function point_mul(p0, a) { return p0.map((e, i) => e*a); }
function point_dot(p0, p1) { return point_sum1(p0.map((e, i) => e * p1[i])); }
function point_isZero(p) { return point_len(p)==0; }
function point_sum1(p) { return p.reduce((acc, cur) => acc + cur, 0); }
function point_sum2(p) { return p.reduce((acc, cur) => acc + cur**2, 0); }
function point_len(p) { return Math.sqrt(point_sum2(p)); }
function point_dist(p0, p1) { return point_len(point_sub(p0, p1)); }
function point_array_sum(pArray) { return pArray.reduce((acc, cur) => point_add(acc, cur));}
function point_array_avg(pArray) { return point_array_sum(pArray).map(x => x / pArray.length);}
function point_angle(p0, p1) {
    let c = point_dot(p0, p1) / point_len(p0) / point_len(p1); //cos
    return(Math.acos(c));
}
function point2line(p,line) {   // distance from point to line
    let p0 = point_sub(p,       line[0]);
    let p1 = point_sub(line[1], line[0]);
    if (point_isZero(p0) | point_isZero(p1)) return (0);

    let theta = point_angle(p0, p1);
    return Math.round(point_len(p0) * Math.sin(theta));
}
function point2lineSegVec(p, line) {      // min vector from point to line segment
    let p0 = point_sub(p, line[0]);
    let p1 = point_sub(line[1], line[0]);
    if (point_isZero(p0)) return (p0);
    if (point_isZero(p1)) return (p1);

    let theta = point_angle(p0, p1);
    let r = point_len(p0) * Math.cos(theta)/point_len(p1);
    let v = point_sub(point_mul(p1, r),p0);
    if (Math.cos(theta) < 0) { v = point_sub(line[0],p); }
    else if (point_len(p0) * Math.cos(theta) > point_len(p1)) { v = point_sub(line[1],p); }
    return v;
}
function point2lineSegPoint(p, line) { return point_add(p, point2lineSegVec(p, line)); }
function point2lineSeg(p, line) { return (point_len(point2lineSegVec(p, line)));}
/*
function point2lineSeg(p, line) {      // consider point to line segment
    let p0 = point_sub(p, line[0]);
    let p1 = point_sub(line[1], line[0]);
    if (point_isZero(p0) | point_isZero(p1)) return (0);

    let theta = point_angle(p0, p1);
    let r = point_len(p0) * Math.sin(theta);
    if (Math.cos(theta) < 0) { r = point_len(p0); }
    else if (point_len(p0) * Math.cos(theta) > point_len(p1)) { r = point_dist(p, line[1]); }
    return r;// Math.round(r);
}*/
function point2rect(p, r) {     // point min distance to rectangle
    let m = [
        p[0] - r[0][0],
        p[0] - r[1][0],
        p[1] - r[0][1],
        p[1] - r[1][1]].map(x=>Math.abs(x)).reduce((a,b)=>Math.min(a,b));
    return (m);
}
function point2poly(p, r) {     // point min distance to polygan
    let r1 = r.map((e, i) => ([e, r[(i + 1) % r.length]]));
    let m = r1.map(e => point2lineSeg(p, e))
              .reduce((a, b) => Math.min(a, b));
    return (m);
}
function point2polyPoint(p, r) {     // min point on polygan from point  to polygan
    let r1 = r.map((e, i) => ([e, r[(i + 1) % r.length]]));
    let m = r1.map(e => point2lineSegVec(p, e))
              .reduce((a, b) => ((point_len(b) > point_len(a)) ? a : b));
    return (point_add(p,m));
}
//export { point_sub, point_add, point_dist, point_angle, point2line,point2rect};