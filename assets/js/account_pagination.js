// hoangtl2 - 01/11/2021 - get data user
// start
var detailRequestID = document.getElementById("detailRequest");
var detailRequestCN = document.getElementsByClassName("detailRequest")[0];
var listUsersRequestID = document.getElementById("listUsersRequest");
var listUsersRequestCN = document.getElementsByClassName("listUsersRequest")[0];
var listRequestID = document.getElementById("listRequest");
var listRequestCN = document.getElementsByClassName("listRequest")[0];
var detailRequestID = document.getElementById("detailRequest");
var detailRequestCN = document.getElementsByClassName("detailRequest")[0];
var listActiveFoodID = document.getElementById("listActiveFood");
var listActiveFoodCN = document.getElementsByClassName("listActiveFood")[0];

var foodCount = 0;
var requestCount = 0;

var objAccount = null;

var cloudinary_url =
  "https://res.cloudinary.com/vernom/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/";

function initPageAccount() {
  getAccount();
  expirationDateRequest();
}
initPageAccount();

function getAccount() {
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${currentName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((account) => {
      if (account && account.data) {
        objAccount = account.data;
        getListFoodAll();
        getListRequest(objAccount.id);
        // console.log(objAccount.id);
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
    "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
  document.querySelector("#avatar_account").parentElement.href =
    data.avatar ||
    "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
}

function expirationDateRequest() {
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests`, {
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
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/status/${request.recipientId}/${request.foodId}`,
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
      `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${objAccount.id}`,
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
          console.log(currentName);
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
function changepassword() {
  var newPassword = document.querySelector("#newPassword").value;
  var confirmNewPassword = document.querySelector("#confirmNewPassword").value;
  var changepasswordAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/change-password/${objAccount.id}`;
  if (newPassword) {
    if (newPassword != confirmNewPassword) {
      swal("Warning!", "Password re-entered is incorrect!", "warning");
    } else {
      fetch(changepasswordAPI, {
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
  var foodListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?&createdBy=${objAccount.id}`;
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
            var urlUpdateStatus = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/status/${food.id}`;
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
  var foodListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=2&createdBy=${objAccount.id}`;
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
  var foodListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=1&createdBy=${objAccount.id}`;
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
  var foodListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=0&createdBy=${objAccount.id}`;
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
  let container = $(".pagination1");
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
          dataHtml += `<td><a href="./shop_single_product.html?id=${
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

  var getDetailFood = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${id}`;
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
          `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${infoFoodDetail.id}`,
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
              `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users?role=ROLE_ADMIN`,
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
var modal3 = document.querySelector(".modal-account-confirm-delete");
var modalfinish = document.querySelector(".modal-account-confirm-finish");
var modalfeedback = document.querySelector(".modal-account-confirm-feedback");
function confirmDeleteFood(id) {
  modal3.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", "deleteFood(" + id + ")");
}

// delete food
function deleteFood(id) {
  var dataPost = {
    status: 0,
  };
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/status/${id}`, {
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
        modal3.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListFood(objAccount.id);
      }
    })
    .catch((error) => console.log(error));
}
// end

// hoangtl2 - 01/11/2021 - request list pagination on account page
// start
function getListRequest(userID) {
  // console.log(userID);
  var requestListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?userId=${userID}&order=desc&sortBy=createdAt`;
  // console.log(requestListAPI);
  fetch(requestListAPI, {
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
        renderListRequest(requestsList.data.content);
      }
    })
    .catch((error) => console.log(error));
}

function renderListRequest(listRequest) {
  let requestContainer = $(".pagination2");
  requestContainer.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml1 = "<div>";
      $.each(data, function (index, e) {
        // do sdt cua nguoi dang do
        // var supplierPhone = e.supplier
        requestCount++;
        dataHtml1 += `<tr id="request-row-${
          e.recipientId
        }"><td>${requestCount}</td><td>${e.foodName}
          </td><td id="supplier-name">${e.supplierName}</td><td>${
          e.supplierPhone
        }</td><td>${convertRequestStatus(e.status)}</td>`;
        if (e.status == 2) {
          dataHtml1 += `<td>
              <button onclick="formConfirmRequest(${e.foodId})" type="button" class="btn btn-round" style="color: #fff; background-color: #5cb85c; border-color: #4cae4c;">Finish</button>
            </td>`;
        } else if (e.status == 3) {
          dataHtml1 += `<td>
            <button onclick="formFeedbackRequest(${e.foodId})" type="button" class="btn btn-round" style="color: #fff; background-color: #5cb85c; border-color: #4cae4c;padding: 8px 26px;">Feedback</button>
            </td>`;
        } else {
          dataHtml1 += `<td onclick="formDetailRequest(${e.foodId})"><i class="fa fa-pencil-square-o"></i></td>`;
        }

        dataHtml1 +=
          `<td onclick=confirmDeleteRequest(` +
          e.foodId +
          `)><i class="fa fa-trash-o"></i></td></tr>`;
      });
      dataHtml1 += "</div>";

      $("#list-request").html(dataHtml1);
    },
  });

  var requestDataTable = document.getElementById("request-data-table");

  if (requestCount == 0) {
    requestDataTable.style.display = "none";
    document.getElementById("no-request-noti").removeAttribute("style");
    document
      .getElementById("center-request-noti")
      .setAttribute("style", "text-align: center;");
  }
}

// display delete modal on click delete button
function confirmDeleteRequest(foodId) {
  modal3.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", `deleteRequest(` + foodId + `)`);
}

// delete food
function deleteRequest(foodId) {
  var dataPost = {
    status: 0,
    updatedBy: objAccount.id,
  };
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/
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
        modal3.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListRequest(objAccount.id);
      }
    })
    .catch((error) => console.log(error));
}
// end

