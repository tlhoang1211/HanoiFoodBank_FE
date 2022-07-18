// hoangtl2 - 01/11/2021 - get data user
// start
var detailRequestID = document.getElementById("detailRequest");
var detailRequestCN = document.getElementsByClassName("detailRequest")[0];
var listUsersRequestID = document.getElementById("listUsersRequest");
var listUsersRequestCN = document.getElementsByClassName("listUsersRequest")[0];
var listPendingRequestID = document.getElementById("listPendingRequest");
var listPendingRequestCN = document.getElementsByClassName(
  "listPendingRequest"
)[0];
var detailRequestID = document.getElementById("detailRequest");
var detailRequestCN = document.getElementsByClassName("detailRequest")[0];
var listActiveFoodID = document.getElementById("listActiveFood");
var listActiveFoodCN = document.getElementsByClassName("listActiveFood")[0];
var listCanceledRequestID = document.getElementById("listCanceledRequest");
var listCanceledRequestCN = document.getElementsByClassName(
  "listCanceledRequest"
)[0];
var listDeniedRequestID = document.getElementById("listDeniedRequest");
var listDeniedRequestCN = document.getElementsByClassName(
  "listDeniedRequest"
)[0];

var foodCount = 0;
var pendingRequestsCount = 0;
var canceledRequestsCount = 0;
var deniedRequestsCount = 0;

var objAccount = null;
var accountID = null;

var cloudinary_url =
  "https://res.cloudinary.com/vernom/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/";

function initPageAccount() {
  getAccount();
  expirationDateRequest();
}
initPageAccount();

function getAccount() {
  fetch(`https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/${currentName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((account) => {
      if (account && account.data) {
        objAccount = account.data;
        accountID = objAccount.id;
        getListFoodAll();
        bindDataAccount(account.data);
      }
    })
    .catch((error) => console.log(error));
}

function bindDataAccount(data) {
  document.querySelector("#account_id").value = data.id;
  document.querySelector("#account_name").value = data.name;
  document.querySelector("#account_phone").value = data.phone;
  document.querySelector("#account_email").value = data.email;
  document.querySelector("#account_address").value = data.address;
  document.querySelector(".name-account").innerHTML = data.name;
  document
    .querySelector("#avatarGallery")
    .setAttribute(
      "href",
      `https://res.cloudinary.com/vernom/image/upload/${data.avatar}`
    );
  document
    .querySelector("#avatarImg")
    .setAttribute(
      "src",
      `https://res.cloudinary.com/vernom/image/upload/${data.avatar}`
    );
  document.querySelector("#avatar_account").src =
    data.avatar ||
    "https://res.cloudinary.com/vernom/image/upload/v1635678562/hanoi_food_bank_project/users_avatar/null_avatar.jpg";
  document.querySelector("#avatar_account").parentElement.href =
    data.avatar ||
    "https://res.cloudinary.com/vernom/image/upload/v1635678562/hanoi_food_bank_project/users_avatar/null_avatar.jpg";
}

function expirationDateRequest() {
  fetch(`https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then(function (data) {
      data.data.content.map(function (request) {
        if (request.status == 4 || request.status == 0) {
        } else {
          var expirationDateReq = getTimeFromString2(request.expirationDate);
          var now1 = new Date().getTime();
          var timeRest1 = expirationDateReq - now1;
          if (timeRest1 <= 0) {
            updateStatusRequest(request);
          } else {
            run();
            // Tổng số giây
            var countDown = setInterval(run, 1000);
            function run() {
              var now = new Date().getTime();
              var timeRest = expirationDateReq - now;
              if (timeRest <= 0) {
                updateStatusRequest(request);
                clearInterval(countDown);
              }
            }
          }
        }
      });
    })
    .catch((error) => console.log(error));
}

function updateStatusRequest(request) {
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/${request.recipientId}/${request.foodId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isToken}`,
      },
      body: JSON.stringify({
        status: 4,
        updatedBy: 1,
      }),
    }
  )
    .then((response) => response.json())
    .then(function (data) {
      var today = new Date();
      var time =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear() +
        " " +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();
      Notification.send(request.recipientId, {
        idNotify: "",
        usernameaccount: "",
        foodid: data.data.foodId,
        avatar: data.data.foodDTO.avatar,
        title: "Request " + data.data.foodDTO.name + " has expired",
        message: "Time request: " + time,
        category: "request",
        status: 1,
      });
    })
    .catch((error) => console.log(error));
}

// update profile
var imgAvatar;
function updateAccount() {
  var account_nameUpdate = document.querySelector("#account_name").value;
  var account_emailUpdate = document.querySelector("#account_email").value;
  var account_phoneUpdate = document.querySelector("#account_phone").value;
  var account_addressUpdate = document.querySelector("#account_address").value;
  if (
    account_nameUpdate == objAccount.name &&
    account_emailUpdate == objAccount.email &&
    account_phoneUpdate == objAccount.phone &&
    account_addressUpdate == objAccount.address &&
    imgAvatar == undefined
  ) {
    swal("Warning!", "You don't update your account!", "warning");
  } else {
    if (imgAvatar == null || imgAvatar == "" || imgAvatar == undefined) {
      imgAvatar = objAccount.avatar;
    }
    fetch(
      `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/${objAccount.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isToken}`,
        },
        body: JSON.stringify({
          name: account_nameUpdate,
          username: account_emailUpdate,
          phone: account_phoneUpdate,
          address: account_addressUpdate,
          avatar: imgAvatar,
          updatedBy: objAccount.id,
          status: 1,
        }),
      }
    )
      .then((response) => response.json())
      .then((account) => {
        if (account && account.data) {
          swal("Success!", "Update account success!", "success");
          objAccount = account.data;
          currentName = objAccount.username;
          bindDataAccount(objAccount);
        }
      })
      .catch((error) => console.log(error));
  }
}

var myWidgetAccount = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    multiple: false,
    form: "#update-account-form",
    folder: "hanoi_food_bank_project/users_avatar",
    fieldName: "thumbnails[]",
    thumbnails: ".thumbnails",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      imgAvatar = result.info.path;
      console.log(imgAvatar);
      console.log("Done! Here is the image info: ", result.info.url);
    }
  }
);

document.getElementById("upload_avatar").addEventListener(
  "click",
  function () {
    myWidgetAccount.open();
  },
  false
);

