const { ipcRenderer } = require("electron");
const fs = require("fs");
const items = require("./items.js");
const sampleDU = require("./sampleDU");
const showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemURL = document.getElementById("url"),
  search = document.getElementById("search");

const showModal2 = document.getElementById("show-modal2"),
  closeModal2 = document.getElementById("close-modal2"),
  modal2 = document.getElementById("modal2"),
  moveFile = document.getElementById("move-file"),
  dropBox = document.getElementById("dropbox");

ipcRenderer.on("menu-show-modal", () => {
  if (closeModal.style.display === "none") return;
  showModal.click();
});
ipcRenderer.on("menu-open-item", () => {
  items.open();
});
ipcRenderer.on("menu-delete-item", () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});
ipcRenderer.on("open-in-browser", () => {
  items.openSelectedItem();
});
ipcRenderer.on("menu-focus-search", () => {
  search.focus();
});
//addListener for search
search.addEventListener("keyup", (e) => {
  Array.from(document.getElementsByClassName("read-item")).forEach((el) => {
    let hasMatch = el.innerText.toLowerCase().includes(search.value);
    el.style.display = hasMatch ? "flex" : "none";
  });
});

const toggleModal = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding....";
    closeModal.style.display = "none";
  }
};

const toggleModal2 = () => {
  if (moveFile.disabled === true) {
    moveFile.disabled = false;
    moveFile.style.opacity = 1;
    moveFile.innerText = "Move File";
    closeModal2.style.display = "inline";
  } else {
    moveFile.disabled = true;
    moveFile.style.opacity = 0.5;
    moveFile.innerText = "Moving....";
    closeModal2.style.display = "none";
  }
};
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemURL.focus();
});
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

showModal2.addEventListener("click", (e) => {
  modal2.style.display = "flex";
});
closeModal2.addEventListener("click", (e) => {
  modal2.style.display = "none";
});

//handle new item

addItem.addEventListener("click", (e) => {
  if (itemURL.value) {
    ipcRenderer.send("new-item", itemURL.value);
    toggleModal();
  }
});

ipcRenderer.on("new-item-success", (e, newItem) => {
  items.addItem(newItem, true);
  modal.style.display = "none";
  itemURL.value = "";
  toggleModal();
});

itemURL.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addItem.click();
  }
});

//drag drop

dropBox.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();
  let filePath = event.dataTransfer.files[0].path;
  let name = event.dataTransfer.files[0].name;

  for (const f of event.dataTransfer.files) {
    // Using the path attribute to get absolute file path
    console.log("File Path of dragged files: " + f.path + name);
  }
  dropBox.style.border = "0px";
  dropBox.classList.add("file-in");
  dropBox.innerHTML = JSON.stringify({ title: name, path: filePath });
});

dropBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

dropBox.addEventListener("dragenter", (event) => {
  dropBox.style.border = "2px solid blue";
});

dropBox.addEventListener("dragleave", (event) => {
  dropBox.style.border = "0px";
});

moveFile.addEventListener("click", async (e) => {
  if (dropBox.innerHTML == "DnD") return;
  dropBox.innerHTML == "DnD";
  let data = JSON.parse(dropBox.innerHTML);
  items.addItem(
    {
      title: data.title,
      screenshot: sampleDU,
      path: `C:/Users/arthu/Desktop/tempStorage/${data.title}`,
      type: "file",
    },
    true
  );
  toggleModal2();
  await fs.copyFile(data.path, `C:/Users/arthu/Desktop/tempStorage/${data.title}`, console.log);
  toggleModal2();
  modal2.style.display = "none";
  dropBox.style.border = "0px";
  dropBox.classList.remove("file-in");
});