// hoangtl2 - 01/10/2021 - close Modal by clicking "close" button
// start
function cancelModal() {
  modal3.style.display = "none";
  modalfinish.style.display = "none";
  modalfeedback.style.display = "none";
}

// close Modal by clicking "esc" button
$(document).keydown(function (event) {
  if (event.keyCode == 27) {
    modal3.style.display = "none";
    event.preventDefault();
  }
});

// confirm request
var finishId;
function formConfirmRequest(id) {
  modalfinish.style.display = "flex";
  finishId = id;
}

function finishRequest() {
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/status/${objAccount.id}/${finishId}`,
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
        console.log("ok");
        modalfinish.style.display = "none";
        swal("Success!", "You haven't changed the message field!", "success");
      }
    })
    .catch((error) => console.log(error));
}

var feedbackId;
function formFeedbackRequest(id) {
  modalfeedback.style.display = "flex";
  feedbackId = id;
}

var listImageFeedback = [];
var idSupplierUser;
function feedbackRequest() {
  var rateFeedback = document.getElementById("rateFeedback").value;
  var contentFeedback = document.getElementById("contentFeedback").value;

  if (!rateFeedback == false && !contentFeedback == false) {
    if (listImageFeedback.length == 0) {
      swal("Warning!", "You need more image!", "warning");
    } else if (listImageFeedback.length > 3) {
      swal("Warning!", "You should only add a maximum of 3 images!", "warning");
    } else {
      let notifyFeedbackPromise = new Promise(function (myResolve) {
        fetch(
          `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${feedbackId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${isToken}`,
            },
          }
        )
          .then((response) => response.json())
          .then((request) => {
            idSupplierUser = request.data.supplierId;
            console.log(request.data);
          })
          .catch((error) => console.log(error));
        if (rateFeedback < 1) {
          rateFeedback = 1;
        }
        if (rateFeedback > 10) {
          rateFeedback = 10;
        }
        myResolve();
      });
      notifyFeedbackPromise.then(function () {
        var dataPost = {
          image: listImageFeedback.join(","),
          content: contentFeedback,
          createdBy: objAccount.id,
          rate: rateFeedback,
          type: 1,
          userId: idSupplierUser,
        };
        fetch("https://hfb-t1098e.herokuapp.com/api/v1/hfb/feedbacks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isToken}`,
          },
          body: JSON.stringify(dataPost),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
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
            Notification.send(data.data.userId, {
              idNotify: "",
              usernameaccount: data.data.username,
              foodid: feedbackId,
              avatar: data.data.avatar,
              title: "User " + objAccount.name + " send feedback for you",
              message: "Time request: " + time,
              category: "food",
              status: 1,
            });
          })
          .catch((error) => console.log(error));
        modalfeedback.style.display = "none";
        swal("Success!", "Send Feedback success!", "success");
        listImageFeedback = [];
        var frm = document.getElementsByName("upload_new_food_form")[0];
        frm.reset();
      });
    }
  } else {
    swal("Warning!", "Please describe something!", "warning");
  }
}