// change password
function changePassword() {
  var newPassword = document.querySelector("#newPassword").value;
  var confirmNewPassword = document.querySelector("#confirmNewPassword").value;
  var changePasswordAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/change-password/${objAccount.id}`;
  if (newPassword) {
    if (newPassword != confirmNewPassword) {
      swal("Warning!", "Password re-entered is incorrect!", "warning");
    } else {
      fetch(changePasswordAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isToken}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            swal("Success!", "Change password success!", "success");
          }
        })
        .catch((error) => console.log(error));
    }
  } else {
    swal("Warning!", "You don't change the password!", "warning");
  }
}

// end

// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
function listfood() {
  getListFoodAll();
}
function listFoodPost() {
  getListFoodActive();
}
function listFoodPending() {
  getListFoodPending();
}
function listFoodExpired() {
  getListFoodExpired();
}

function getListFoodAll() {
  var foodListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?&createdBy=${objAccount.id}`;
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((foodList) => {
      var listAllFood;
      let listFoodPromise = new Promise(function (myResolve) {
        listAllFood = foodList.data.content;
        listAllFood.map(function (food) {
          if (food.status == 0) {
            const index = listAllFood.indexOf(food);
            listAllFood.splice(index, 1);
          }

          var tet = getTimeFromString2(food.expirationDate);
          var now1 = new Date().getTime();
          var timeRest1 = tet - now1;
          if (timeRest1 <= 0) {
            const index = listAllFood.indexOf(food);
            listAllFood.splice(index, 1);
            var urlUpdateStatus = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/status/${food.id}`;
            fetch(urlUpdateStatus, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${isToken}`,
              },
              body: JSON.stringify({
                status: 0,
                updatedBy: 1,
              }),
            })
              .then((response) => response.json())
              .then((data) => {})
              .catch((error) => console.log(error));
          }
        });
        myResolve();
      });

      listFoodPromise.then(function () {
        renderListFood(listAllFood);
      });
    })
    .catch((error) => console.log(error));
}

function getListFoodActive() {
  var foodListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?status=2&createdBy=${objAccount.id}`;
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((foodList) => {
      renderListFood(foodList.data.content);
      console.log(foodCount);
    })
    .catch((error) => console.log(error));
}

function getListFoodPending() {
  var foodListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?status=1&createdBy=${objAccount.id}`;
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((foodList) => {
      renderListFood(foodList.data.content);
      console.log(foodCount);
    })
    .catch((error) => console.log(error));
}

function getListFoodExpired() {
  var foodListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?status=0&createdBy=${objAccount.id}`;
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((foodList) => {
      renderListFood(foodList.data.content);
      console.log(foodCount);
    })
    .catch((error) => console.log(error));
}

function renderListFood(listFood) {
  foodCount = 0;
  let container = $(".food-list-pagination");
  container.pagination({
    dataSource: listFood,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      $.each(data, function (index, e) {
        foodCount++;
        dataHtml += `<tr id="food-row-${e.id}">
          <td>${foodCount}</td>`;
        if (e.status == 2 || e.status == 0) {
          dataHtml += `<td><a href="./food_detail?id=${
            e.id
          }" style="color: blue;">${e.name || ""}</a></td>`;
        } else {
          dataHtml += `<td>${e.name || ""}</td>`;
        }
        dataHtml += `<td>${formatCategory(e.categoryId)}</td>
            <td>${e.expirationDate}</td>
            <td>${e.createdAt}</td>
            <td>${
              e.status == 0 ? "deactive" : e.status == 1 ? "pending" : "active"
            }</td>`;
        if (e.status == 0) {
          dataHtml += `<td><i class="fa fa-pencil-square-o" style="pointer-events: none; opacity: 0.5;"></i></td>`;
        } else {
          dataHtml += `<td onclick="formUpdateFood(${e.id})"><i class="fa fa-pencil-square-o"></i></td>`;
        }
        dataHtml += `<td onclick="confirmDeleteFood(${e.id})"><i class="fa fa-trash-o"></i></td></tr>`;
      });

      dataHtml += "</div>";
      $("#list-food").html(dataHtml);
    },
  });

  var foodDataTable = document.getElementById("food-data-table");

  if (foodCount == 0) {
    foodDataTable.style.display = "none";
    document.getElementById("no-food-noti").removeAttribute("style");
    document
      .getElementById("center-food-noti")
      .setAttribute("style", "text-align: center;");
  } else {
    foodDataTable.style.display = "block";
    document.getElementById("no-food-noti").style.display = "none";
  }
}

