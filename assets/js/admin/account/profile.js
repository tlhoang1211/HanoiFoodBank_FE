var listImageAccount = [];
// food
var myWidgetFood = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#new-account-form",
    folder: "hanoi_food_bank_project/uploaded_food",
    fieldName: "thumbnails[]",
    thumbnails: ".thumbnails",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageAccount.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnails[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("btn-upload-account").addEventListener(
  "click",
  function () {
    myWidgetFood.open();
  },
  false
);

// delete image
$("body").on("click", ".cloudinary-delete", function () {
  var splittedImg = $(this).parent().find("img").attr("src").split("/");
  var imgName =
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];
  var publicId = $(this).parent().attr("data-cloudinary");
  $(this).parent().remove();
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

function getAverageRating(userID) {
  getConnectAPI(
    "GET",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?userId=${userID}&status=1&sortBy=id&order=desc`,
    null,
    function (data) {
      let sumAllRate = 0;
      var feedbacksList = data.data.content;
      for (feedback of feedbacksList) {
        sumAllRate = sumAllRate + parseInt(feedback.rate);
      }
      var avgRating;
      if (feedbacksList.length == 0) {
        avgRating = 0;
      } else {
        avgRating = Math.round(sumAllRate / feedbacksList.length);
      }
      for (var i = 1; i <= avgRating; i++) {
        document
          .getElementsByClassName(`star${i}`)[0]
          .classList.add("rating__icon--star");
      }
    },
    function (errorThrown) {}
  );
}

// get data Account
function getDetailAccount() {
  getConnectAPI(
    "GET",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/" + usernameDetail,
    null,
    function (result) {
      getAverageRating(result.data.id);
      getListFeedback(result.data.id);
      if (result && result.status == 200) {
        if (result.data) {
          $("#name_account, .name_account").val(result.data.name);
          $(".name_account").text(result.data.name);
          $("#username_account, .username_account").val(result.data.username);
          $("#phone_account").val(result.data.phone);
          $("#address_account, .address_account").val(result.data.address);
          $("#avatar_account").attr(
            "src",
            "https://res.cloudinary.com/vernom/image/upload/" +
              result.data.avatar
          );
        }
      }
    },
    function (errorThrown) {}
  );
}
getDetailAccount();

// save Account
function saveChangeAccount() {
  var name = $("#name_account").val();
  var username = $("#username_account").val();
  var phone = $("#phone_account").val();
  var address = $("#address_account").val();
  var password = $("#address_account").val();
  if (!name) {
    notification("warning", "Name is required!");
    return false;
  }
  if (!username) {
    notification("warning", "Username is required!");
    return false;
  }
  if (!address) {
    notification("warning", "Address is required!");
    return false;
  }
  if (listImageAccount.length == 0) {
    notification("warning", "Avatar is required!");
    return false;
  }

  var dataPost = {
    name: name,
    username: username,
    email: "admin@gmail.com",
    phone: phone,
    address: address,
    avatar: listImageAccount[0],
    updatedBy: objAccount.id,
    status: 1,
  };
  getConnectAPI(
    "POST",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/" + idUserDetail,
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        notification("success", "Successfully added new");
        goBack("account", "account");
      }
    },
    function (errorThrown) {}
  );
}

function getListFeedback(userID, pageIndex) {
  if (!pageIndex) {
    pageIndex = 0;
  }
  var optionURL = `&sortBy=createdAt&order=desc&page=${pageIndex}&limit=10`;
  getConnectAPI(
    "GET",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?userId=${userID}` +
      optionURL,
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
            document.querySelectorAll("#table-feedback tbody").lastElementChild
          ) {
            document
              .querySelectorAll("#table-feedback tbody")
              .item(0).innerHTML = "";
          }
          document
            .querySelectorAll("#table-feedback tbody")
            .item(0).innerHTML = renderListFeedback(result.data.content);
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
          swal("Info", "This user hasn't receive any feedback yet!", "info");
        }
      }
    },
    function (errorThrown) {}
  );
}

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
      '" style="width: 30px;height: 30px;"/></td>';
    htmlS += "<td>" + (e.sentName || "") + "</td>";
    htmlS += "<td>" + (e.type == 1 ? "Supplier" : "Recipient" || "") + "</td>";
    htmlS += "<td>" + (e.foodName || "") + "</td>";
    htmlS += "<td>" + (e.foodCategory || "") + "</td>";
    htmlS += "<td>" + (e.content || "") + "</td>";
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
    htmlS += "<td>" + (e.createdAt || "") + "</td>";
    htmlS += "<td>" + (e.updatedAt || "") + "</td>";
    htmlS += "</tr>";
    return htmlS;
  });
  return html.join("");
}
