import React from 'react'
import {AppBar,Container, createTheme, makeStyles, MenuItem, MuiThemeProvider, Select, Toolbar, Typography} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './UserSidebar';

const useStyles=makeStyles(()=>({
  title:{
    flex:1,
    color:"gold",
    fontFamily:"Montserrat",
    fontWeight:"bold",
    cursor:"pointer",

  }
}))


export default function Header() {

  const classes=useStyles();
 
  const history=useNavigate();

  const darkTheme=createTheme({
    palette:{
      primary:{
        main:'#fff'
      },
      type:"dark",
    },
  })


  const {currency,setcurrency,user}=CryptoState();


console.log(currency);

  return (
    <MuiThemeProvider theme={darkTheme} >

    
   <AppBar color='transparent' position='static'>
     <Container>
       <Toolbar>
         <Typography 
         onClick={()=>history("/")} 
         className={classes.title} variant='h6'>
           Crypto Tracker</Typography>
         <Select variant="outlined" style={{
           width:100,
           height:40,
           marginRight:15,
         }}
         value={currency}
         onChange={(e)=>setcurrency(e.target.value)}
         >
           <MenuItem value={"USD"} >USD</MenuItem>
           <MenuItem value={"INR"}>INR</MenuItem>

         </Select>
         {user?<UserSidebar/>:<AuthModal/>}
       </Toolbar>

     </Container>
   </AppBar>
   </MuiThemeProvider>
  )
}
