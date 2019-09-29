let form = null;
let exampleLink = null;
let inputArea = null;

const SPLITTER = " - ";

// per google's doc: https://developers.google.com/maps/documentation/urls/guide#parameters_1
const MAX_MOBILE_WAYPOINTS = 3;
const MAX_ABSOLUTE_WAYPOINTS = 9;

window.onload = () => {
  form = document.getElementById("form");
  exampleLink = document.getElementById("exampleLink");
  inputArea = document.getElementById("inputArea");

  form.onsubmit = onSubmit;
  exampleLink.onclick = onExampleLinkClick;
};

function onSubmit(event) {
  event.preventDefault();

  const inputText = inputArea.value.replace(new RegExp("\n", "g"), "");
  const inputList = inputText.split(SPLITTER);

  if (!checkForProblems(inputList)) return; // abort

  const googleMapsLink = getGoogleMapsLink(inputList);
  window.open(googleMapsLink, "_blank");
  console.log("submit");
}

function getGoogleMapsLink(inputList) {
  const baseLink = "https://www.google.com/maps/dir/?api=1";
  const origin = inputList[0];
  const destination = inputList[inputList.length - 1];
  const waypoints = inputList.slice(1, inputList.length - 1).join("|");
  return [
    baseLink,
    `origin=${encodeURIComponent(origin)}`,
    `destination=${encodeURIComponent(destination)}`,
    `waypoints=${encodeURIComponent(waypoints)}`
  ].join("&");
}

function checkForProblems(inputList) {
  const waypoints = inputList.slice(1, inputList.length - 1);
  let mobileWarning = "",
    absoluteWarning = "";
  if (waypoints.length > MAX_MOBILE_WAYPOINTS)
    mobileWarning =
      "More than 3 middle waypoints are truncated on a mobile browser";
  if (waypoints.length > MAX_ABSOLUTE_WAYPOINTS)
    absoluteWarning = "More than 9 middle waypoints are always truncated";
  if (mobileWarning || absoluteWarning) {
    return window.confirm(
      `Warning: ${
        waypoints.length
      } waypoints.\n\n${mobileWarning}\n${absoluteWarning}\n\nDo you still want to continue?`
    );
  }
  return true;
}

function onExampleLinkClick(event) {
  event.preventDefault();
  inputArea.value = `St. Gallen - Zurich - Berne - Basel`;
}
