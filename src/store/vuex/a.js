async function a (){
    await console.log(1);
    console.log(2);
}

new Promise((resolve)=>{
    resolve()
}).then(()=>{
    console.log(4);
})
a();
new Promise((resolve)=>{
    resolve()
}).then(()=>{
    console.log(6);
})


