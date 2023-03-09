const { shell } = require("electron");
const fs = require("fs");
const itemsCont = document.getElementById("items");

let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

window.addEventListener("message", (e) => {
  if (e.data.action !== "delete-reader-item") return;
  e.source.close();
  this.delete(e.data.itemIndex);
});

exports.getSelectedItem = () => {
  let currItem = document.getElementsByClassName("read-item selected")[0];
  return {
    node: currItem,
    index: currItem.dataset.index,
  };
};
//persist
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};
exports.select = (e) => {
  this.getSelectedItem().node.classList.remove("selected");
  e.currentTarget.classList.add("selected");
};
exports.changeSelection = (dir) => {
  let curr = this.getSelectedItem().node;
  if (dir === "ArrowUp" && curr.previousElementSibling) {
    curr.classList.remove("selected");
    curr.previousElementSibling.classList.add("selected");
  } else if (dir === "ArrowDown" && curr.nextElementSibling) {
    curr.classList.remove("selected");
    curr.nextElementSibling.classList.add("selected");
  }
};
exports.delete = (itemIndex) => {
  itemsCont.removeChild(items.childNodes[itemIndex]);
  this.storage.splice(itemIndex, 1);
  this.save();
  Array.from(itemsCont).forEach((item, i) => {
    item.setAttribute("data-index", i);
  });
  if (this.storage.length) {
    let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;
    Array.from(itemsCont.childNodes)[newSelectedItemIndex].classList.add("selected");
  }
};
exports.open = () => {
  if (!this.storage.length) return;
  let selectedItems = this.getSelectedItem().node;
  if (selectedItems.dataset.type === "url") {
    let contentUrl = selectedItems.dataset.url;
    let readerWin = window.open(
      contentUrl,
      "",
      `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntergration=0,
    contextIsolation=0
    `
    );
    readerWin.eval(readerJS.replace("{{index}}", this.getSelectedItem().index));
  } else {
    shell.showItemInFolder(selectedItems.dataset.path);
  }
};
exports.openSelectedItem = () => {
  if (!this.storage.length) return;
  let selectedItems = this.getSelectedItem().node;
  if (selectedItems.dataset.type === "url") {
    let contentUrl = selectedItems.dataset.url;
    shell.openExternal(contentUrl);
  }
};
exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement("div");

  itemNode.setAttribute("class", "read-item");
  itemNode.setAttribute("data-index", Array.from(itemsCont.childNodes).length);
  itemNode.setAttribute("data-url", item.url);
  itemNode.setAttribute("data-type", item.type || "url");
  item.path && itemNode.setAttribute("data-path", item.path);
  itemNode.innerHTML = `<img src='${item.screenshot}'/><h2>${item.title}</h2>${item.path ? "<button>X</button>" : ""}`;

  itemsCont.appendChild(itemNode);
  itemNode.addEventListener("click", this.select);
  itemNode.addEventListener("dblclick", this.open);
  item.path &&
    itemNode.querySelector("button").addEventListener("dblclick", (e) => {
      itemsCont.removeChild(itemNode);
      let index = +itemNode.dataset.index - 1;
      this.storage.splice(index, 1);
      this.save();
      Array.from(itemsCont).forEach((item, i) => {
        item.setAttribute("data-index", i);
      });
      if (this.storage.length) {
        let newSelectedItemIndex = index === 0 ? 0 : index - 1;

        Array.from(itemsCont.childNodes)[newSelectedItemIndex].classList.add("selected");
      }
    });
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach((item) => {
  this.addItem(item);
});