var listImageFeedback;
// food
var myWidgetFoodFeedback = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#addformFeedback",
    folder: "hanoi_food_bank_project/uploaded_food",
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
function formDetailRequest(id) {
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${id}`,
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
        document
          .getElementsByClassName("listRequest")[0]
          .classList.remove("active");
        document.getElementById("listRequest").classList.remove("active");
        document
          .getElementsByClassName("detailRequest")[0]
          .classList.add("active");
        document.getElementById("detailRequest").classList.add("active");
        document
          .getElementsByClassName("detailRequest")[0]
          .classList.remove("d-none");
        bindDataDetailRequest(food.data);
      }
    })
    .catch((error) => console.log(error));
}

// bind data detail request
function bindDataDetailRequest(data) {
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
    <a onclick="backToRequestList()" type="button" lass="btn btn-sm btn-round" style="padding: 6px 0px 0px 0px !important">
    <i class="fa fa-angle-double-left"></i> Back to list</a></div>`;
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
        `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${foodID}`,
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
          getListRequest(objAccount.id);
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
      status = "Cancel";
      break;
  }
  return status;
}

// back button
function backToRequestList() {
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listRequestCN.classList.add("active");
  listRequestCN.classList.remove("d-none");
  listRequestID.classList.add("active");
}
// end

// hoangtl2 - 03/11/2021 - confirm user request on food
// start
function clickListRequest() {
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestID.classList.remove("active");
  getFoodActive();
}

function clickListActiveFood() {
  listRequestCN.classList.remove("active");
  listRequestID.classList.remove("active");
  detailRequestCN.classList.remove("active");
  detailRequestCN.classList.add("d-none");
  detailRequestID.classList.remove("active");
  listUsersRequestCN.classList.remove("active");
  listUsersRequestCN.classList.add("d-none");
  listUsersRequestID.classList.remove("active");
  getFoodActive();
}

function getFoodActive() {
  var foodListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=2&createdBy=${objAccount.id}`;
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
  let container = $(".pagination3");
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
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?foodId=${foodID}`,
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
  let container = $(".pagination4");
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
              ? `<button
            type="button"
            onclick="finish(${e.foodId})" id="finish-button"
            class="btn btn-success btn-round">Feedback</button>`
              : `<input class="form-check-input" id="flexCheckChecked" type="checkbox" value=" ${e.recipientId}" name="${e.recipientId}" disabled>`
          }</td>`;

          // document.getElementById("checkAll").style.display = "none";
          document.getElementById("checkAllCell").innerText = "Feedback";
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
    console.log(changeToFeedbackButton[i]);
    changeToFeedbackButton[i].parentElement.innerHTML = `<button
    type="button"
    onclick="finish(${foodId})" id="finish-button"
    class="btn btn-success btn-round">Feedback</button>`;
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
function finish(foodId) {
  modalfeedback.style.display = "flex";
  feedbackId = foodId;
}

// update stautus for approved request and send notify to selected user
function acceptRequest(foodId) {
  var confirmDataPost = {
    status: 2,
    updatedBy: objAccount.id,
  };
  listCheckedValue.forEach((checkedValue) => {
    fetch(
      `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/status/${checkedValue}/
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
      `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/status/${uncheckedValue}/
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
  var sentFeedbankListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/feedbacks/search?createdBy=${objAccount.id}&status=1`;
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
  var receivedFeedbankListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/feedbacks/search?userId=${objAccount.id}&status=1`;
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
  let container = $(".paginationFeedback");
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
// end
