class myTable {
    fromUrl(url) {
        let json_string = UrlFetchApp.fetch(url).getContentText();
        let json = JSON.parse(json_string);
        //this.head = Object.keys(json[0]);
        //this.data = json.map(e => this.head.map(f => e[f]));
        return this.fromObject(json);
    }
    fromSheet(sheet_name = 'Sheet1') {
        let sheet = SpreadsheetApp.getActive().getSheetByName(sheet_name);
        let table = sheet.getDataRange().getValues()
            .filter(r => r.some(x => x)); // table is a range, filter out empty lines
        this.head = table[0];
        this.data = table.slice(1);
        return this;
    }
    fromHtmlTable(t) {
        let ary = [...t.rows].map(r => [...r.querySelectorAll('td,th')].map(c => c.innerText));
        this.head = ary[0];
        this.data = ary.slice(1);
        return this;
    }
    fromObject(json) {
        this.head = Object.keys(json[0]);
        json.forEach(row =>
            Object.keys(row).forEach(d => { if (!this.head.includes(d)) this.head.push(d) }))
        this.data = json.map(e => this.head.map(f => e[f]));
        return this;
    }
    toSheet(sheet_name = 'Sheet1') {
        let values = [this.head, ...this.data];
        let sheet = SpreadsheetApp.getActive().getSheetByName(sheet_name) ||
            SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheet_name); // create new sheet if sheet not exist
        sheet.clearContents();
        sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
        return this;
    }
    toObject() {
        let a2m = (a) => { let m = {}; a.map((e, i) => m[this.head[i]] = e); return m; };
        let json = this.data.map(a2m);
        //let json=values.map((v)=>(v.reduce((obj,data,i)=>({...obj,[headers[i]]:data}),{})));
        return json;
    }
    toHtmlTable(parent) {
        let table = document.createElement('table');
        let tr = document.createElement('tr');
        this.head.forEach(d => {
            let th = document.createElement('th');
            th.innerText = d;
            tr.appendChild(th);
        });
        table.appendChild(tr);
        this.data.forEach(row => {
            tr = document.createElement('tr');
            row.forEach(d => {
                let td = document.createElement('td');
                td.innerText = d;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        })
        parent.appendChild(table);
    }
    merge(t) { //merge table t into this
        for (let i of t.head) if (!this.head.includes(i)) this.head.push(i);
        let d = [...this.toObject(), ...t.toObject()];
        this.data = d.map(e => this.head.map(f => e[f]));
        return this;
    }

}
a0 = document.querySelector('#table0');
a1 = document.querySelector('#table1');
a2 = document.querySelector('#table2');
a3 = document.querySelector('#table3');
t0 = new myTable; t1 = new myTable; t2 = new myTable; t3 = new myTable;
t0.fromHtmlTable(a0);
t1.fromHtmlTable(a1);
t2.fromHtmlTable(a2);
t3.fromHtmlTable(a3);
t4 = new myTable;
t4.fromObject(t3.toObject())
url = "https://script.google.com/macros/s/AKfycbz4kvSzlBfJIah-OJUdfR5cDuxRrnmIo-vDCLa1Jm-GLR1XbQ4von9k8ADmsJjW9UXg/exec?cmd=post&sheetname=Sheet6"
fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(t3.toObject()),
})
