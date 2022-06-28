a0 = document.querySelector('#table0');
a1 = document.querySelector('#table1');
a2 = document.querySelector('#table2');
a3 = document.querySelector('#table3');
new convertSpanTable(a1);
new convertSpanTable(a3);

t0 = new myTable; t1 = new myTable; t2 = new myTable; t3 = new myTable;
t0.fromHtmlTable(a0);
t1.fromHtmlTable(a1);
t2.fromHtmlTable(a2);
t3.fromHtmlTable(a3);
t4 = new myTable;
t4.fromObject(t3.toObject())
url = "https://script.google.com/macros/s/AKfycbzmYr2V_b7HX6efdfbPchupaHCuH0CzVD2l93zu3ujzHesOErbpHSZoaaJ-wGF6lJ_s/exec";
posturl = url + "?cmd=post&sheetname=Sheet6"
geturl = url + "?cmd=get&sheetname=Sheet6"
appendurl = url + "?cmd=append&sheetname=Sheet6"

getGoogleSheet = async () => {

    // simple HTTP get
    a = await fetch(geturl);
    b = await a.json();
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