// update food
var editImageFood = document.querySelector(".view-image-product");
var editInfoFood = document.querySelector(".view-info-product");
var editContentDesFood = document.querySelector(".view-info-des-content");
var editUser = document.querySelector(".editUser");
var listFood1 = document.querySelector(".listFood");
var listFoodPagination = document.querySelector(".listFoodPagination");
var listFoodPost1 = document.querySelector(".listFoodPost");
var listFoodPending1 = document.querySelector(".listFoodPending");
var listFoodExpired1 = document.querySelector(".listFoodExpired");
editUser.style.display = "none";
var infoFoodDetail;
function formUpdateFood(id) {
  editUser.style.display = "block";
  listFood1.style.display = "none";
  listFoodPending1.style.display = "none";
  listFoodPost1.style.display = "none";
  listFoodPagination.style.display = "none";
  listFoodExpired1.style.display = "none";

  var getDetailFood = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${id}`;
  fetch(getDetailFood, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((foodInfo) => {
      let editFoodPromise = new Promise(function (myResolve) {
        infoFoodDetail = foodInfo.data;
        myResolve();
      });
      editFoodPromise.then(function () {
        var htmls = `
      <div class="row multi-columns-row" >
        <div class="slider-image">
          <div class="slider-info-food">
            <img src="https://res.cloudinary.com/vernom/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/${foodInfo.data.avatar}" style="width:100%; max-height: 450px">
          </div>
        </div>
      </div>
      `;

        var htmlsInfoProduct = `
        <div class="row">
          <div class="col-sm-12">
            <h3 class="product-title font-alt">${foodInfo.data.name}</h6>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-sm-12">
            <p style="font-size: 12px; color: #000; margin: 0;">Expiration Date: ${foodInfo.data.expirationDate}</p>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-sm-12">
            <div class="product_meta">Categories:<a href="#"> ${foodInfo.data.category}</a>
            </div>
          </div>
        </div>
      `;

        var htmlsDes = `
      <div class="row multi-columns-row" >
      <div class="col-sm-12" style="padding: 0;">
        <p>Description: ${foodInfo.data.description}</p>
      </div>
      </div>
      <div class="row multi-columns-row" >
        <div class="col-sm-12" style="padding: 0;">
          <p>Content: ${foodInfo.data.content}</p>
        </div>
      </div>
      `;

        editImageFood.innerHTML = htmls;
        editInfoFood.innerHTML = htmlsInfoProduct;
        editContentDesFood.innerHTML = htmlsDes;
      });

      document.getElementById("nameFoodEdit").value = foodInfo.data.name;
      document.getElementById("categoryEdit").value = formatCategoryStringToInt(
        foodInfo.data.category
      );
      document.getElementById(
        "expirationDateEdit"
      ).value = foodInfo.data.expirationDate.split("/").reverse().join("-");
      document.getElementById("descriptionEdit").value =
        foodInfo.data.description;
      document.getElementById("contentEdit").value = foodInfo.data.content;
    })
    .catch((error) => console.log(error));
}

function backToFoodList() {
  editUser.style.display = "none";
  listFood1.style.display = "block";
  listFoodPending1.style.display = "block";
  listFoodPost1.style.display = "block";
  listFoodPagination.style.display = "block";
  listFoodExpired1.style.display = "block";
}

// validate form
$("#editformEdit").validate({
  onfocusout: false,
  onkeyup: false,
  onclick: false,
  rules: {
    nameFoodEdit: {
      // name element not id
      required: true,
    },
    categoryEdit: {
      required: true,
    },
    expirationDateEdit: {
      required: true,
    },
    descriptionEdit: {
      required: true,
    },
    contentEdit: {
      required: true,
    },
  },
  messages: {
    nameFoodEdit: {
      required: "Please provide name food.",
    },
    categoryEdit: {
      required: "Please choose category.",
    },
    expirationDateEdit: {
      required: "Please provide expiration date.",
    },
    descriptionEdit: {
      required: "Please provide description.",
    },
    contentEdit: {
      required: "Please provide content.",
    },
  },
});
var listImageFood = [];

function newFoodEdit() {
  var nameFood = document.getElementById("nameFoodEdit").value;
  var category = document.getElementById("categoryEdit").value;
  var expirationDate = document.getElementById("expirationDateEdit").value;
  var description = document.getElementById("descriptionEdit").value;
  var content = document.getElementById("contentEdit").value;

  if (
    !nameFood == false &&
    !category == false &&
    !expirationDate == false &&
    !description == false &&
    !content == false
  ) {
    if (listImageFood.length > 3) {
      swal("Warning!", "You should only add a maximum of 3 images!", "warning");
      console.log(listImageFood.length);
    } else {
      var dataPost;
      if (listImageFood.length == 0) {
        if (
          nameFood == infoFoodDetail.name &&
          category == formatCategoryStringToInt(infoFoodDetail.category) &&
          expirationDate ==
            infoFoodDetail.expirationDate.split("/").reverse().join("-") &&
          description == infoFoodDetail.description &&
          content == infoFoodDetail.content
        ) {
          swal("Warning!", "You haven't updated food information!", "warning");
        } else {
          dataPost = {
            name: nameFood || "",
            avatar: infoFoodDetail.avatar,
            images: infoFoodDetail.images,
            expirationDate: expirationDate,
            updatedBy: objAccount.id,
            categoryId: parseInt(category),
            description: description,
            content: content,
            status: 1,
          };
        }
      } else {
        if (
          nameFood == infoFoodDetail.name &&
          category == formatCategoryStringToInt(infoFoodDetail.category) &&
          expirationDate ==
            infoFoodDetail.expirationDate.split("/").reverse().join("-") &&
          description == infoFoodDetail.description &&
          content == infoFoodDetail.content &&
          listImageFood.join(",") == infoFoodDetail.images
        ) {
          swal("Warning!", "You haven't updated food information!", "warning");
        } else {
          dataPost = {
            name: nameFood || "",
            avatar: listImageFood[0],
            images: listImageFood.join(","),
            expirationDate: expirationDate,
            updatedBy: objAccount.id,
            categoryId: parseInt(category),
            description: description,
            content: content,
            status: 1,
          };
        }
      }
      if (!dataPost == false) {
        fetch(
          `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${infoFoodDetail.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${isToken}`,
            },
            body: JSON.stringify(dataPost),
          }
        )
          .then((response) => response.json())
          .then(function (data1) {
            fetch(
              `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users?role=ROLE_ADMIN`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${isToken}`,
                },
              }
            )
              .then((response) => response.json())
              .then((listAdmin) => {
                var listAdmin2;
                var idFood;
                var avatarFood;
                var time;
                let notifyFoodPromise = new Promise(function (myResolve) {
                  listAdmin2 = listAdmin.data;
                  idFood = data1.data.id;
                  avatarFood = data1.data.avatar;
                  var today = new Date();
                  time =
                    today.getDate() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getFullYear() +
                    " " +
                    today.getHours() +
                    ":" +
                    today.getMinutes() +
                    ":" +
                    today.getSeconds();
                  myResolve();
                });
                notifyFoodPromise.then(function () {
                  listAdmin2.map(function (admin) {
                    Notification.send(admin.id, {
                      idNotify: "",
                      usernameaccount: admin.username,
                      foodid: idFood,
                      avatar: avatarFood,
                      title:
                        "User " +
                        objAccount.name +
                        " has just updated the food information",
                      message: "Time request: " + time,
                      category: "food",
                      status: 1,
                    });
                  });
                });
              })
              .catch((error) => console.log(error));
            swal("Success!", "Successfully updated food!", "success");

            listfood();
            listFoodPost();
            listFoodPending();
            listFoodExpired();
            modal1.style.display = "none";
            var frm = document.getElementsByName("upload_new_food_form")[0];
            frm.reset();
            var image1 = document.getElementsByClassName(
              "cloudinary-thumbnails"
            );
            image1.parentNode.removeChild(image1);
          })
          .catch((error) => console.log(error));
      }
    }
  }
}

var myWidgetFood = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#editformEdit",
    folder: "hanoi_food_bank_project/uploaded_food",
    fieldName: "thumbnailsFoodEdit[]",
    thumbnails: ".thumbnailsFoodEdit",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageFood.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnailsFoodEdit[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("upload_image_foodEdit").addEventListener(
  "click",
  function () {
    myWidgetFood.open();
  },
  false
);

$("body").on("click", ".cloudinary-delete-edit", function () {
  var splittedImg = $(this).parent().find("img").attr("src").split("/");
  var imgName =
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];
  var publicId = $(this).parent().attr("data-cloudinary");
  $(this).parent().remove();
  var imgName2 =
    splittedImg[splittedImg.length - 4] +
    "/" +
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];

  for (let i = 0; i < listImageFood.length; i++) {
    if (listImageFood[i] == imgName2) {
      listImageFood.splice(i, 1);
    }
  }
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

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

function formatCategoryStringToInt(category) {
  var text;
  switch (category) {
    case "Drinks":
      text = 1;
      break;
    case "Noodle":
      text = 2;
      break;
    case "Bread":
      text = 3;
      break;
    case "Rice":
      text = 4;
      break;
    case "Meat":
      text = 5;
      break;
    case "Seafood":
      text = 6;
      break;
    case "Vegetables":
      text = 7;
      break;
    case "Vegetarian Food":
      text = 8;
      break;
    case "Fruit":
      text = 9;
      break;
    case "Fast Food":
      text = 10;
      break;
    case "Snacks":
      text = 11;
      break;
    case "Others":
      text = 12;
      break;
  }
  return text;
}

// display donate modal on click delete button
var modalCancel = document.querySelector(".modal-account-confirm-delete");
var modalFinish = document.querySelector(".modal-account-confirm-finish");
var modalFeedback = document.querySelector(".modal-account-confirm-feedback");
function confirmDeleteFood(id) {
  modalCancel.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", "deleteFood(" + id + ")");
}

// delete food
function deleteFood(id) {
  var dataPost = {
    status: 0,
  };
  fetch(`https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/status/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isToken}`,
    },
    body: JSON.stringify(dataPost),
  })
    .then((response) => response.json())
    .then((food) => {
      if (food) {
        document.getElementById("food-row-" + id).style.display = "none";
        modalCancel.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListFood(objAccount.id);
      }
    })
    .catch((error) => console.log(error));
}
// end

