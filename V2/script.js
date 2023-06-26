const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
let notes = [];

function showNotes() {
    const storedData = JSON.parse(localStorage.getItem("notes"));
    if (storedData && storedData.length > 0) {
      notes = storedData;
      notes.forEach((note) => {
        const inputBox = createNoteElement(note.content, note.starred);
        notesContainer.appendChild(inputBox);
        addDate(inputBox, note.date);
  
        // Update the content of the input box
        inputBox.querySelector(".input-box").innerHTML = note.content;
  
        // Update the star icon state
        const starIcon = inputBox.querySelector(".star-icon");
        if (note.starred) {
          starIcon.textContent = "⭐";
          starIcon.dataset.starred = "true";
        } else {
          starIcon.textContent = "☆";
          starIcon.dataset.starred = "false";
        }
  
        // Attach event listener to star icon
        starIcon.addEventListener("click", () => {
          const noteElement = starIcon.closest(".note");
          const index = Array.from(notesContainer.children).indexOf(noteElement);
          const note = notes[index];
  
          if (starIcon.dataset.starred === "true") {
            starIcon.textContent = "☆";
            starIcon.dataset.starred = "false";
            note.starred = false;
          } else {
            starIcon.textContent = "⭐";
            starIcon.dataset.starred = "true";
            note.starred = true;
          }
  
          updateStorage();
        });
      });
    }
}
  
  

function addNote() {
  const note = {
    content: "", // Initialize content as an empty string
    date: new Date().toISOString(),
    starred: false,
  };
  notes.push(note);
  return note;
}

function updateNotesContent() {
    const noteElements = Array.from(notesContainer.querySelectorAll(".note"));
    notes = noteElements.map((noteElement) => {
      const inputBox = noteElement.querySelector(".input-box");
      const starIcon = noteElement.querySelector(".star-icon");
      return {
        content: inputBox.innerHTML.trim(),
        date: noteElement.dataset.date,
        starred: starIcon.dataset.starred === "true",
      };
    });
}
  

function createNoteElement(content, starred) {
  const noteElement = document.createElement("div");
  noteElement.className = "note";

  const inputBox = document.createElement("p");
  inputBox.className = "input-box";
  inputBox.setAttribute("contenteditable", "true");

  // Set the content using innerHTML instead of textContent
  inputBox.innerHTML = content;

  const deleteBtn = document.createElement("img");
  deleteBtn.className = "delete-btn";
  deleteBtn.src = "Img/delete.png";

  const starIcon = document.createElement("span");
  starIcon.className = "star-icon";
  starIcon.style.display = "inline-block";
  starIcon.textContent = starred ? "⭐" : "☆";
  starIcon.dataset.starred = starred || false;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "button-wrapper";
  buttonWrapper.appendChild(deleteBtn);
  buttonWrapper.appendChild(starIcon);

  inputBox.appendChild(buttonWrapper);
  noteElement.appendChild(inputBox);

  inputBox.addEventListener("keydown", (event) => {
    if (event.key === "a" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  starIcon.addEventListener("click", () => {
    const noteElement = starIcon.closest(".note");
    const index = Array.from(notesContainer.children).indexOf(noteElement);
    const note = notes[index];

    if (starIcon.dataset.starred === "true") {
      starIcon.textContent = "☆";
      starIcon.dataset.starred = "false";
      note.starred = false;
    } else {
      starIcon.textContent = "⭐";
      starIcon.dataset.starred = "true";
      note.starred = true;
    }

    updateStorage();
  });

  return noteElement;
}

function addDate(noteElement, date) {
  const dateElement = document.createElement("p");
  dateElement.style.fontFamily = "Arial";
  dateElement.style.color = "black";
  dateElement.style.position = "absolute";
  dateElement.style.bottom = "0";
  dateElement.style.left = "0";
  dateElement.style.padding = "10px";
  dateElement.textContent = formatDate(date);
  noteElement.appendChild(dateElement);
  noteElement.dataset.date = date;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

createBtn.addEventListener("click", () => {
  const note = addNote();

  const inputBox = createNoteElement(note.content, note.starred);
  notesContainer.appendChild(inputBox);
  addDate(inputBox, note.date);

  inputBox.querySelector(".input-box").addEventListener("input", () => {
    updateStorage();
  });

  updateStorage();
});

notesContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const noteElement = e.target.closest(".note");
    const index = Array.from(notesContainer.children).indexOf(noteElement);
    notes.splice(index, 1);

    noteElement.remove();
    updateStorage();
  }
});

function updateStorage() {
  updateNotesContent();
  localStorage.setItem("notes", JSON.stringify(notes));
}

window.addEventListener("beforeunload", () => {
  updateStorage();
});

showNotes();
