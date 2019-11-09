let form = null;
let exampleLink = null;
let inputArea = null;

// Constants/magic numbers

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

  const inputList = inputArea.value
    .replace(new RegExp("\n", "g"), "")
    .split(SPLITTER);

  if (!checkForProblems(inputList)) return; // abort

  const googleMapsLink = getGoogleMapsLink(inputList);
  window.open(googleMapsLink, "_blank");
  console.log("submit");
}

function getGoogleMapsLink(inputList) {
    const baseLink = "https://www.google.com/maps/dir/?api=1";
  return [
    baseLink,
    `origin=${encodeURIComponent(inputList[0])}`,
    `waypoints=${encodeURIComponent(inputList.slice(1).join("|"))}`
  ].join("&");
}

function checkForProblems(inputList) {
  const getText = (length, warningTexts) =>
    `Warning: ${length} waypoints.\n\nGoogle Maps API Limitation:\n${warningTexts}\n\nDo you still want to continue?`;

  const warningTexts = [
    inputList.length > MAX_MOBILE_WAYPOINTS
      ? "More than 3 waypoints are truncated on a mobile browser"
      : null,
    inputList.length > MAX_ABSOLUTE_WAYPOINTS
      ? "More than 9 waypoints are always truncated"
      : null
  ]
    .filter(v => v != null)
    .join("\n");
  return warningTexts.length > 0
    ? window.confirm(getText(inputList.length, warningTexts))
    : true;
}

function onExampleLinkClick(event) {
  event.preventDefault();
  inputArea.value = `St. Gallen - Zurich - Berne - Basel`;
}
