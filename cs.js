function newArr(arr){
    let res=[];
    for(let i in arr){
    if(arr.indexOf(arr[i])==i) res.push(arr[i]);
    }
    console.log(res); 
    }
newArr([1,1,23,4,2,23,3])