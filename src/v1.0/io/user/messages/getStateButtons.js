module.exports = state => {
  let buttons = {
    login: false,
    logout: false,
    ready: false,
    notready: false,
    wrapup: false
  };

  switch (state) {
    case "Unknown":
      buttons.login = true;
      break;
    case "Connected":
      buttons.login = true;
      break;
    case "Logged In":
      buttons.logout = true;
      buttons.ready = true;
      buttons.notready = true;
      break;
    case "Ready":
      buttons.logout = true;
      buttons.ready = true;
      buttons.notready = true;
      break;
    case "Not ready":
      buttons.logout = true;
      buttons.ready = true;
      buttons.notready = true;
      break;
    case "Wrap up":
      buttons.wrapup = true;
      buttons.logout = true;
      buttons.ready = true;
      buttons.notready = true;
      break;
    case "Reserved":
      buttons.logout = true;
      buttons.wrapup = true;
      buttons.ready = true;
      buttons.notready = true;
      break;
    case "Handling":
      buttons.logout = true;
      buttons.wrapup = true;
      buttons.ready = true;
      buttons.notready = true;
      break;
    case "Error":
      buttons.login = true;
      break;
    case "Logged Out":
      buttons.login = true;
      break;
    default:
      break;
  }
  return { ...buttons };
};
