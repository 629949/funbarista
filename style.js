let menuToggle = document.querySelector("#menu");
let menu = document.querySelector(".dropdown");


console.log(menu);


menuToggle.addEventListener("click", function(){
    menu.classList.toggle('active');
});