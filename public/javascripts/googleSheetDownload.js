let info = document.getElementById("info");
let info1 = document.getElementById("info1");
//let excelUrl = "https://script.google.com/macros/s/AKfycbzwmiwbMABAQsHYuAEmx8X0zmgN2TYypRbE26PYnkXQPaitvYzVEKfVcdq6PGH0EVz8/exec"
let downloadUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSJidRMnkOchGogOHvjn-fd4Yi29bWMvApUVENO4fmrx889Pzo6nMkcxltBccKGg46b_Bad4U_aRCa8/pub?output=xlsx"
let excelUrl = "https://script.google.com/macros/s/AKfycbyrbAdSZqKuAkI6InQwZhhsFEmpaofqtNKiEUho1r7ST3hOMLL2cqyJ6Yi_HYfZ90Jp/exec"

func1();
async function func1() {
    //let url = "https://script.google.com/macros/s/AKfycbzisNeXh3VShodCjCp1qwIFQiVAj3_qe3LpLiGyLn0sF9JnN6AbBixFODRbMt_wU4qszA/exec"
    let url = excelUrl;
    let res = await fetch(url, {
        //headers: { 'Content-Type': 'text/plain' },
        //redirect: 'follow',
        //mode: 'no-cors' // 'cors' by default, this will cause problem in google sheet API
    })
    //info.innerText = await res.text();
    info.innerText = JSON.stringify(await res.json(), null, 2);
    let cnt = 30;
    while (cnt > 0) {
        info1.innerText = `yy Will download google sheet in ${cnt-1} seconds`;
        await sleep(1000);
        cnt--;
    }
    //let downloadUrl ="https://docs.google.com/spreadsheets/d/e/2PACX-1vSJidRMnkOchGogOHvjn-fd4Yi29bWMvApUVENO4fmrx889Pzo6nMkcxltBccKGg46b_Bad4U_aRCa8/pub?output=xlsx"
    download(downloadUrl);
    //fetchDownload(downloadUrl, "dummy.xlsx");  //not working !
    //download only works for same-origin URLs, or the blob: and data: schemes.
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function download(dataurl,filename="") {
    const link = document.createElement("a");
    link.href = dataurl;
    //link.download = "qqq.xlsx";
    //if (filename) link.setAttribute("download", "database_" + yyyymmdd() + ".xlsx")
    link.click();
}
function yyyymmdd() {
    let dateObj = new Date();
    let month = dateObj.getMonth() + 1; //months from 1-12
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    return ("" + year + month + day);
}
//let url =""
//fetch(url);
function fetchDownload(url, filename) {
    fetch(url).then(function (t) {
        return t.blob().then((b) => {
            //var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.href = window.URL.createObjectURL(b);
            a.setAttribute("download", filename);
            a.click();
        }
        );
    });
}
