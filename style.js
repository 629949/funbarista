document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menuButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuButton.addEventListener("click", function () {

        console.log("menuButton clicked!")
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";

        // console.log(dropdownMenu)
    });

    // Close dropdown if user clicks outside
    document.addEventListener("click", function (event) {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});
