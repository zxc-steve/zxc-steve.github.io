import { convertSpanTable } from './convertSpanTable.js'
import { myTable } from './myTable.js'
/*
 var convertSpanTable;
(async () => {
    const m = await import('./convertSpanTable.js');
    convertSpanTable = m.convertSpanTable
    console.log(convertSpanTable);
})();
*/
debugger
let a0 = document.querySelector('#table0');
let a1 = document.querySelector('#table1');
let a2 = document.querySelector('#table2');
let a3 = document.querySelector('#table3');
new convertSpanTable(a1);
new convertSpanTable(a3);

let t0 = new myTable; let t1 = new myTable; let t2 = new myTable; let t3 = new myTable;
t0.fromHtmlTable(a0);
t1.fromHtmlTable(a1);
t2.fromHtmlTable(a2);
t3.fromHtmlTable(a3);
let t4 = new myTable;
t4.fromObject(t3.toObject())
let url = "https://script.google.com/macros/s/AKfycbzmYr2V_b7HX6efdfbPchupaHCuH0CzVD2l93zu3ujzHesOErbpHSZoaaJ-wGF6lJ_s/exec";
let posturl = url + "?cmd=post&sheetname=Sheet6"
let geturl = url + "?cmd=get&sheetname=Sheet6"
let appendurl = url + "?cmd=append&sheetname=Sheet6"

let getGoogleSheet = async () => {

    // simple HTTP get
    let a = await fetch(geturl);
    let b = await a.json();
    console.log(b.json);
    console.log('-'.repeat(30));
    // Post with table json
    a = await fetch(posturl,
        {
            method: 'POST',
            body: JSON.stringify(t3.toObject())
        });
    b = await a.json();
    console.log(b);
    console.log('-'.repeat(30));
    // Post with table json
    a = await fetch(appendurl,
        {
            method: 'POST',
            body: JSON.stringify(t2.toObject())
        });
    b = await a.json();
    console.log(b);
};
getGoogleSheet();