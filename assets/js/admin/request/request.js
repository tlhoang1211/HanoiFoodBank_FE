var orderByRequest = "desc",
  statusRequest = null,
  searchName_Request,
  filter_Category;
// function formAddRequest() {
//     document.getElementById('modalAddRequest').classList.add('show');
// }
// // save Request
// function saveRequest(){
//     var name = document.getElementById("nameRequest").value;
//     var categoryId = document.getElementById("category").value;
//     var expirationDate = document.getElementById("expirationDate").value;
//     var description = document.getElementById("description").value;
//     if (!expirationDate) {
//         $(".alert-danger").alert();
//         return false;
//       }
//       if (listImageRequest.length == 0) {
//         $(".alert-danger").alert();
//         return false;
//       }

//     var dataPost = {
//         name: name,
//         avatar: listImageRequest[0],
//         images: listImageRequest.join(","),
//         expirationDate: expirationDate,
//         createdBy: objAccount.id,
//         categoryId: categoryId,
//         description: description
//     }
//     getConnectAPI('POST', 'https://hanoifoodbank.herokuapp.com/api/v1/hfb/Requests', JSON.stringify(dataPost), function(result){
//         if (result && result.status == 200) {
//             getListRequest();
//             $('#modalAddRequest').modal('hide');
//         }
//     },
//         function(errorThrown){}
//     )
// }

function filterStatusRequest(e, type) {
  if (type) {
    statusRequest = type;
  } else {
    statusRequest = null;
  }
  addActive(e);
  getListRequest();
}
// get data Request
function getListRequest(pageIndex) {
  if (!pageIndex) {
    pageIndex = 0;
  }
  var optionUrl = "";
  if (statusRequest) {
    optionUrl += "&status=" + parseInt(statusRequest);
  }
  if (orderByRequest) {
    optionUrl += "&order=" + orderByRequest;
  }
  optionUrl += "&sortBy=createdAt";
  getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests?page=" +
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
          if (
            document.querySelectorAll("#table-request tbody").lastElementChild
          ) {
            document
              .querySelectorAll("#table-request tbody")
              .item(0).innerHTML = "";
          }
          document
            .querySelectorAll("#table-request tbody")
            .item(0).innerHTML = renderListRequest(result.data.content);
          $("#table-request").removeClass("d-none");
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
              getListRequest(page - 1);
            },
          };
          $("#data-page").bootstrapPaginator(options);
        } else {
          $("#table-request").addClass("d-none");
          $(".axbox-footer").addClass("d-none");
          $(".zero-warning").removeClass("d-none");
        }
      }
    },
    function (errorThrown) {}
  );
}
getListRequest();
function renderListRequest(data) {
  var count = 0;
  var html = data.map(function (e) {
    count++;
    var htmls = "";
    htmls += "<tr>";
    htmls += "<td>" + count + "</td>";
    htmls += "<td>" + (e.foodName || "") + "</td>";
    htmls += "<td>" + (e.message || "") + "</td>";
    htmls += "<td>" + (e.supplierName || "") + "</td>";
    htmls += "<td>" + (e.recipientName || "") + "</td>";
    htmls += "<td>" + (e.recipientPhone || "") + "</td>";
    htmls += "<td>" + (e.recipientAddr || "") + "</td>";
    htmls += "<td>";
    htmls +=
      '<div class="data-status d-flex align-items-center ' +
      colorStatusRequest(e.status) +
      '">';
    htmls +=
      '<i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i>';
    htmls += "<span>" + convertStatusRequest(e.status) + "</span>";
    htmls += "</div>";
    htmls += "</td>";
    htmls += "<td>" + (e.createdAt || "") + "</td>";

    htmls += '<td style="width: 55px;">';
    htmls += '<div class="d-flex order-actions">';
    htmls +=
      "<a onclick=\"formUpdateRequest(this, '" +
      e.foodId +
      "' , '" +
      e.recipientId +
      "' , '" +
      e.message +
      "' , '" +
      e.status +
      '\')"><i class="bx bx-edit"></i></a>';
    htmls += "</div>";
    htmls += "</td>";
    htmls += '<td style="width: 55px;">';
    if (e.status == 1 || e.status == 2) {
      htmls += '<div class="d-flex order-actions">';
      htmls +=
        "<a onclick=\"approvalRequest(this, '" +
        e.foodId +
        "' , '" +
        e.recipientId +
        '\')"><i class="bx bx-check"></i></a>';
      htmls += "</div>";
    }
    htmls += "</td>";
    htmls += '<td style="width: 55px;">';
    if (e.status != 0) {
      htmls += '<div class="d-flex order-actions">';
      htmls +=
        "<a onclick=\"deleteRequest(this, '" +
        e.foodId +
        "', '" +
        e.recipientId +
        '\')" class=""><i class="bx bxs-trash"></i></a>';
      htmls += "</div>";
    }

    htmls += "</td></tr>";
    return htmls;
  });
  return html.join("");
}

