export const emailValidate = (mail) => 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}


export const usernameValidate = (username) => {
  if (/^\w+$/.test(username))
  {
    return (true)
  }
    return (false)

}