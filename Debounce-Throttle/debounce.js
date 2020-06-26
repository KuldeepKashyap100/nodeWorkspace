// let counter=0;
// const fetchData=()=>{
//     console.log('fetch data '+counter++);
// }

// function debounce(fetchData,delay){
//     let timer;
//     return function (){
//         let context =  this;
//         let args=arguments;
//         clearTimeout(timer);
//         // clearInterval(timer); both works and setTimeOut and setInterval keeps a common pool of ids
//         timer = setTimeout(function(){
//             fetchData.apply(context,args);
//         },delay);
//     }
// }

// const useDebounce = debounce(fetchData,300);

// let throttleCounter = 0;
// const throttleButton=()=>{
//     console.log('Throttle Button '+throttleCounter++);
// }
// function throttle(throttleButton,delay){
//     let isThrottle = true;
//     return function(){
//         let context = this;
//         let args = arguments;
//         if(isThrottle){
//             isThrottle=false;
//             throttleButton.apply(context,args);
//             setTimeout(()=>{
//                 isThrottle =true;
//             },delay);
//         }
//     }
// }


// const useThrottle = throttle(throttleButton,1000);

// // var event = new Event('click');

// // window.addEventListener('click',()=>{
// //     setTimeout(()=>{
// //         console.log('event triggered');
// //         window.dispatchEvent(event);
// //     },180000);
// // })
// // window.dispatchEvent(event);

// var readline = require('readline');


// let xmlHttpRequest = new XMLHttpRequest();
// let getData = (e)=>{console.log(e)}
// // xmlHttpRequest.open('file:///C:/Users/kuldeep01/Documents/nodeWorkspace/index.html',getData);
// xmlHttpRequest.open('GET','https://s3.amazonaws.com/images.seroundtable.com/google-css-images-1515761601.jpg');

// xmlHttpRequest.send();


// function bookFlight() {
//     return new Promise(function (resolve) {
//         setTimeout(()=>{console.log('first waiting');resolve(5600)}, 100);
//     })
// }

// function bookHotel(flightPrice) {
//     return new Promise(function (resolve) {
//         setTimeout(()=>{console.log('second waiting');resolve(7000 + flightPrice)}, 1000);
//     })
// }

// async function getTotal(){
//     var flightData=await bookFlight();
//     console.log('first promise resolved');
//     var cumulativeData=await bookHotel(flightData);
//     console.log('second promise resolved');
//     console.log(" Total is " + cumulativeData);
//  }
//  getTotal();




// function getAngle(hours,minutes){
//     if(hours*5<minutes){
//         minutes=minutes-hours*5;
//         return minutes/5*30;
//     }
//     let angleHourToTwelve = (12-hours)*30;
//     let angleMinuteToTwelve = (minutes/5)*30;
    
//     let totalAngle = angleHourToTwelve+angleMinuteToTwelve;
//     return totalAngle;
// }

// let result = getAngle(7,59);
// console.log(result);

// function getWord(input){
//     let result=[];
//     let digitWordMap = {
//         2:["a","b","c"],
//         3:["d","e","f"],
//         4:["g","h","i"],
//         5:["j","k","l"],
//         6:["m","n","o"],
//         7:["p","q","r","s"],
//         8:["t","u","v"],
//         9:["w","x","y","z"]
//     }
//     let inputArray = [];
//     while(input){
//         inputArray.push(input%10);
//         input=Math.floor(input/10);
//     }
//     inputArray=inputArray.reverse();
//     let itemArray = []
//     inputArray.forEach(item=>{
//         itemArray.push(digitWordMap[item]);
//     });
//     console.log(itemArray);
//     for(let i=0;i<itemArray[0].length;i++){
//         for(let j=0;i<itemArray[j+1].length;j++){
//             for(let k=0;k<itemArray[k+1].length;k++){
//                 result.push(itemArray[i][j]+itemArray[j][k]+itemArray[k][i]);
//             }
//         }
//     }
//     // for(let i=0;i<digitWordMap[inputArray[0]].length;i++){
//     //     for(let j=0;j<digitWordMap[inputArray[1]].length;j++){
//     //         for(let k=0;k<digitWordMap[inputArray[2]].length;k++){
//     //             
//     //         }
//     //     }
//     // }
//     return result;
// }
// let result = getWord(279);
// console.log(result);







// function isPalindrome(inputString){
//     let isPalidrome = true;
//     for(let i=0;i<inputString.length/2;i++){
//         if(inputString[i]!==inputString[inputString.length-i-1]){
//             isPalidrome=false;
//             break;
//         }
//     }
//     return isPalidrome;
// }

// let result = isPalindrome('adba');
// console.log(result);

let a='<paper-button messageid="corporate-inquiry" class="flat-button" on-tap="resethandler">';
console.log(a.slice(a.indexOf('id'),a.length).split('=')[1].split('"')[1]);