var idApprovalRequest, objUpdate;
function formUpdateRequest(e, foodId, recipientId, message, status) {
  $("#updateRequest").modal("show");
  $("#message").val(message);
  $("#statusRequest").val("" + status);
  objUpdate = {
    foodId: foodId,
    recipientId: recipientId,
  };
}
function updateRequest() {
  var message = $("#message").val();
  var status = $("#statusRequest").val();
  if (!message) {
    notification("warning", "Message is required!");
    return false;
  }
  var dataPost = {
    message: message,
    status: parseInt(status),
    updatedBy: objAccount.id,
  };
  getConnectAPI(
    "POST",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/${objUpdate.recipientId}/${objUpdate.foodId}`,
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        notification("success", result.message);
        setTimeout(() => {
          $("#updateRequest").modal("hide");
        }, 0);
        getListRequest();
      }
    },
    function (errorThrown) {}
  );
}

function approvalRequest(e, foodId, recipientId) {
  idApprovalRequest = {
    status: 3,
    recipientId: parseInt(recipientId),
    foodId: parseInt(foodId),
  };
  $("#approvalRequest").modal("show");
  $("#approvalRequest").modal("hide");
}

function onBrowseRequest(status) {
  var dataPost = {
    status: parseInt(status),
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
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/${idApprovalRequest.recipientId}/${idApprovalRequest.foodId}`,
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        setTimeout(() => {
          $("#approvalRequest").modal("hide");
        }, 0);
        getListRequest();
        notification("success", result.message);
        Notification.send(parseInt(idApprovalRequest.recipientId), {
          senderID: "Admin",
          senderEmail: "Admin",
          foodID: parseInt(idApprovalRequest.id),
          foodAvatar: idApprovalRequest.avatar,
          title: "Admin has approved your request.",
          requestTime: "Request time: " + time,
          notifyCategory: "Request",
          status: 1,
        });
      }
    },
    function (errorThrown) {}
  );
}
var objDelete;
function deleteRequest(e, foodId, recipientId) {
  objDelete = {
    foodId: foodId,
    recipientId: recipientId,
  };
  $("#deleteRequest").modal("show");
}
function onDeleteRequest() {
  var dataPost = {
    updatedBy: objAccount.id,
    status: 0,
  };
  getConnectAPI(
    "POST",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/" +
      parseInt(objDelete.recipientId) +
      "/" +
      parseInt(objDelete.foodId),
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        setTimeout(() => {
          $("#deleteRequest").modal("hide");
        }, 0);
        notification("success", result.message);
        getListRequest();
      }
    },
    function (errorThrown) {}
  );
}

function convertStatusRequest(status) {
  var text = "";
  switch (status) {
    case 0:
      text = "Deactive";
      break;
    case 1:
      text = "Pending";
      break;
    case 2:
      text = "Confirmed";
      break;
    case 3:
      text = "Done";
      break;
    case 4:
      text = "Canceled";
      break;
    case 5:
      text = "Denied";
      break;
  }
  return text;
}

function colorStatusRequest(status) {
  var color = "";
  switch (status) {
    case 0:
      color = "text-danger";
      break;
    case 1:
      color = "text-warning";
      break;
    case 2:
      color = "text-info";
      break;
    case 3:
      color = "text-success";
      break;
    case 4:
      color = "text-default";
      break;
    default:
      color = "text-warning";
      break;
  }
  return color;
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
  console.log(n);
  while (switching) {
    switching = false;
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (n != 0 && n != 3) {
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
        if (n != 0 && n != 3) {
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

function searchNameRequest() {
  var input, filter, table, tbody, tr, td, i, txtValue;
  input = document.getElementById("searchRequest");
  filter = input.value.toUpperCase();
  table = document.getElementById("request-table");
  tbody = table.getElementsByTagName("tbody")[0];
  tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
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
