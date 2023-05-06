 export const isValidation = ({setErrors})=>{
    const inputs = document.querySelectorAll('input');
    var res = true;
    var cnt = 0;
    Array.prototype.map.call(inputs,(input) =>{
      if(input.value === "" && cnt !== 1 && cnt !== 2){
        setErrors(2);
        res = false;
        return;
      }
      else if((cnt === 14 || cnt === 15) && (input.value !== 'Yes' || input.value !== 'No'|| input.value !== 'yes'|| input.value !== 'no')){ //validation with input whose value is only yes or no
        setErrors(3);
        res = false;
        return;
      }
      cnt++;
    }) 
    return res;
  }