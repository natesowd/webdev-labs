
/*
    Hints: 
    1. Attach click event handlers to all four of the 
       buttons (#default, #ocean, #desert, and #high-contrast).
    2. Modify the className property of the body tag 
       based on the button that was clicked.
*/
const changeTheme = (ev) => {
   const themeSelected = ev.currentTarget;
   if(themeSelected.id == "default"){
      document.querySelector("body").className = ""   
   }
   if(themeSelected.id == "ocean"){
      document.querySelector("body").className = "ocean"
   }
   if(themeSelected.id == "desert"){
      document.querySelector("body").className = "desert"
   }
   if(themeSelected.id == "high-contrast"){
      document.querySelector("body").className = "high-contrast"
   }
};

document.querySelector("#default").addEventListener('click', changeTheme);
document.querySelector("#ocean").addEventListener('click', changeTheme);
document.querySelector("#desert").addEventListener('click', changeTheme);
document.querySelector("#high-contrast").addEventListener('click', changeTheme);