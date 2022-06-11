function validateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
}

let result = validateEmail("1thang.1@ActiveXObject.cm")

let abc = ({a: x}) => console.log(x)
abc({a:{b:1}})
console.log(result)