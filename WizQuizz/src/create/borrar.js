const cursorAnimation = document.querySelector(".cursor");

document.body.addEventListener("click", (e) => {
    let x = e.pageX;
    let y = e.pageY;

    cursorAnimation.style.top = y + "px";
    cursorAnimation.style.left = x + "px";
    cursorAnimation.classList.add("active");

    function removeCursorActive() {
        cursorAnimation.classList.remove("active");
    }

    setTimeout(removeCursorActive, 1000);

    let cursorClone = cursorAnimation.cloneNode(true);
    cursorClone.style.position = "fixed";
    cursorClone.style.pointerEvents = "none"; // Evitar interacción con el cursor clonado
    cursorClone.style.top = (y - cursorAnimation.offsetHeight / 2) + "px"; // Ajustar la posición del cursor clonado
    cursorClone.style.left = (x - cursorAnimation.offsetWidth / 2) + "px"; // Ajustar la posición del cursor clonado
    document.body.appendChild(cursorClone);

    setTimeout(() => {
        cursorClone.remove();
    }, 1000);
});
