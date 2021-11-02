let info = document.getElementById("info");
let info1 = document.getElementById("info1");

func1();
async function func1() {
    //let url = "https://script.google.com/macros/s/AKfycbzisNeXh3VShodCjCp1qwIFQiVAj3_qe3LpLiGyLn0sF9JnN6AbBixFODRbMt_wU4qszA/exec"
    let url ="https://script.google.com/macros/s/AKfycbzJ_E3r9vMF6AZYdpziblvm_GXY1sXA01-gyjNnqRyuSlVgN8Kmfl9E7KUyvVEhiUgm/exec"
    let res = await fetch(url, {
        //headers: { 'Content-Type': 'text/plain' },
        //redirect: 'follow',
        //mode: 'no-cors' // 'cors' by default, this will cause problem in google sheet API
    })
    //info.innerText = await res.text();
    info.innerText = JSON.stringify(await res.json());
    let cnt = 30;
    while (cnt > 0) {
        info1.innerText = `Will download google sheet in ${cnt-1} seconds`;
        await sleep(1000);
        cnt--;
    }
    let downloadUrl ="https://docs.google.com/spreadsheets/d/e/2PACX-1vSJidRMnkOchGogOHvjn-fd4Yi29bWMvApUVENO4fmrx889Pzo6nMkcxltBccKGg46b_Bad4U_aRCa8/pub?output=xlsx"
    download(downloadUrl)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function download(dataurl) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.click();
}
//let url =""
//fetch(url);