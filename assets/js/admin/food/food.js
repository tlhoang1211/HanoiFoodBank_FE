var orderBy = "desc",
  statusFood = null,
  searchName,
  filter_Category;

function formAddFood() {
  var pageContent = document.getElementsByClassName("page-content");
  if (pageContent.item(0)) {
    pageContent.item(0).remove();
  }
  localStorage.setItem("page", "newFood");
  loadHtml(
    "../../../inc/layout/admin/content/food/newFood.html",
    ".page-wrapper",
    "div",
    "page-content",
    "",
    "afterbegin",
    "../../../assets/js/admin/food/newFood.js"
  );
}

function filterStatus(e, type) {
  if (type) {
    statusFood = type;
  } else {
    statusFood = null;
  }
  addActive(e);
  getListFood();
}
function filterCategory(e, categoryId) {
  if (categoryId) {
    filter_Category = parseInt(categoryId);
  } else {
    filter_Category = null;
  }
  addActive(e);
  getListFood();
}

function searchNameFood(ele) {
  searchName = $(ele).val();
  getListFood();
}

// get data food
function getListFood(pageIndex) {
  if (!pageIndex) {
    pageIndex = 0;
  }
  var optionUrl = "";
  if (statusFood) {
    optionUrl += "&status=" + parseInt(statusFood);
  }
  if (orderBy) {
    optionUrl += "&order=" + orderBy;
  }
  optionUrl += "&sortBy=createdAt";
  if (searchName) {
    optionUrl += "&name=" + searchName;
  }
  if (filter_Category) {
    optionUrl += "&categoryId=" + filter_Category;
  }
  getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?page=" +
      pageIndex +
      "&limit=" +
      pageSize +
      optionUrl,
    null,
    function (result) {
      if (result && result.status == 200) {
        if (
          result &&
          result.data &&
          result.data.content &&
          result.data.content.length > 0
        ) {
          if (document.querySelectorAll("#table-food tbody").lastElementChild) {
            document.querySelectorAll("#table-food tbody").item(0).innerHTML =
              "";
          }
          document
            .querySelectorAll("#table-food tbody")
            .item(0).innerHTML = renderListFood(result.data.content);
          $("#table-food").removeClass("d-none");
          $(".axbox-footer").removeClass("d-none");
          $(".zero-warning").addClass("d-none");
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
              getListFood(page - 1);
            },
          };
          $("#data-page").bootstrapPaginator(options);
        } else {
          $("#table-food").addClass("d-none");
          $(".axbox-footer").addClass("d-none");
          $(".zero-warning").removeClass("d-none");
        }
      }
    },
    function (errorThrown) {}
  );
}

getListFood();

function renderListFood(data) {
  var count = 0;
  var html = data.map(function (e) {
    count++;
    var htmlS = "";
    htmlS += "<tr>";
    htmlS += "<td>" + count + "</td>";
    htmlS +=
      '<td><img src="https://res.cloudinary.com/vernom/image/upload/' +
      e.avatar +
      '" style="width: 30px;height: 30px;"/></td>';
    htmlS += "<td>" + (e.name || "") + "</td>";
    htmlS += "<td>" + convertCategory(e.categoryId) + "</td>";
    htmlS += "<td>" + e.createdAt + "</td>";
    htmlS += "<td>" + (e.expirationDate || "") + "</td>";
    htmlS += "<td>";
    htmlS +=
      '<div class="data-status d-flex align-items-center ' +
      colorStatusFood(e.status) +
      '">';
    htmlS +=
      '<i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i>';
    htmlS += "<span>" + convertStatusFood(e.status) + "</span>";
    htmlS += "</div>";
    htmlS += "</td>";
    htmlS += '<td style="width: 55px;">';
    htmlS += '<div class="d-flex order-actions">';
    htmlS +=
      "<a onclick=\"formUpdateFood(this, '" +
      e.id +
      '\')"><i class="bx bx-edit"></i></a>';
    htmlS += "</div>";
    htmlS += "</td>";
    htmlS += '<td style="width: 55px;">';
    if (e.status == 1) {
      htmlS += '<div class="d-flex order-actions">';
      htmlS +=
        "<a onclick=\"approvalFood(this, '" +
        e.id +
        "', '" +
        e.createdBy +
        "', '" +
        e.avatar +
        '\')"><i class="bx bx-check"></i></a>';
      htmlS += "</div>";
    }
    htmlS += "</td>";
    htmlS += '<td style="width: 55px;">';
    if (e.status == 1) {
      htmlS += '<div class="d-flex order-actions">';
      htmlS +=
        "<a onclick=\"deleteFood(this, '" +
        e.id +
        "', '" +
        e.name +
        "', '" +
        e.categoryId +
        "', '" +
        e.avatar +
        "', '" +
        e.images +
        "', '" +
        e.description +
        "', '" +
        e.content +
        "', '" +
        e.expirationDate +
        '\')" class="' +
        (e.status === 0 ? "d-none" : "") +
        '"><i class="bx bxs-trash"></i></a>';
      htmlS += "</div>";
    }
    htmlS += "</td></tr>";
    return htmlS;
  });
  return html.join("");
}

