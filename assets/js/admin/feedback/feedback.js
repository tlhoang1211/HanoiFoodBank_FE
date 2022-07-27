var orderBy = "desc";

// get data Feedback
function getListFeedback(pageIndex) {
  if (!pageIndex) {
    pageIndex = 0;
  }
  var optionUrl = "";
  if (orderBy) {
    optionUrl += "&order=" + orderBy;
  }
  optionUrl += "&sortBy=createdAt";
  getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?page=" +
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
              document.querySelectorAll("#table-feedback tbody")
                .lastElementChild
            ) {
              document
                .querySelectorAll("#table-feedback tbody")
                .item(0).innerHTML = "";
            }
            document
              .querySelectorAll("#table-feedback tbody")
              .item(0).innerHTML = renderListFeedback(result.data.content);
            $("#table-feedback").removeClass("d-none");
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
                getListFeedback(page - 1);
              },
            };
            $("#data-page").bootstrapPaginator(options);
          } else {
            $("#table-feedback").addClass("d-none");
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

getListFeedback();

function renderListFeedback(data) {
  var count = 0;
  var html = data.map(function (e) {
    count++;
    var htmlS = "";
    htmlS += "<tr>";
    htmlS += "<td>" + count + "</td>";
    htmlS +=
      '<td><img src="https://res.cloudinary.com/vernom/image/upload/' +
      e.sentAvatar +
      '" width="40" height="40"></td>';
    htmlS += "<td>" + (e.sentName || "") + "</td>";
    htmlS += "<td>" + (e.type == 1 ? "Supplier" : "Recipient") + "</td>";
    htmlS +=
      '<td><img src="https://res.cloudinary.com/vernom/image/upload/' +
      e.image.split(",")[0] +
      '" width="40" height="40"></td>';
    htmlS += "<td>" + (e.foodName || "") + "</td>";
    htmlS += "<td>" + (e.foodCategory || "") + "</td>";
    htmlS += `<td data-value="${e.rate}">`;
    for (let i = 1; i <= e.rate; i++) {
      htmlS += `
              <label
                aria-label="${i} star"
                class="feedback-sender-rating__label"
                for="rating-${i}"
                ><i
                  class="feedback-sender-star${i} rating__icon fa fa-star rating__icon--star"
                ></i
              ></label>
              <input
                class="feedback-sender-rating__input"
                name="rating"
                id="rating-${i}"
                value="${i}"
                type="radio"
                disabled
              />
              `;
    }
    if (e.rate < 5) {
      for (let j = e.rate + 1; j <= 5; j++) {
        htmlS += `
          <label
            aria-label="${j} star"
            class="feedback-sender-rating__label"
            for="rating-${j}"
            ><i
              class="feedback-sender-star${j} rating__icon fa fa-star"
            ></i
          ></label>
          <input
            class="feedback-sender-rating__input"
            name="rating"
            id="rating-${j}"
            value="${j}"
            type="radio"
            disabled
          />
      `;
      }
    }
    htmlS += "</td>";
    htmlS += "<td>" + (e.content || "") + "</td>";
    htmlS +=
      '<td><img src="https://res.cloudinary.com/vernom/image/upload/' +
      e.avatar +
      '" width="40" height="40"></td>';
    htmlS += "<td>" + (e.name || "") + "</td>";
    htmlS += "<td>" + (e.createdAt || "") + "</td>";
    htmlS += "</tr>";
    return htmlS;
  });
  return html.join("");
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

function searchNameFeedback() {
  var input, filter, table, tbody, tr, td, i, txtValue;
  input = document.getElementById("searchFeedback");
  filter = input.value.toUpperCase();
  table = document.getElementById("feedback-table");
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
