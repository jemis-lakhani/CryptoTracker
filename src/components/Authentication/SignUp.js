import { Box, Button, TextField } from '@material-ui/core'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext'
import { auth } from '../../firebase'

const SignUp = ({handleClose}) => {

const [email, setemail] = useState("")
const [password, setpassword] = useState("")
const [confirmpassword, setconfirmpassword] = useState("")
const {setalert}=CryptoState();
const handleSubmit= async ()=>{
    if(password!==confirmpassword){
        setalert({
            open:true,
            message:'Passwords do not match',
            type:'error'
        });
        return;
    }

    try {
        const result =await createUserWithEmailAndPassword(
            auth,
            email,
            password
            )
            setalert({
                open:true,
                message:`Sign Up Succesfull. Welcome ${result.user.email}` ,
                type:'success'
            });
console.log(result);
            handleClose();

    } catch (error) {
        
        setalert({
            open:true,
            message:error.message,
            type:'error'
        });
        return;
    }


}



  return (
   <Box p={3}
   style={{
       display:"flex",
       flexDirection:"column",
       gap:"20px"
   }}
   >
      <TextField
      variant='outlined'
      type="email"
      label="Enter Email"
      value={email}
      onChange={(e)=>setemail(e.target.value)}
      fullWidth
      
      />


    <TextField
      variant='outlined'
      type="password"
      label="Enter Password"
      value={password}
      onChange={(e)=>setpassword(e.target.value)}
      fullWidth
      
      />


    <TextField
      variant='outlined'
      type="password"
      label="Confirm Password"
      value={confirmpassword}
      onChange={(e)=>setconfirmpassword(e.target.value)}
      fullWidth
      
      />

    <Button
     variant='contained'
     size="large"
     style={{
         backgroundColor:"#EEBC1D",
     }}
     onClick={handleSubmit}
     >
        Sign Up   
     </Button>


   </Box>
  )
}

export default SignUp