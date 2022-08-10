var orderByAccount = "desc",
  statusAccount = null;

function formNewAccount() {
  var pageContent = document.getElementsByClassName("page-content");
  if (pageContent.item(0)) {
    pageContent.item(0).remove();
  }
  localStorage.setItem("page", "newFood");
  loadHtml(
    "../../../inc/layout/admin/content/account/newAccount.html",
    ".page-wrapper",
    "div",
    "page-content",
    "",
    "afterbegin",
    "../../../assets/js/admin/account/newAccount.js"
  );
}

function filterStatus(e, type) {
  if (type) {
    statusAccount = type;
  } else {
    statusAccount = null;
  }
  addActive(e);
  document.getElementsByTagName("tbody")[0].innerHTML = "";
  getListAccount();
}

function searchNameAccount() {
  var input, filter, table, tbody, tr, td, i, txtValue;
  input = document.getElementById("searchAccount");
  filter = input.value.toUpperCase();
  table = document.getElementById("account-table");
  tbody = table.getElementsByTagName("tbody")[0];
  tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

var acts;
// get data Account
async function getListAccount(pageIndex) {
  if (!pageIndex) {
    pageIndex = 0;
  }
  var optionUrl = "";
  if (statusAccount) {
    optionUrl += "&status=" + parseInt(statusAccount);
  }
  if (orderByAccount) {
    optionUrl += "&order=" + orderByAccount;
  }
  optionUrl += "&sortBy=name";
  await getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/search?page=" +
      pageIndex +
      "&limit=" +
      pageSize +
      optionUrl,
    null,
    async function (result) {
      if (result && result.status == 200) {
        if (
          result &&
          result.data &&
          result.data.content &&
          result.data.content.length > 0
        ) {
          if (
            document.querySelectorAll("#table-account tbody").lastElementChild
          ) {
            document
              .querySelectorAll("#table-account tbody")
              .item(0).innerHTML = "";
          }
          $("#table-account").removeClass("d-none");
          $(".axbox-footer").removeClass("d-none");
          $(".zero-warning").addClass("d-none");
          acts = result.data.content;
          await getFeedbackCount();
          var total = 0;
          total = result.data.totalElements;
          var pageNumber = Math.ceil(total / pageSize);
          if (pageNumber == 0) {
            pageNumber = 1;
          }
          var options = {
            currentPage: pageIndex + 1,
            totalPages: pageNumber,
            totalCount: total,
            size: "normal",
            alignment: "right",
            onPageClicked: function (e, originalEvent, click, page) {
              getListAccount(page - 1);
            },
          };
          $("#data-page").bootstrapPaginator(options);
        } else {
          $("#table-account").addClass("d-none");
          $(".axbox-footer").addClass("d-none");
          $(".zero-warning").removeClass("d-none");
        }
      }
    },
    function (errorThrown) {}
  );
}

getListAccount();

async function getFeedbackCount() {
  for (var e of acts) {
    const feedbacksCount = await fetch(
      `https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?userId=${e.id}&status=1&sortBy=id&order=desc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    e.feedbackCount = (await feedbacksCount.json()).data.totalElements;
  }
  renderListAccount();
}

var singleAccountAva;
function renderListAccount() {
  var htmld = "";
  for (var e of acts) {
    singleAccountAva = e.avatar;
    htmld += "<tr><td>" + e.id + "</td>";
    if (e.avatar) {
      htmld +=
        '<td><img src="https://res.cloudinary.com/vernom/image/upload/' +
        e.avatar +
        '" style="width: 30px;height: 30px;"/></td>';
    } else {
      htmld +=
        '<td><img src="https://via.placeholder.com/110x110" style="width: 30px;height: 30px;"/></td>';
    }
    htmld += "<td>" + (e.name || "") + "</td>";
    htmld += "<td>" + e.feedbackCount + "</td>";
    htmld += "<td>" + (e.username || "") + "</td>";
    htmld += "<td>" + (e.phone || "") + "</td>";
    htmld += "<td>" + (e.address || "") + "</td>";
    htmld += "<td>";
    htmld +=
      '<div class="data-status d-flex align-items-center ' +
      colorStatusAccount(e.status) +
      '">';
    htmld +=
      '<i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i>';
    htmld += "<span>" + convertStatusAccount(e.status) + "</span></div></td>";
    htmld += "<td>" + e.createdAt + "</td>";
    htmld += '<td><div class="d-flex order-actions">';
    htmld +=
      "<a onclick=\"formUpdateAccount(this, '" +
      e.id +
      "', '" +
      e.username +
      '\')"><i class="bx bx-edit"></i></a>';
    htmld +=
      '<a class="ms-4" onclick="changeRole(this, \'' +
      e.id +
      '\')"><i class="bx bx-user"></i></a>';
    if (e.status == 1) {
      htmld +=
        `<a class="ms-4" onclick="deactiveAccount(this, \'` +
        e.id +
        '\')"><i class="bx bx-trash"></i></a>';
    } else if (e.status == 0) {
      htmld +=
        `<a class="ms-4" onclick="activeAccount(this, \'` +
        e.id +
        '\')"><i class="bx bx-check"></i></a>';
    }
    htmld += "</td>";
  }
  document.querySelectorAll("#table-account tbody").item(0).innerHTML += htmld;
}