// pending request list pagination on account page
// start
function getListPendingRequest() {
  // console.log(userID);
  var pendingRequestListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests?userId=${accountID}&order=desc&sortBy=createdAt`;
  fetch(pendingRequestListAPI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((requestsList) => {
      if (
        requestsList &&
        requestsList.data &&
        requestsList.data.content &&
        requestsList.data.content.length > 0
      ) {
        renderListPendingRequest(requestsList.data.content);
      } else {
        var pendingRequestDataTable = document.getElementById(
          "pending-request-data-table"
        );
        pendingRequestDataTable.style.display = "none";
        document
          .getElementById("no-pending-request-noti")
          .removeAttribute("style");
        document
          .getElementById("center-pending-request-noti")
          .setAttribute("style", "text-align: center;");
      }
    })
    .catch((error) => console.log(error));
}

function renderListPendingRequest(listRequest) {
  pendingRequestsCount = 0;
  let requestContainer = $(".pending-requests-pagination");
  requestContainer.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var pendingRequestDataHtml = "<div>";
      $.each(data, function (index, e) {
        if (e.status == 1 || e.status == 2 || e.status == 3) {
          pendingRequestsCount++;
          pendingRequestDataHtml += `<tr id="request-row-${
            e.recipientId
          }" data-value="${e.foodId}"><td>${pendingRequestsCount}</td>
        <td data-toggle="tooltip" title="Show food data"><button type="button" id="showFoodInfo" class="btn btn-primary" data-toggle="modal" data-target="#foodInfoModal" data-value="${
          e.foodId
        }">${e.foodName}</button>
          </td><td id="supplier-name">${e.supplierName}</td><td>${
            e.supplierPhone
          }</td><td>${convertRequestStatus(e.status)}</td>
        <td onclick="formDetailRequest(${e.foodId}, 1)">
          <i class="fa fa-pencil-square-o"></i>
        </td>`;
          switch (e.status) {
            case 1:
              pendingRequestDataHtml +=
                `<td onclick=confirmDeleteRequest(` +
                e.foodId +
                `) class="delete_td"><i class="fa fa-trash-o"></i></td></tr>`;
              break;
            case 2:
              pendingRequestDataHtml += `
            <td>
              <button onclick="formConfirmRequest(${e.foodId})" type="button" class="btn btn-round" style="color: #fff; background-color: #5cb85c; border-color: #4cae4c;" id="confirmBtn${e.foodId}">Finish</button>
            </td>
            </tr>`;
              break;
            case 3:
              pendingRequestDataHtml += `<td>
            <button onclick="formFeedbackRequest(${e.foodId})" type="button" class="btn btn-round feedback-button" id="feedbackBtn${e.foodId}">Feedback</button>
            </td></tr>`;
              break;
          }
        }
      });
      pendingRequestDataHtml += "</div>";

      $("#list-pending-request").html(pendingRequestDataHtml);
    },
  });
}

// end

// canceled request list pagination on account page
// start
function getListCanceledRequest() {
  var canceledRequestListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests?status=4&userId=${accountID}&order=desc&sortBy=createdAt`;
  fetch(canceledRequestListAPI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((requestsList) => {
      if (
        requestsList &&
        requestsList.data &&
        requestsList.data.content &&
        requestsList.data.content.length > 0
      ) {
        renderListCanceledRequest(requestsList.data.content);
      } else {
        var canceledRequestDataTable = document.getElementById(
          "canceled-request-data-table"
        );
        canceledRequestDataTable.style.display = "none";
        document
          .getElementById("no-canceled-request-noti")
          .removeAttribute("style");
        document
          .getElementById("center-canceled-request-noti")
          .setAttribute("style", "text-align: center;");
      }
    })
    .catch((error) => console.log(error));
}

function renderListCanceledRequest(listRequest) {
  canceledRequestsCount = 0;
  let requestContainer = $(".canceled-requests-pagination");
  requestContainer.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var canceledRequestDataHtml = "<div>";
      $.each(data, function (index, e) {
        canceledRequestsCount++;
        canceledRequestDataHtml += `<tr id="request-row-${
          e.recipientId
        }" data-value="${e.foodId}"><td>${canceledRequestsCount}</td>
        <td data-toggle="tooltip" title="Show food data"><button type="button" id="showFoodInfo" class="btn btn-primary" data-toggle="modal" data-target="#foodInfoModal" data-value="${
          e.foodId
        }">${e.foodName}</button>
          </td><td id="supplier-name">${e.supplierName}</td><td>${
          e.supplierPhone
        }</td><td>${convertRequestStatus(e.status)}</td>
        <td onclick="formDetailRequest(${e.foodId}, 4)">
          <i class="fa fa-pencil-square-o"></i>
        </td>`;
      });
      canceledRequestDataHtml += "</div>";

      $("#list-canceled-request").html(canceledRequestDataHtml);
    },
  });
}
// end

