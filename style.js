document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menuButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuButton.addEventListener("click", function () {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        dropdownMenu.style.marginRight = '30px';

        // console.log(dropdownMenu)
    });

    // Close dropdown if user clicks outside
    document.addEventListener("click", function (event) {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});
