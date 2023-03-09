const { Menu, shell } = require("electron");
module.exports = () => {
  let template = [
    {
      label: "Items",
      submenu: [],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn more",
          click: () => {
            shell.openExternal("https://github.com");
          },
        },
      ],
    },
  ];

  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  let menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};
