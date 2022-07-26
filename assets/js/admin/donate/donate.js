var orderBy = "desc",
  statusDonate = null,
  searchName_Donate,
  filter_Category,
  objDetail;

function searchNameDonate(ele, e) {
  searchName_Donate = $(ele).val();
  if (e) {
    if (e.keyCode == 13) {
      getListDonate();
      return false;
    }
  } else {
    getListDonate();
  }
}

// get data Donate
function getListDonate(pageIndex) {
  if (!pageIndex) {
    pageIndex = 0;
  }
  var optionUrl = "";
  if (orderBy) {
    optionUrl += "&order=" + orderBy;
  }
  optionUrl += "&sortBy=createdAt";
  if (searchName_Donate) {
    optionUrl += "&name=" + searchName_Donate;
  }
  // ?name=&phone=&amount=&startCreated=2021-11-01&endCreated=2021-11-04&status=1&page=0&limit=10&sortBy=id&order=desc
  getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/donations/search?page=" +
      pageIndex +
      "&limit=" +
      pageSize +
      optionUrl,
    null,
    function (result) {
      if (result && result.status == 200) {
        if (result && result.data && result.data.content) {
          if (result.data.content.length > 0) {
            if (
              document.querySelectorAll("#table-donate tbody").lastElementChild
            ) {
              document
                .querySelectorAll("#table-donate tbody")
                .item(0).innerHTML = "";
            }
            document
              .querySelectorAll("#table-donate tbody")
              .item(0).innerHTML = renderListDonate(result.data.content);
            $("#table-donate").removeClass("d-none");
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
                getListDonate(page - 1);
              },
            };
            $("#data-page").bootstrapPaginator(options);
          } else {
            $("#table-donate").addClass("d-none");
            $(".axbox-footer").addClass("d-none");
            $(".zero-warning").removeClass("d-none");
          }
        }
      } else {
        swal("Info", "There are no data that satisfy the condition", "info");
      }
    },
    function (errorThrown) {}
  );
}

getListDonate();

function renderListDonate(data) {
  var count = 0;
  var html = data.map(function (e) {
    count++;
    var htmlS = "";
    htmlS += "<tr>";
    htmlS += "<td>" + count + "</td>";
    htmlS += "<td>" + (e.name || "") + "</td>";
    htmlS += '<td class="text-end">' + (e.amount || 0) + " $</td>";
    htmlS += "<td>" + (e.content || "") + "</td>";
    htmlS += "<td>" + (e.phone || "") + "</td>";
    htmlS += "<td>" + e.createdAt + "</td>";
    htmlS +=
      '<td><button type="button" class="btn btn-light btn-sm radius-30 px-4" onclick="viewDetailsDonate(this, \'' +
      e.id +
      "')\">View Details</button></td>";
    htmlS += "</tr>";
    return htmlS;
  });
  return html.join("");
}

function viewDetailsDonate(e, id) {
  $("#modal-detail-donate").modal("show");
  getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/donations/" + id,
    null,
    function (result) {
      if (result && result.status == 200) {
        if (result.data) {
          $("#name_donate, .name_donate").text(
            result.data.name ? result.data.name : "*******"
          );
          $("#amount_donate").text(
            result.data.amount ? result.data.amount : "*******"
          );
          $("#mobile_donate").text(
            result.data.phone ? result.data.phone : "*******"
          );
          $("#content_donate").text(
            result.data.content ? result.data.content : "*******"
          );
          $("#date_donate").text(
            result.data.createdAt ? result.data.createdAt : "*******"
          );
        }
      }
    },
    function (errorThrown) {}
  );
}

function searchNameDonation() {
  var input, filter, table, tbody, tr, td, i, txtValue;
  input = document.getElementById("searchDonation");
  filter = input.value.toUpperCase();
  table = document.getElementById("donation-table");
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
        if (n != 0 && n != 2) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (n == 0) {
            if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          }
        }
      } else if (dir == "desc") {
        if (n != 0 && n != 2) {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (n == 0) {
            if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
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
