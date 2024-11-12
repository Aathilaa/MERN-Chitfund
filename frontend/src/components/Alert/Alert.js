import React from 'react';
import './Alert.css';
import '../ChitAccordion/ChitAccordion';
import '../SliderBox/SliderBox';
import ChitAccordion from '../ChitAccordion/ChitAccordion';
import SliderBox from '../SliderBox/SliderBox';
function Alert() {
  return (
    <>

     <form className="product-search">
            <input type="text" id="search" placeholder="search"></input>
            <i className="fa-solid fa-magnifying-glass"></i>
        </form>
        <br></br><br></br>
        <h2 >Notifications</h2><br></br>
   <ChitAccordion/><br></br>
   <br></br>  
    <SliderBox/>
  </>
  );
}

export default Alert;