var idApproval;
function approvalFood(e, id, createdBy, avatar) {
  idApproval = {
    ele: e.parentElement.parentElement.parentElement,
    id: id,
    createdBy: createdBy,
    avatar: avatar,
  };
  $("#approvalFood").modal("show");
}

function onBrowseFood() {
  var foodID = idApproval.id;
  var dataPost = {
    status: 2,
    updatedBy: objAccount.id,
  };
  var today = new Date();
  var time =
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
  getConnectAPI(
    "POST",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/status/${foodID}`,
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        notification("success", result.message);
        $("#approvalFood").modal("hide");
        getListFood();
        Notification.send(parseInt(idApproval.createdBy), {
          senderID: objAccount.id,
          senderEmail: objAccount.email,
          foodID: parseInt(idApproval.id),
          foodAvatar: idApproval.avatar,
          title: "Admin has approved your food.",
          requestTime: "Time request: " + time,
          notifyCategory: "food",
          status: 1,
        });
        getConnectAPI(
          "GET",
          `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users?role=ROLE_USER`,
          null,
          function (listUsers) {
            if (listUsers && listUsers.status == 200) {
              for (var user of listUsers.data) {
                if (user.id != idApproval.createdBy) {
                  Notification.send(parseInt(user.id), {
                    senderID: objAccount.id,
                    senderEmail: objAccount.email,
                    foodID: parseInt(idApproval.id),
                    foodAvatar: idApproval.avatar,
                    title: "New food uploaded!",
                    requestTime: "Time request: " + time,
                    notifyCategory: "food",
                    status: 1,
                  });
                }
              }
            }
          },
          function (errorThrown) {}
        );
      }
    },
    function (errorThrown) {}
  );
}

var objDelete;
function deleteFood(
  e,
  id,
  name,
  cateID,
  avatar,
  images,
  description,
  content,
  expirationDate
) {
  objDelete = {
    ele: e.parentElement.parentElement.parentElement,
    id: id,
    name: name,
    cateID: cateID,
    avatar: avatar,
    images: images,
    description: description,
    content: content,
    expirationDate: expirationDate,
  };
  $("#deleteFood").modal("show");
}

function onDeleteFood() {
  var dataPost = {
    name: objDelete.name,
    updatedBy: objAccount.id,
    categoryId: objDelete.cateID,
    status: 0,
    avatar: objDelete.avatar,
    images: objDelete.images,
    description: objDelete.description,
    content: objDelete.content,
    expirationDate: objDelete.expirationDate,
  };
  getConnectAPI(
    "POST",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${objDelete.id}`,
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        notification("success", "Delete successfully!");
        $("#deleteFood").modal("hide");
        getListFood();
      }
    },
    function (errorThrown) {}
  );
}

function convertStatusFood(status) {
  var text = "";
  switch (status) {
    case 0:
      text = "Deactive";
      break;
    case 1:
      text = "Pending";
      break;
    case 2:
      text = "Active";
      break;
    case 3:
      text = "Expired";
      break;
    default:
      text = "Pending";
      break;
  }
  return text;
}

function colorStatusFood(status) {
  var color = "";
  switch (status) {
    case 0:
      color = "text-danger";
      break;
    case 1:
      color = "text-warning";
      break;
    case 2:
      color = "text-success";
      break;
    case 3:
      color = "text-default";
      break;
    default:
      color = "text-warning";
      break;
  }
  return color;
}

function convertCategory(id) {
  var text = "";
  if (id && arr_Category) {
    var find = arr_Category.find(function (e) {
      return id == e.id;
    });
    if (find) {
      text = find.name;
    }
  }
  return text;
}

function renderDropdowFilterCategory() {
  var html = "";
  html +=
    '<a class="dropdown-item active" onclick="filterCategory(this)">All</a>';
  for (let index = 0; index < arr_Category.length; index++) {
    var element = arr_Category[index];
    html +=
      '<a class="dropdown-item" onclick="filterCategory(this, \'' +
      element.id +
      "')\">" +
      element.name +
      "</a>";
  }
  $(".filter-category .dropdown-menu").append(html);
}

renderDropdowFilterCategory();
var dataIdFood;
function formUpdateFood(e, id) {
  dataIdFood = id;
  var pageContent = document.getElementsByClassName("page-content");
  if (pageContent.item(0)) {
    pageContent.item(0).remove();
  }
  localStorage.setItem("page", "newFood");
  loadHtml(
    "../../../inc/layout/admin/content/food/foodDetail.html",
    ".page-wrapper",
    "div",
    "page-content",
    "",
    "afterbegin",
    "../../../assets/js/admin/food/updateFood.js"
  );
}

function reloadFood() {
  getConnectAPI(
    "GET",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/scan`,
    null,
    function (result) {
      if (result && result.status == 200) {
        getListFood();
      }
    },
    function (errorThrown) {}
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

function searchNameFood() {
  var input, filter, table, tbody, tr, td, i, txtValue;
  input = document.getElementById("searchFood");
  filter = input.value.toUpperCase();
  table = document.getElementById("food-table");
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
