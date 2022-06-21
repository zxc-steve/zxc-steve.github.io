console.log("hello !");
class convertSpanTable {
    // in-place convert HTMl table with colspan/rowspan to regular table

    constructor(t) {
        this.table = t; this.update();
        this.all_span = this.all_cell.filter(c => c.rowSpan > 1 || c.colSpan > 1);
        this.all_span.forEach(c => this.insertCellSpan(c))
    }
    update() {
        this.row_size = [...this.table.rows].map(r => r.querySelectorAll("td,th").length);
        this.all_cell = [...this.table.querySelectorAll("td,th")];
    }
    getCell(row, col) {
        let pos = 0;
        for (let i = 0; i < row; i++)pos += this.row_size[i];
        return this.all_cell[pos + col];
    }
    cellPosition(cell) {
        let r = 0;
        let index = this.all_cell.findIndex(c => c === cell);
        while (this.row_size[r] <= index) { index -= this.row_size[r]; r++ }
        return [r, index]; //[row,col]
    }

    insertColCellBefore(cell, innerTxt) {
        let c = document.createElement("td")
        c.innerText = innerTxt || cell.innerText;
        cell.insertAdjacentElement('beforebegin', c);
    }
    insertCellSpan(cell) {
        let [rspan, cspan] = [cell.rowSpan, cell.colSpan];
        let [r, c] = this.cellPosition(cell);

        for (let i = 0; i < rspan; i++)
            for (let j = 0; j < cspan; j++) {
                if (i == 0 && j == 0) continue;
                this.insertColCellBefore(this.getCell(r + i, c), cell.innerText);
            }
        cell.removeAttribute("colspan"); cell.removeAttribute("rowspan");
        this.update();
    }
    toJSON() { // Json array of object,
        let ary = [...this.table.rows].map(r => [...r.querySelectorAll('td,th')].map(c => c.innerText));
        let head = ary[0];
        let a2o = (a) => { let m = {}; a.map((e, i) => m[head[i]] = e); return m; };
        return ary.slice(1).map(a2o);
    }
    toArray() { // 2D array
        return [...this.table.rows].map(r => [...r.querySelectorAll('td,th')].map(c => c.innerText));
    }
}
/*
t0 = document.querySelectorAll("#table1 tr");
h  = [...t0][0].querySelectorAll('td,th')
d0 = [...t0][1].querySelectorAll('td,th')
d1 = [...t0][2].querySelectorAll('td,th')
d2 = [...t0][3].querySelectorAll('td,th')
d3 = [...t0][4].querySelectorAll('td,th')
*/
t = new convertSpanTable(document.querySelector("#table1"));
t = new convertSpanTable(document.querySelector("#table3"));

Object.prototype.getSpanSteve = function () { //not used
    return [this.getAttribute("rowspan"), this.getAttribute("colspan")]
}