// denied request list pagination on account page
// start
function getListDeniedRequest() {
  var deniedRequestListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests?status=5&userId=${accountID}&order=desc&sortBy=createdAt`;
  fetch(deniedRequestListAPI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((requestsList) => {
      if (
        requestsList &&
        requestsList.data &&
        requestsList.data.content &&
        requestsList.data.content.length > 0
      ) {
        renderListDeniedRequest(requestsList.data.content);
      } else {
        var deniedRequestDataTable = document.getElementById(
          "denied-request-data-table"
        );
        deniedRequestDataTable.style.display = "none";
        document
          .getElementById("no-denied-request-noti")
          .removeAttribute("style");
        document
          .getElementById("center-denied-request-noti")
          .setAttribute("style", "text-align: center;");
      }
    })
    .catch((error) => console.log(error));
}

function renderListDeniedRequest(listRequest) {
  deniedRequestsCount = 0;
  let requestContainer = $(".denied-requests-pagination");
  requestContainer.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var deniedRequestDataHtml = "<div>";
      $.each(data, function (index, e) {
        deniedRequestsCount++;
        deniedRequestDataHtml += `<tr id="request-row-${
          e.recipientId
        }" data-value="${e.foodId}"><td>${deniedRequestsCount}</td>
        <td data-toggle="tooltip" title="Show food data"><button type="button" id="showFoodInfo" class="btn btn-primary" data-toggle="modal" data-target="#foodInfoModal" data-value="${
          e.foodId
        }">${e.foodName}</button>
          </td><td id="supplier-name">${e.supplierName}</td><td>${
          e.supplierPhone
        }</td><td>${convertRequestStatus(e.status)}</td>
        <td onclick="formDetailRequest(${e.foodId}, 5)">
          <i class="fa fa-pencil-square-o"></i>
        </td>`;
      });
      deniedRequestDataHtml += "</div>";

      $("#list-denied-request").html(deniedRequestDataHtml);
    },
  });
}

// end

// display delete modal on click delete button
function confirmDeleteRequest(foodId) {
  modalCancel.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", `cancelRequest(` + foodId + `)`);
}

// delete food
function cancelRequest(foodId) {
  var dataPost = {
    status: 0,
    updatedBy: objAccount.id,
  };
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/
      ${foodId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isToken}`,
      },
      body: JSON.stringify(dataPost),
    }
  )
    .then((response) => response.json())
    .then((request) => {
      if (request) {
        document.getElementById("request-row-" + objAccount.id).style.display =
          "none";
        modalCancel.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListPendingRequest(objAccount.id);
      }
    })
    .catch((error) => console.log(error));
}
// end

// hoangtl2 - 01/10/2021 - close Modal by clicking "close" button
// start
function cancelModal() {
  modalCancel.style.display = "none";
  modalFinish.style.display = "none";
  modalFeedback.style.display = "none";
}

$(document).keyup(function (e) {
  if (e.key === "Escape") {
    cancelModal();
  }
});

// close Modal by clicking "esc" button
$(document).keydown(function (event) {
  if (event.keyCode == 27) {
    modalCancel.style.display = "none";
    event.preventDefault();
  }
});

// confirm request
var foodID;
function formConfirmRequest(id) {
  modalFinish.style.display = "flex";
  foodID = id;
}

