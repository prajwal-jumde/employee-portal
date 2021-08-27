function toasterFunction(status) {
  var toaster = document.getElementById("toaster-container");
  toaster.className = "show";
  if (status.status == 200) {
      toaster.style.backgroundColor = 'green';
  } else {
      toaster.style.backgroundColor = 'red';
  }
  document.getElementById("snackbar").innerHTML = status.statusMessage;
  setTimeout(function() {
      toaster.className = toaster.className.replace("show", "");
  }, 5000);
}
function closeToaster() {
  var toaster = document.getElementById("toaster-container");
  toaster.className = "show";
  toaster.className = toaster.className.replace("show", "");
}