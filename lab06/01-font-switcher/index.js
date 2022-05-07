let currentFontsize = 1;

const makeBigger = () => {
   // alert('make bigger!');
   currentFontsize += 0.2
   setFont()
};


const makeSmaller = () => {
   // alert('make smaller!');
   currentFontsize -= 0.2
   setFont()
};

const setFont = () => {
   document.querySelector("h1").style.fontSize = `${currentFontsize}em`;
   document.querySelector(".content").style.fontSize = `${currentFontsize + 0.5}em`;
}


document.querySelector("#a1").addEventListener('click', makeBigger);
document.querySelector("#a2").addEventListener('click', makeSmaller);