function finishRequest() {
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/${objAccount.id}/${foodID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isToken}`,
      },
      body: JSON.stringify({
        status: 3,
        updatedBy: objAccount.id,
      }),
    }
  )
    .then((response) => response.json())
    .then(function (request) {
      if (request.status == 200) {
        modalFinish.style.display = "none";
        var confirm_btn = document.getElementById(`confirmBtn${foodID}`);
        confirm_btn.innerText = "Feedback";
        confirm_btn.setAttribute("onClick", `formFeedbackRequest(${foodID})`);
        confirm_btn.setAttribute("id", `feedbackBtn${foodID}`);
        // document
        //   .getElementsByClassName("request_tab")[0]
        //   .children[0].lastElementChild.remove();
        // document.getElementsByClassName(
        //   "request_tab"
        // )[0].children[0].lastElementChild.innerHTML = "Feedback";
        // document.getElementsByClassName("delete_td")[0].remove();
        swal("Success!", "Now you can leave feedback", "success");
      }
    })
    .catch((error) => console.log(error));
}

var foodId;
function formFeedbackRequest(id) {
  modalFeedback.style.display = "flex";
  foodId = id;
}

function sentFeedback(img, ct, cb, r, t, ui) {
  fetch(`https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isToken}`,
    },
    body: JSON.stringify({
      image: img,
      content: ct,
      createdBy: cb,
      rate: r,
      type: t,
      userId: ui,
    }),
  })
    .then((response) => response.json())
    .then(function (dataReturn) {
      let notifyFeedbackPromise = new Promise(function (myResolve) {
        var today = new Date();
        time =
          today.getDate() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getFullYear() +
          " " +
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        myResolve();
      });
      notifyFeedbackPromise.then(function () {
        Notification.send(dataReturn.data.userId, {
          idNotify: "",
          usernameaccount: dataReturn.data.username,
          foodid: foodId,
          avatar: dataReturn.data.avatar,
          title: "User " + objAccount.name + " send feedback for you",
          message: "Time request: " + time,
          category: "food",
          status: 1,
        });
      });
    })
    .catch((error) => console.log(error));
}

var listImageFeedback = [];

var idSupplierUser;
function feedbackRequest() {
  var rate = $("input[type='radio'][name='rating']:checked").val();
  var content = document.getElementById("contentFeedback").value;

  if (!(rate == undefined) && !(content == null)) {
    if (listImageFeedback.length == 0) {
      swal("Warning!", "You need more image!", "warning");
    } else if (listImageFeedback.length > 3) {
      swal("Warning!", "You should only add a maximum of 3 images!", "warning");
    } else {
      let sentFB = new Promise(function (myResolve) {
        fetch(
          `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${foodId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${isToken}`,
            },
          }
        )
          .then((response) => response.json())
          .then((request) => {
            jQuery.each(
              $(".thumbnailsFoodFeedback .cloudinary-thumbnails")
                .children("li")
                .map(function () {
                  return $(this).attr("data-cloudinary");
                })
                .get(),
              function (i, val) {
                listImageFeedback.push(JSON.parse(val).path);
              }
            );
            let img = listImageFeedback.join(",");
            let ct = content;
            let cb = objAccount.id;
            let r = rate;
            let t = 1;
            let ui = request.data.supplierId;
            sentFeedback(img, ct, cb, r, t, ui);
            var feedbackModal = document.querySelector(
              ".modal-account-confirm-feedback"
            );
            feedbackModal.style.display = "none";
            var fbBtn = document.getElementById(`feedbackBtn${foodId}`);
            fbBtn.style.backgroundColor = "lightcoral";
            fbBtn.style.borderColor = "lightcoral";
            fbBtn.style.color = "black";
            fbBtn.innerText = "All Done";
            fbBtn.disabled = true;
            swal("Success!", "Successfully sent feedback!", "success");
          })
          .catch((error) => console.log(error));
        myResolve();
      });
      sentFB
        .then(
          fetch(
            `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/${objAccount.id}/${foodID}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${isToken}`,
              },
              body: JSON.stringify({
                status: 4,
                updatedBy: objAccount.id,
              }),
            }
          )
        )
        .catch((error) => console.log(error));
    }
  } else {
    swal("Warning!", "Please rate and leave a comment!", "warning");
  }
}

var listImageFeedback;
// food
var myWidgetFoodFeedback = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#addformFeedback",
    folder: "hanoi_food_bank_project/feedbacks",
    fieldName: "thumbnailsFoodFeedback[]",
    thumbnails: ".thumbnailsFoodFeedback",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageFeedback.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnailsFoodFeedback[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("upload_image_foodFeedback").addEventListener(
  "click",
  function () {
    myWidgetFoodFeedback.open();
  },
  false
);

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
  var imgName2 =
    splittedImg[splittedImg.length - 4] +
    "/" +
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];

  for (let i = 0; i < listImageFeedback.length; i++) {
    if (listImageFeedback[i] == imgName2) {
      listImageFeedback.splice(i, 1);
    }
  }
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});
// detail request
function formDetailRequest(foodId, requestStatus) {
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${foodId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((food) => {
      if (food) {
        switch (requestStatus) {
          case 1:
            listPendingRequestCN.classList.remove("active");
            listPendingRequestID.classList.remove("active");
            detailRequestCN.classList.remove("d-none");
            detailRequestCN.classList.add("active");
            detailRequestID.classList.add("active");
            break;
          case 4:
            listCanceledRequestCN.classList.remove("active");
            listCanceledRequestID.classList.remove("active");
            detailRequestCN.classList.remove("d-none");
            detailRequestCN.classList.add("active");
            detailRequestID.classList.add("active");
            break;
          case 5:
            listDeniedRequestCN.classList.remove("active");
            listDeniedRequestID.classList.remove("active");
            detailRequestCN.classList.remove("d-none");
            detailRequestCN.classList.add("active");
            detailRequestID.classList.add("active");
            break;
        }

        bindDataDetailRequest(food.data, requestStatus);
      }
    })
    .catch((error) => console.log(error));
}

// bind data detail request
function bindDataDetailRequest(data, requestStatus) {
  document.getElementById("message").disabled = false;
  document.getElementById(
    "image_food_detail_request"
  ).src = `${cloudinary_url}${data.foodDTO.avatar}`;
  document.getElementById("food-title").innerHTML = data.foodDTO.name;
  document.getElementById("message").innerHTML = data.message;
  document.getElementById("request-status").innerHTML = convertRequestStatus(
    data.status
  );
  document
    .getElementsByClassName("row-btn")
    .item(0).innerHTML = `<div class="col-sm-12">
    <input id="old-message" style="display:none" value="${data.message}"/>
    <button type="button" class="btn btn-sm btn-block btn-warning" onclick="updateRequestMessage(${data.foodDTO.id})">
      <i class="fa fa-edit"></i> Update Message
    </button></div><div class="col-sm-12">
    <a onclick="backToRequestList(${requestStatus})" type="button" lass="btn btn-sm btn-round" style="padding: 6px 0px 0px 0px !important">
    <i class="fa fa-angle-double-left"></i> Back to list</a></div>`;

  if (requestStatus == 4 || requestStatus == 5) {
    document.getElementById("message").disabled = true;
    document
      .getElementsByClassName("row-btn")
      .item(0).innerHTML = `<div class="col-sm-12">
      <input id="old-message" style="display:none" value="${data.message}"/>
      <button type="button" class="btn btn-sm btn-block btn-warning" onclick="updateRequestMessage(${data.foodDTO.id})" disabled>
        <i class="fa fa-edit"></i> Update Message
      </button></div><div class="col-sm-12">
      <a onclick="backToRequestList(${requestStatus})" type="button" lass="btn btn-sm btn-round" style="padding: 6px 0px 0px 0px !important">
      <i class="fa fa-angle-double-left"></i> Back to list</a></div>`;
  }
}

function updateRequestMessage(foodID, supplierID) {
  var recipientMsg = document.getElementById("message").value;
  var oldMsg = document.getElementById("old-message").value;
  var supName = document.getElementById("supplier-name").innerText;
  if (recipientMsg.length != 0) {
    if (recipientMsg == oldMsg) {
      swal("Warning!", "You haven't changed the message field!", "warning");
    } else {
      var dataPost = {
        supplierId: supplierID,
        supplierName: supName,
        message: recipientMsg,
        updatedBy: objAccount.id,
        status: 1,
      };
      fetch(
        `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${foodID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isToken}`,
          },
          body: JSON.stringify(dataPost),
        }
      )
        .then((response) => response.json())
        .then(function (request) {
          var idFood;
          var avatarFood;
          var time;
          var requestData = request.data;
          let notifyRequestPromise = new Promise(function (myResolve) {
            idFood = requestData.foodId;
            avatarFood = requestData.foodDTO.avatar;
            var today = new Date();
            time =
              today.getDate() +
              "-" +
              (today.getMonth() + 1) +
              "-" +
              today.getFullYear() +
              " " +
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();
            myResolve();
          });
          notifyRequestPromise.then(function () {
            formDetailRequest(idFood);
            Notification.send(supplierID, {
              idNotify: "",
              usernameaccount: "",
              foodid: idFood,
              avatar: avatarFood,
              title:
                "User " + objAccount.name + "has just updated request message",
              message: "Time request: " + time,
              category: "request",
              status: 1,
            });
          });
          swal("Success!", "Successfully updated message!", "success");
          getListPendingRequest(objAccount.id);
        });
    }
  } else {
    swal("Warning!", "You cannot leave the message blank!", "warning");
  }
}

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

// back button
// start
function backToRequestList(requestStatus) {
  switch (requestStatus) {
    case 1:
      detailRequestCN.classList.remove("active");
      detailRequestCN.classList.add("d-none");
      detailRequestID.classList.remove("active");
      listPendingRequestCN.classList.add("active");
      listPendingRequestCN.classList.remove("d-none");
      listPendingRequestID.classList.add("active");
      break;
    case 4:
      detailRequestCN.classList.remove("active");
      detailRequestCN.classList.add("d-none");
      detailRequestID.classList.remove("active");
      listCanceledRequestCN.classList.add("active");
      listCanceledRequestCN.classList.remove("d-none");
      listCanceledRequestID.classList.add("active");
      break;
    case 5:
      detailRequestCN.classList.remove("active");
      detailRequestCN.classList.add("d-none");
      detailRequestID.classList.remove("active");
      listDeniedRequestCN.classList.add("active");
      listDeniedRequestCN.classList.remove("d-none");
      listDeniedRequestID.classList.add("active");
      break;
  }
}
// end

// confirm user request on food
// start
function clickListPendingRequest() {
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestID.classList.remove("active");
  listCanceledRequestCN.classList.remove("active");
  listCanceledRequestID.classList.remove("active");
  listDeniedRequestCN.classList.remove("active");
  listDeniedRequestID.classList.remove("active");
  getListPendingRequest();
}

function clickListActiveFood() {
  listPendingRequestCN.classList.remove("active");
  listPendingRequestID.classList.remove("active");
  listCanceledRequestCN.classList.remove("active");
  listCanceledRequestID.classList.remove("active");
  listDeniedRequestCN.classList.remove("active");
  listDeniedRequestID.classList.remove("active");
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestID.classList.remove("active");
  getFoodActive();
}

function clickListCanceledRequest() {
  listPendingRequestCN.classList.remove("active");
  listPendingRequestID.classList.remove("active");
  listActiveFoodCN.classList.remove("active");
  listActiveFoodID.classList.remove("active");
  listDeniedRequestCN.classList.remove("active");
  listDeniedRequestID.classList.remove("active");
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestID.classList.remove("active");
  getListCanceledRequest();
}

function clickListDeniedRequest() {
  listPendingRequestCN.classList.remove("active");
  listPendingRequestID.classList.remove("active");
  listActiveFoodCN.classList.remove("active");
  listActiveFoodID.classList.remove("active");
  listCanceledRequestCN.classList.remove("active");
  listCanceledRequestID.classList.remove("active");
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestID.classList.remove("active");
  getListDeniedRequest();
}
// end

// get food active
// start
function getFoodActive() {
  var foodListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?status=2&createdBy=${objAccount.id}`;
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((foodList) => {
      renderListActiveFood(foodList.data.content);
    })
    .catch((error) => console.log(error));
}

