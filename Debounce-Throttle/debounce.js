let counter=0;
const fetchData=()=>{
    console.log('fetch data '+counter++);
}

function debounce(fetchData,delay){
    let timer;
    return function (){
        let context =  this;
        let args=arguments;
        clearTimeout(timer);
        // clearInterval(timer); both works and setTimeOut and setInterval keeps a common pool of ids
        timer = setTimeout(function(){
            fetchData.apply(context,args);
        },delay);
    }
}

const useDebounce = debounce(fetchData,300);

let throttleCounter = 0;
const throttleButton=()=>{
    console.log('Throttle Button '+throttleCounter++);
}
function throttle(throttleButton,delay){
    let isThrottle = true;
    return function(){
        let context = this;
        let args = arguments;
        if(isThrottle){
            isThrottle=false;
            throttleButton.apply(context,args);
            setTimeout(()=>{
                isThrottle =true;
            },delay);
        }
    }
}


const useThrottle = throttle(throttleButton,1000);

// var event = new Event('click');

// window.addEventListener('click',()=>{
//     setTimeout(()=>{
//         console.log('event triggered');
//         window.dispatchEvent(event);
//     },180000);
// })
// window.dispatchEvent(event);
