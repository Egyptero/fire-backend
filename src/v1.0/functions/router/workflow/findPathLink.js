const winston = require("winston");

module.exports = (links, path) => {
  if (!path) path = "Yes";
  let resultLink = null;
  links.forEach(link => {
    if (link.attrs.label.text === path) resultLink = link;
  });

  //Cannot find target link , check path
  if (!resultLink) {
    switch (path) {
      case "Yes":
        winston.info("Can not find default link, please review workflow");
        break;
      case "No":
        winston.info("Can not find no link, will use the default link");
        links.forEach(link => {
          if (link.attrs.label.text === "Yes") resultLink = link;
        });
        break;
      case "Error":
        winston.info("Can not find error link, will use the no link");
        links.forEach(link => {
          if (link.attrs.label.text === "No") resultLink = link;
        });
        if (!resultLink) {
          winston.info(
            "Can not find error link and no link, will use the default link"
          );
          links.forEach(link => {
            if (link.attrs.label.text === "Yes") resultLink = link;
          });
        }
        break;
    }
  }
  return resultLink;
};
