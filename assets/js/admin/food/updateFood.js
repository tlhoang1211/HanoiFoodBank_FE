// var listImageFood = [];
// // food
// var myWidgetFood = cloudinary.createUploadWidget(
//     {
//         cloudName: "vernom",
//         uploadPreset: "fn5rpymu",
//         form: "#new-food-form",
//         folder: "hanoi_food_bank_project/uploaded_food",
//         fieldName: "thumbnails[]",
//         thumbnails: ".thumbnails",
//     },
//     (error, result) => {
//         if (!error && result && result.event === "success") {
//             listImageFood.push(result.info.path);
//             var arrayThumnailInputs = document.querySelectorAll(
//             'input[name="thumbnails[]"]'
//             );
//             for (let i = 0; i < arrayThumnailInputs.length; i++) {
//             arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
//                 "data-cloudinary-public-id"
//             );
//             }
//         }
//     }
// );

// document.getElementById("btn-upload").addEventListener("click", function () {
//         myWidgetFood.open();
//     },
//     false
// );

// convert request status
function convertRequestStatus(status) {
  switch (status) {
    case 0:
      status = "Deactive";
      break;
    case 1:
      status = "Pending";
      break;
    case 2:
      status = "Confirmed";
      break;
    case 3:
      status = "Done";
      break;
    case 4:
      status = "Canceled";
      break;
    case 5:
      status = "Denied";
      break;
  }
  return status;
}

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

function findFood() {
  getConnectAPI(
    "GET",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${dataIdFood}`,
    null,
    function (result) {
      console.log(result);
      if (result && result.status == 200) {
        if (result.data) {
          let cb = document.getElementsByClassName("card-body")[1];
          let li = cb.getElementsByClassName("nav-item")[1];
          li.getElementsByTagName("a")[0].setAttribute(
            "onclick",
            `getRequestsOnFood(${result.data.id}, 0)`
          );
          if (result.data.images) {
            var arrImage = result.data.images.split(",");
            if (arrImage && arrImage.length > 0) {
              $("#avatar_food").attr(
                "src",
                "https://res.cloudinary.com/vernom/image/upload/" +
                  result.data.avatar
              );
              var htmlI = "";
              for (let index = 0; index < arrImage.length; index++) {
                var element = arrImage[index];
                htmlI +=
                  '<div class="col"><img src="https://res.cloudinary.com/vernom/image/upload/' +
                  element +
                  '" width="70" class="border rounded cursor-pointer" alt=""></div>';
              }
              $("#avatar_food").append(htmlI);
            }
          }
          $(".nameCategory").text(result.data.category);
          $(".supplierName").text(result.data.supplierName);
          $(".supplierEmail").text(result.data.supplierEmail);
          $(".createdDate").text(result.data.createdAt);
          $(".expirationDate").text(result.data.expirationDate);
          $(".titleFood").text(result.data.name);
          $(".contentFood").text(result.data.content);
          $("#primaryhome p").text(result.data.description);
        }
      }
    },
    function (errorThrown) {}
  );
}
findFood();

// save food
function saveUpdateFood() {
  var name = $("#nameFood").val();
  var categoryId = $("#category_newFood").val();
  var expirationDate = $("#expirationDate").val();
  var description = $("#description").val();
  if (!name) {
    notification("warning", "Food name is required!");
    return false;
  }
  if (!expirationDate) {
    notification("warning", "Expiration Date is required!");
    return false;
  }
  if (listImageFood.length == 0) {
    notification("warning", "Food pictures is required!");
    return false;
  }

  var dataPost = {
    name: name,
    avatar: listImageFood[0],
    images: listImageFood.join(","),
    expirationDate: expirationDate,
    createdBy: objAccount.id,
    categoryId: categoryId,
    description: description,
  };
  getConnectAPI(
    "POST",
    "https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods",
    JSON.stringify(dataPost),
    function (result) {
      if (result && result.status == 200) {
        notification("success", "Successfully added new");
        goBack("food", "food");
      }
    },
    function (errorThrown) {}
  );
}
function renderOptionCategory() {
  var htmlO = "";
  for (let index = 0; index < arr_Category.length; index++) {
    var element = arr_Category[index];
    htmlO += '<option value="' + element.id + '">' + element.name + "</option>";
  }
  $("#category_newFood").append(htmlO);
}
renderOptionCategory();

function getRequestsOnFood(foodId, pageIndex) {
  optionUrl = `&sortBy=createdAt&order=desc&page=${pageIndex}`;
  getConnectAPI(
    "GET",
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests?foodId=${foodId}` +
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
          let requestsList = result.data.content;
          if (
            document.querySelectorAll("#table-requests-food tbody")
              .lastElementChild
          ) {
            document
              .querySelectorAll("#table-requests-food tbody")
              .item(0).innerHTML = "";
          }
          document
            .querySelectorAll("#table-requests-food tbody")
            .item(0).innerHTML = renderRequestsOnFood(requestsList);
          var total = 0;
          total = result.data.totalElements;
          if (total == 0) {
            $(".requestCount").text(total + " request");
          } else {
            $(".requestCount").text(total + " requests");
          }
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
              getRequestsOnFood(foodId, page - 1);
            },
          };
          $("#data-page").bootstrapPaginator(options);
        } else {
          swal("Info", "No one has requested this food yet!", "info");
        }
      }
    },
    function (errorThrown) {}
  );
}

function renderRequestsOnFood(data) {
  let count = 0;
  var html = data.map(function (e) {
    count++;
    console.log(e);
    var htmlS = "";
    htmlS += "<tr>";
    htmlS += "<td>" + count + "</td>";
    htmlS += "<td>" + e.recipientName + "</td>";
    htmlS += "<td>" + e.message + "</td>";
    htmlS += "<td>" + e.createdAt + "</td>";
    htmlS += "<td>" + e.expirationDate + "</td>";
    htmlS += "<td>" + convertRequestStatus(e.status) + "</td>";
    htmlS += "</tr>";
    return htmlS;
  });

  return html.join("");
}