function renderListActiveFood(listFood) {
  var foodRequestCount = 0;
  let container = $(".list-active-food-pagination");
  container.pagination({
    dataSource: listFood,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      $.each(data, function (index, e) {
        foodRequestCount++;
        dataHtml += `<tr>
        <td>${foodRequestCount}</td>
        <td>${e.name}</td>
        <td>${e.expirationDate}</td>
        <td>${e.createdAt}</td>
        <td>active</td>
        <td onclick="viewUsersRequestFood(${e.id})"><i class="fa fa-search"></i></td>`;
      });

      dataHtml += "</div>";
      $("#list-active-food").html(dataHtml);
    },
  });

  // end

  var foodRequestDataTable = document.getElementById("food-active-data-table");

  if (foodRequestCount == 0) {
    foodRequestDataTable.style.display = "none";
    document.getElementById("no-food-noti").removeAttribute("style");
    document
      .getElementById("center-food-noti")
      .setAttribute("style", "text-align: center;");
  }
}

function viewUsersRequestFood(foodID) {
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests?foodId=${foodID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((requests) => {
      if (
        requests &&
        requests.data &&
        requests.data.content &&
        requests.data.content.length > 0
      ) {
        listActiveFoodCN.classList.remove("active");
        listActiveFoodID.classList.remove("active");
        listUsersRequestCN.classList.remove("d-none");
        listUsersRequestCN.classList.add("active");
        listUsersRequestID.classList.add("active");
        renderUserRequests(requests.data.content);
      } else {
        swal("Info", "No one has asked for this food yet", "info");
      }
    })
    .catch((error) => console.log(error));
}

var listCheckedValue = [];
var listUncheckedValue = [];

function renderUserRequests(listUserRequests) {
  var userRequestCount = 0;
  let container = $(".user-request-list-pagination");
  container.pagination({
    dataSource: listUserRequests,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      var buttonsHtml;
      $.each(data, function (index, e) {
        userRequestCount++;
        if (e.status == 1) {
          dataHtml += `<tr>
          <td>${userRequestCount}</td>
          <td>${e.recipientName}</td>
          <td>${e.message}</td>
          <td>${e.createdAt}</td>
          <td>${e.recipientPhone}</td>
          <td id="tdCheckbox"><input class="form-check-input" id="flexCheckChecked" type="checkbox" value="${e.recipientId}" name="${e.recipientId}"></td>`;

          buttonsHtml = `<div class="col-sm-6" style="padding-left: unset"><button
          type="button"
          onclick="backToFoodRequestList()"
          class="btn btn-b btn-round btnSubmit"
          style="float: left">Back</button></div>
          <div class="col-sm-6"><button
          type="button"
          onclick="confirmation(${e.foodId})" id="confirm-button"
          class="btn btn-success btn-round btnSubmit">Confirm</button></div>`;
        } else {
          buttonsHtml = `<div class="col-sm-6" style="padding-left: unset"><button
            type="button"
            onclick="backToFoodRequestList()"
            class="btn btn-b btn-round btnSubmit"
            style="float: left">Back</button></div>
            `;

          dataHtml += `<tr>
          <td>${userRequestCount}</td>
          <td>${e.recipientName}</td>
          <td>${e.message}</td>
          <td>${e.createdAt}</td>
          <td>${e.recipientPhone}</td>
          <td>${
            e.status == 2
              ? `<button onclick="formFeedbackRequest(${e.foodId})" type="button" class="btn btn-round feedback-button" id="feedbackBtn${e.foodId}">Feedback</button>`
              : `<input class="form-check-input" id="flexCheckChecked" type="checkbox" value=" ${e.recipientId}" name="${e.recipientId}" disabled>`
          }</td>`;

          // document.getElementById("checkAll").style.display = "none";
          if (e.status == 2) {
            document.getElementById("checkAllCell").innerText = "Feedback";
          }
        }
      });

      dataHtml += "</div>";
      $("#list-users-request").html(dataHtml);

      $("#button-on-users-request-page").html(buttonsHtml);
    },
  });
}

function checkAll(source) {
  var checkboxes = document.querySelectorAll(
    '#list-users-request input[type="checkbox"]'
  );
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
}

function confirmation(foodId) {
  document.getElementById("checkAllCell").innerText = "Feedback";

  $('#list-users-request input[type="checkbox"]:checked').each(function () {
    listCheckedValue.push($(this).val());
  });
  $('#list-users-request input[type="checkbox"]:not(:checked)').each(
    function () {
      listUncheckedValue.push($(this).val());
    }
  );

  var changeToFeedbackButton = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  for (var i = 0; i < changeToFeedbackButton.length; i++) {
    changeToFeedbackButton[i].parentElement.innerHTML = `
    <button onclick="formFeedbackRequest(${foodId})" type="button" class="btn btn-round feedback-button" id="feedbackBtn${foodId}">Feedback</button>
    `;
  }
  // document.getElementById("checkAll").disabled = "true";
  var checkboxes = document.querySelectorAll(
    '#list-users-request input[type="checkbox"]'
  );
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].disabled = true;
  }
  // document.getElementById("checkAll").disabled = true;
  document.getElementById("confirm-button").style.display = "none";

  if (listCheckedValue.length == 0) {
    swal(
      "You have not selected any recipients. \n Do you want to abort this request?",
      {
        title: "Alert!",
        icon: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
          confirm: {
            text: "Continue",
            value: true,
            visible: true,
            closeModal: true,
          },
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            closeModal: true,
          },
        },
      }
    ).then(function (isConfirm) {
      if (isConfirm) {
        denyRequest(foodId);
      }
    });
  } else {
    acceptRequest(foodId);
    denyRequest(foodId);
    swal(
      "Success!",
      "Successfully confirms. Please wait for contact from the approved recipients or contact them immediately!",
      "success"
    );
  }
}

// send feedback nguoi cho
// function finish(foodId) {
//   modalFeedback.style.display = "flex";
//   feedbackId = foodId;
// }

