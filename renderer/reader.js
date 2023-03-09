let readitClose = document.createElement("div");
readitClose.innerText = "done";

readitClose.style.position = "fixed";
readitClose.style.bottom = "15px";
readitClose.style.right = "15px";
readitClose.style.padding = "5px 10px";
readitClose.style.fontSize = "20px";
readitClose.style.fontWeight = "bold";
readitClose.style.background = "white";
readitClose.style.color = "black";
readitClose.style.borderRadius = "5px";
readitClose.style.zIndex = "999";

readitClose.onclick = (e) => {
  window.opener.postMessage(
    {
      action: "delete-reader-item",
      itemIndex: "{{index}}",
    },
    "*"
  );
};

document.getElementsByTagName("body")[0].append(readitClose);