var objDeactiveAccount;
function deactiveAccount(e, id) {
  objDeactiveAccount = {
    ele: e.parentElement.parentElement.parentElement,
    id: id,
  };
  $("#deactiveAccount").modal("show");
}

function onDeactiveAccount() {
  getConnectAPI(
    "POST",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/update-status/${objDeactiveAccount.id}/0`,
    null,
    function (result) {
      if (result && result.status == 200) {
        notification("success", result.message);
        $("#deactiveAccount").modal("hide");
        document.getElementsByTagName("tbody")[0].innerHTML = "";
        getListAccount();
      } else {
        notification("warning", "Something wrong. Please try again!");
      }
      let notifyDeactivePromise = new Promise(function (myResolve) {
        var today = new Date();
        time =
          ("0" + today.getDate()).slice(-2) +
          "/" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "/" +
          today.getFullYear() +
          " " +
          ("0" + today.getHours()).slice(-2) +
          ":" +
          ("0" + today.getMinutes()).slice(-2) +
          ":" +
          ("0" + today.getSeconds()).slice(-2);
        myResolve();
      });
      notifyDeactivePromise.then(function () {
        Notification.send(objDeactiveAccount.id, {
          senderID: 1,
          senderEmail: "admin@gmail.com",
          foodID: objDeactiveAccount.id,
          foodAvatar: singleAccountAva,
          title: "Your account has been disabled!",
          requestTime: "Time: " + time,
          notifyCategory: "Request",
          status: 1,
        });
      });
    },
    function (errorThrown) {}
  );
}

var objActiveAccount;
function activeAccount(e, id) {
  objActiveAccount = {
    ele: e.parentElement.parentElement.parentElement,
    id: id,
  };
  $("#activeAccount").modal("show");
}

function onActiveAccount() {
  getConnectAPI(
    "POST",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/update-status/${objActiveAccount.id}/1`,
    null,
    function (result) {
      if (result && result.status == 200) {
        notification("success", result.message);
        $("#activeAccount").modal("hide");
        document.getElementsByTagName("tbody")[0].innerHTML = "";
        getListAccount();
      } else {
        notification("warning", "Something wrong. Please try again!");
      }
    },
    function (errorThrown) {}
  );
}

function convertStatusAccount(status) {
  var text = "";
  switch (status) {
    case 0:
      text = "Deactive";
      break;
    case 1:
      text = "Active";
      break;
    default:
      text = "Active";
      break;
  }
  return text;
}

function colorStatusAccount(status) {
  var color = "";
  switch (status) {
    case 0:
      color = "text-danger";
      break;
    case 1:
      color = "text-success";
      break;
    default:
      color = "text-success";
      break;
  }
  return color;
}

function changeRole(e, id) {
  $("#modal-changeRole").modal("show");
}

var usernameDetail, idUserDetail;
function formUpdateAccount(e, id, username) {
  idUserDetail = id;
  usernameDetail = username;
  var pageContent = document.getElementsByClassName("page-content");
  if (pageContent.item(0)) {
    pageContent.item(0).remove();
  }
  localStorage.setItem("page", "updateAccount");
  loadHtml(
    "../../../inc/layout/admin/content/account/profile.html",
    ".page-wrapper",
    "div",
    "page-content",
    "",
    "afterbegin",
    "../../../assets/js/admin/account/profile.js"
  );
}

function sortTable(n) {
  var table,
    tbody,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementsByClassName("table-responsive")[0];
  tbody = table.getElementsByTagName("tbody")[0];
  rows = tbody.rows;
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (n != 0) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        if (n != 0) {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
