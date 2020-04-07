let counter=0;
const fetchData=()=>{
    console.log('fetch data '+counter++);
}

function debounce(fetchData,delay){
    let timer;
    return function (){
        let context =  this;
            args=arguments;
        clearTimeout(timer);
        // clearInterval(timer); both works and setTimeOut and clearTimeOut keeps a common pool of ids
        timer = setTimeout(function(){
            fetchData.apply(context,args);
        },delay);
    }
}

const useDebounce = debounce(fetchData,300);