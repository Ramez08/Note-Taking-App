const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
let notes = document.querySelectorAll(".input-box");

function showNotes() {
    notesContainer.innerHTML = localStorage.getItem("notes");
}

showNotes();

function updateStorage() {
    localStorage.setItem("notes", notesContainer.innerHTML);
}

createBtn.addEventListener("click", () => {
    let inputBox = document.createElement('p'); // Creating a new paragraph element
    let img = document.createElement("img"); // Creating a new image element
    inputBox.className = "input-box"; // Adding the "input-box" class to the paragraph element
    inputBox.setAttribute("contenteditable", "true"); // Allowing the paragraph element to be editable
    img.src = "Img/delete.png"; // Setting the image source
    notesContainer.appendChild(inputBox).appendChild(img); // Appending the paragraph element and the image element to the notes container
})

notesContainer.addEventListener("click", function(e){
    if(e.target.tagName === "IMG") { // Checking if the clicked element is an image
        e.target.parentElement.remove(); // Removing the parent element (paragraph) of the clicked image
        updateStorage(); // Updating the storage after removing the note
    }
    else if(e.target.tagName === "P") { // Checking if the clicked element is a paragraph
        notes = document.querySelectorAll(".input-box"); // Updating the notes NodeList
        notes.forEach(nt => {
            nt.onkeyup = function() {
                updateStorage(); // Updating the storage whenever a note is modified
            }
        })
    }
})

document.addEventListener("keydown", event => {
    if(event.key === "Enter"){
        document.execCommand("InsertLineBreak"); // Inserting a line break when the Enter key is pressed
        event.preventDefault(); // Preventing the default behavior of the Enter key
    }
})
