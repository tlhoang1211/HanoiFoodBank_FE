"use strict";

var objAccount = null;
var listImageFood = [];

// document.getElementById("newFood").addEventListener(
//   "click",
//   function () {
//     var nameFood = document.getElementById("nameFood").value;
//     var category = document.getElementById("category").value;

//     var expirationDate = document.getElementById("expirationDate").value;
//     if (!expirationDate) {
//       $(".alert-danger").alert();
//       return false;
//     }
//     if (listImageFood1.length == 0) {
//       $(".alert-danger").alert();
//       return false;
//     }
//     var description = document.getElementById("description").value;
//     var dataPost = {
//       name: nameFood || "",
//       avatar: listImageFood1[0],
//       images: listImageFood1.join(","),
//       expirationDate: document.getElementById("expirationDate").value,
//       createdBy: objAccount.id,
//       categoryId: parseInt(category),
//       description: description,
//     };
//     fetch("https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${isToken}`,
//       },
//       body: JSON.stringify(dataPost),
//     })
//       .then((response) => response.json())
//       .then(function (data) {})
//       .catch(function (error) {});
//   },
//   false
// );

// hiennv 24/10
// ********* active
function onAddClassActive(e, className, parent) {
  var listAction = document.getElementsByClassName(className);
  if (listAction && listAction.length > 0) {
    for (let index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.remove("active");
    }
  }
  if (parent) {
    e.parentElement.classList.add("active");
  } else {
    e.classList.add("active");
  }
}

document.querySelector(".myAccountInfo").style.color = "red";
function showTabPanel(e) {
  var listAction = document.getElementsByClassName("tab-account");
  if (listAction && listAction.length > 0) {
    for (var index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.add("d-none");
      element.classList.remove("active");
    }
  }
  var listPanel = document.getElementsByClassName("tab-pane");
  if (listPanel && listPanel.length > 0) {
    for (var index = 0, len = listPanel.length; index < len; index++) {
      var element = listPanel[index];
      element.classList.remove("active");
    }
  }
  switch (e) {
    case "myaccount":
      // myAccountInfo
      // myFoodInfo
      // myRequestInfo
      // myFeedbackInfo

      document.querySelector(".myAccountInfo").style.color = "red";
      document.querySelector(".myFoodInfo").style.color = "#000";
      document.querySelector(".myRequestInfo").style.color = "#000";
      document.querySelector(".myFeedbackInfo").style.color = "#000";

      document.getElementsByClassName("profile")[0].classList.add("active");
      document.getElementById("profile").classList.add("active");
      document.getElementsByClassName("profile")[0].classList.remove("d-none");

      document
        .getElementsByClassName("changepassword")[0]
        .classList.remove("d-none");
      getAccount();
      break;
    case "myfood":
      document.querySelector(".myAccountInfo").style.color = "#000";
      document.querySelector(".myFoodInfo").style.color = "red";
      document.querySelector(".myRequestInfo").style.color = "#000";
      document.querySelector(".myFeedbackInfo").style.color = "#000";

      document
        .getElementsByClassName("listFoodPost")[0]
        .classList.remove("d-none");
      document
        .getElementsByClassName("listFoodPending")[0]
        .classList.remove("d-none");
      document
        .getElementsByClassName("listFoodExpired")[0]
        .classList.remove("d-none");
      document.getElementsByClassName("listFood")[0].classList.add("active");
      document.getElementById("listFood").classList.add("active");
      document.getElementsByClassName("listFood")[0].classList.remove("d-none");
      break;
    case "myrequest":
      document.querySelector(".myAccountInfo").style.color = "#000";
      document.querySelector(".myFoodInfo").style.color = "#000";
      document.querySelector(".myRequestInfo").style.color = "red";
      document.querySelector(".myFeedbackInfo").style.color = "#000";

      document
        .getElementsByClassName("listActiveFood")[0]
        .classList.remove("d-none");
      document.getElementsByClassName("listRequest")[0].classList.add("active");
      document.getElementById("listRequest").classList.add("active");
      document
        .getElementsByClassName("listRequest")[0]
        .classList.remove("d-none");
      break;
    case "myfeedback":
      document.querySelector(".myAccountInfo").style.color = "#000";
      document.querySelector(".myFoodInfo").style.color = "#000";
      document.querySelector(".myRequestInfo").style.color = "#000";
      document.querySelector(".myFeedbackInfo").style.color = "red";

      document
        .getElementsByClassName("listSentFeedback")[0]
        .classList.add("active");
      document.getElementById("listFeedback").classList.add("active");
      document
        .getElementsByClassName("listSentFeedback")[0]
        .classList.remove("d-none");
      document
        .getElementsByClassName("listReceiveFeedback")[0]
        .classList.remove("d-none");
      getSentFeedbackList();
      break;
    default:
      break;
  }
}

// format category
function formatCategory(id) {
  var text = "";
  switch (id) {
    case 1:
      text = "Drinks";
      break;
    case 2:
      text = "Noodle";
      break;
    case 3:
      text = "Bread";
      break;
    case 4:
      text = "Rice";
      break;
    case 5:
      text = "Meat";
      break;
    case 6:
      text = "Seafood";
      break;
    case 7:
      text = "Vegetables";
      break;
    case 8:
      text = "Vegetarian Food";
      break;
    case 9:
      text = "Fruit";
      break;
    case 10:
      text = "Fast Food";
      break;
    case 11:
      text = "Snacks";
      break;
    case 12:
      text = "Others";
      break;
  }
  return text;
}
