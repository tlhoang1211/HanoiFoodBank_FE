function loadNotifyHeader() {
  document
    .getElementsByClassName("user-name")
    .item(0).innerHTML = currentUserName;
  document.getElementsByClassName("user-img").item(0).src =
    "https://res.cloudinary.com/vernom/image/upload/" + objAccount.avatar;
  Notification.show(objAccount.id, function (listNotify) {
    var arrNotify = [];
    var notificationsCount = 0;
    listNotify.forEach(function (child) {
      if (child.val().status == 1) {
        notificationsCount++;
      }
      if (notificationsCount <= 5) {
        var htmlC = "";
        htmlC +=
          '<a class="dropdown-item header__notify-item--status-' +
          child.val().status +
          '" onclick="changePageFormHeader(\'' +
          (child.val().notifyCategory == "food" ? "food" : "request") +
          "', '" +
          (child.val().notifyCategory == "food"
            ? "page_food"
            : "page_request") +
          "')\">";
        htmlC += '<div class="d-flex align-items-center">';
        htmlC += '<div class="notify">';
        htmlC +=
          '<img width="45" height="45" src="https://res.cloudinary.com/vernom/image/upload/' +
          child.val().foodAvatar +
          '">';
        htmlC += "</div>";
        htmlC += '<div class="flex-grow-1" style="overflow: hidden;">';
        htmlC +=
          '<h6 class="msg-name">' +
          (child.val().notifyCategory == "food" ? "New Food" : "New Request") +
          "</h6>";
        htmlC +=
          '<p class="msg-info" style="overflow: hidden;text-overflow: ellipsis;">' +
          child.val().title +
          "</p>";
        htmlC +=
          '<p class="msg-info" style="overflow: hidden;text-overflow: ellipsis;">' +
          child.val().requestTime +
          "</p>";
        htmlC += "</div>";
        htmlC += "</div>";
        htmlC += "</a>";
        arrNotify.push(htmlC);
      }
    });
    arrNotify.slice().reverse();
    $("#notification").html(arrNotify.join(""));
    if (notificationsCount == 0) {
      $(".alert-count").css("display", "none");
    } else {
      $(".alert-count").css("display", "block");
      if (notificationsCount < 100) {
        $(".alert-count").text(notificationsCount);
      } else {
        $(".alert-count").text("99+");
      }
    }
  });
}
function changePageFormHeader(page, idActive) {
  var classLi = document.getElementsByClassName("mm-sidebar");
  if (classLi && classLi.length > 0) {
    for (let index = 0, len = classLi.length; index < len; index++) {
      var element = classLi[index];
      element.classList.remove("mm-active");
    }
  }
  var idActive = document.getElementById(idActive);
  idActive.parentElement.classList.add("mm-active");
  var pageContent = document.getElementsByClassName("page-content");
  if (pageContent.item(0)) {
    pageContent.item(0).remove();
  }
  localStorage.setItem("page", page);
  loadHtml(
    "../../../inc/layout/admin/content/" + page + "/" + page + ".html",
    ".page-wrapper",
    "div",
    "page-content",
    "",
    "afterbegin",
    "../../../assets/js/admin/" + page + "/" + page + ".js"
  );
}
function logout() {
  document.cookie = `token=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  document.cookie = `username=${currentUserName}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  token = null;
  currentUserName = null;
  document.getElementsByClassName("switcher-wrapper").item(0).remove();
  document.getElementsByClassName("wrapper").item(0).innerHTML = "";
  startLoad(null);
}
