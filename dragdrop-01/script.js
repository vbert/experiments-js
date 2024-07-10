// Function to make an element draggable
function makeDraggable(element) {
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    // Event listener for mouse down
    element.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset = {
            x: e.clientX - element.getBoundingClientRect().left,
            y: e.clientY - element.getBoundingClientRect().top
        };
        element.style.cursor = "grabbing";
    });

    // Event listener for mouse move
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            element.style.left = e.clientX - offset.x + "px";
            element.style.top = e.clientY - offset.y + "px";
        }
    });

    // Event listener for mouse up
    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
    });
}

// Make the ball draggable
const draggableBall = document.getElementById("draggableBall");
makeDraggable(draggableBall);