// update stautus for approved request and send notify to selected user
function acceptRequest(foodId) {
  var confirmDataPost = {
    status: 2,
    updatedBy: objAccount.id,
  };
  listCheckedValue.forEach((checkedValue) => {
    fetch(
      `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/${checkedValue}/
        ${foodId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isToken}`,
        },
        body: JSON.stringify(confirmDataPost),
      }
    )
      .then((response) => response.json())
      .then(function (request1) {
        var avatarFood;
        var time;
        var requestData = request1.data;
        let notifyRequestPromise = new Promise(function (myResolve) {
          avatarFood = requestData.foodDTO.avatar;
          var today = new Date();
          time =
            today.getDate() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getFullYear() +
            " " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          myResolve();
        });
        notifyRequestPromise.then(function () {
          Notification.send(checkedValue, {
            idNotify: "",
            usernameaccount: "",
            foodid: foodId,
            avatar: avatarFood,
            title: "User " + objAccount.name + " agreed to give you food",
            message: "Time request: " + time,
            category: "request",
            status: 1,
          });
        });
      })
      .catch((error) => console.log(error));
  });
}

// update stautus for unapproved request and send notify to unselected user
function denyRequest(foodId) {
  var denyDataPost = {
    status: 0,
    updatedBy: objAccount.id,
  };
  listUncheckedValue.forEach((uncheckedValue) => {
    fetch(
      `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/status/${uncheckedValue}/
        ${foodId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isToken}`,
        },
        body: JSON.stringify(denyDataPost),
      }
    )
      .then((response) => response.json())
      .then(function (request2) {
        var avatarFood;
        var time;
        var requestData = request2.data;
        let notifyRequestPromise = new Promise(function (myResolve) {
          avatarFood = requestData.foodDTO.avatar;
          var today = new Date();
          time =
            today.getDate() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getFullYear() +
            " " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          myResolve();
        });
        notifyRequestPromise.then(function () {
          Notification.send(uncheckedValue, {
            idNotify: "",
            usernameaccount: "",
            foodid: foodId,
            avatar: avatarFood,
            title: `I'm sorry I couldn't send you food this time. Try again another time!\n Dear, ${objAccount.name}!`,
            message: "Time request: " + time,
            category: "request",
            status: 1,
          });
        });
      })
      .catch((error) => console.log(error));
  });
}

function backToFoodRequestList() {
  listActiveFoodCN.classList.add("active");
  listActiveFoodID.classList.add("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestID.classList.remove("active");
}

function getTimeFromString2(strDate) {
  var arrDate = strDate.split("/");
  var year = parseInt(arrDate[2]);
  var month = parseInt(arrDate[1]) - 1;
  var date = parseInt(arrDate[0]);
  return new Date(year, month, date).getTime();
}
// end

// hoangtl0711 v3 - 07/11/2021 - feedback list
// start
var feedbackCount = 0;
function getSentFeedbackList() {
  var sentFeedbankListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?createdBy=${objAccount.id}&status=1`;
  fetch(sentFeedbankListAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((sentFeedbackList) => {
      renderFeedback(sentFeedbackList.data.content);
    })
    .catch((error) => console.log(error));
}

function getReceivedFeedbackList() {
  var receivedFeedbankListAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?userId=${objAccount.id}&status=1`;
  fetch(receivedFeedbankListAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((receivedFeedbackList) => {
      document.getElementById("changeFinal").innerText = "Feedback From";
      renderFeedback(receivedFeedbackList.data.content);
    })
    .catch((error) => console.log(error));
}

function renderFeedback(listFeedback) {
  let container = $(".feedback-pagination");
  container.pagination({
    dataSource: listFeedback,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      $.each(data, function (index, e) {
        var food_image = `https://res.cloudinary.com/vernom/image/upload/${e.image}`;
        feedbackCount++;
        dataHtml += `<tr>
          <td>${feedbackCount}</td>
          <td><img style="max-width: 20% !important" src=${food_image}></td>
          <td>${objAccount.id == e.createdBy ? e.name : e.sentName}</td>
          <td>${e.content}</td>
          <td>${e.rate}</td>
          <td>${e.createdAt}</td>
        </tr>`;
      });

      dataHtml += "</div>";
      $("#list-feedback").html(dataHtml);
      feedbackCount = 0;
    },
  });

  var foodDataTable = document.getElementById("food-data-table");

  if (foodCount == 0) {
    foodDataTable.style.display = "none";
    document.getElementById("no-food-noti").removeAttribute("style");
    document
      .getElementById("center-food-noti")
      .setAttribute("style", "text-align: center;");
  } else {
    foodDataTable.style.display = "block";
    document.getElementById("no-food-noti").style.display = "none";
  }
}

$("#foodInfoModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var foodId = button.data("value");
  getFoodDetail(foodId);
});

function getFoodDetail(foodId) {
  var getDetailFood = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${foodId}`;
  fetch(getDetailFood, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((foodInfo) => {
      foodDetail = foodInfo.data;
      renderFoodInfo(foodDetail);
    })
    .catch((error) => console.log(error));
}

function renderFoodInfo(data) {
  // console.log(data);
  var baseUrl = "https://res.cloudinary.com/vernom/image/upload/";
  let imagesList = data.images;
  const images = imagesList.split(",");
  if (images[images.length - 1] == "") {
    images.pop();
  }
  let numberOfImage = images.length;
  var addImage = "";
  for (let i = 1; i < images.length; i++) {
    if (images[i] != "") {
      addImage += `
      <div class="mySlides food-fade">
        <div class="numbertext">${i + 1} / ${numberOfImage}</div>
        <img
          src="${baseUrl + images[i]}"
          style="width: 100%"
        />
      </div>
      `;
    }
  }

  $(".slideshow-container").html(
    `<!-- Full-width images with number and caption text -->
      <div class="mySlides food-fade" style="display: block">
        <div class="numbertext">1 / ${numberOfImage}</div>
        <img
          src="${baseUrl + data.avatar}"
          style="width: 100%"
        />
      </div>` +
      addImage +
      `
      <!-- Next and previous buttons -->
      <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
      <a class="next" onclick="plusSlides(1)">&#10095;</a>`
  );

  $(".food-name").html(data.name);
  $(".food-category").html(data.category);
  $(".food-uploaded-date").html(data.createdAt);
  $(".food-exp-date").html(data.expirationDate);
  $(".food-description").html(data.description);
  $(".food-quantity").html(data.quantity);
  $(".supplier-name").html(data.supplierName);
  $(".supplier-email").html(data.supplierEmail);
}

let slideIndex = 1;
const showSlides = (n) => {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
};

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

// end

$("[data-dismiss=modal]").on("click", function (e) {
  var $t = $(this),
    target = $t[0].href || $t.data("target") || $t.parents(".modal") || [];

  $(target)
    .find("img")
    .attr("src", "")
    .end()
    .find(
      ".numbertext, .food-name, .food-category, .food-uploaded-date, .food-quantity, .supplier-name, .supplier-email, .food-exp-date"
    )
    .contents()
    .remove()
    .end();
});
