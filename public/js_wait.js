const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function delay_return(del,data)
{
    await delay(del);
    return data;
}

function delay_return2(del, data) {
    p1 = delay_return(del, data)
    p2 = delay_return(del, data)
    p3 = delay_return(del, data)
    return [p1,p2,p3];
}