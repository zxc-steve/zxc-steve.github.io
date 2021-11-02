// JavaScript source code
function data_grouping(din) {
    let groups = [];    //grouping output=[[group0],[group1],[group2]
                        // =[[d0,d2,d4,d5],[d1,d6],[d3]]. 2D array
    /*
        def same_line(a,b):
        return( (abs(a[0]-b[0]) < 100)   # pixel difference
              & (abs(a[1]-b[1]) < 0.10)) # angle differenece
     */
    function dataDistance(a, d1b) {
        return !((Math.abs(a[0] - b[0]) < 100)   // pixel difference
              & (Math.abs(a[1] - b[1]) < 0.10)) // angle differenece
    }
    function dataInGroup(d, group) {
        min_dist = group.map(d0 => dataDistance(d0, d)).reduce((a, b) => Math.min(a, b));
        return(min_dist < 0.5)
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
        if (is_new_data) {groups.push([d])}
    }
    din.forEach(d => addData(d))
}