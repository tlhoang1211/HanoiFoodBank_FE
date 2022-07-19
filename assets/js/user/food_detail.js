// slides image
function showSlides(n) {
  var slides = document.getElementsByClassName("slider-info-food");
  var dots = document.getElementsByClassName("demo-slides-img-food");
  if (n > slides.length) {
    n = 1;
  }
  if (n < 1) {
    n = slides.length;
  }
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (var i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active-info-food", "");
  }
  slides[n - 1].style.display = "block";
  dots[n - 1].className += " active-info-food";
}

function getSupplierInfo(supplierEmail) {
  if (!isToken) {
    isToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwaHVvbmdsdmQwMDYzMUBmcHQuZWR1LnZuIiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpc3MiOiJodHRwczovL2hmYi10MTA5OGUuaGVyb2t1YXBwLmNvbS9hcGkvdjEvaGZiL2xvZ2luIiwiZXhwIjoxNjM2NTU4MzQyfQ.GWSbBk2gvGqsvgq8s-3c7P-bmO0PeFKgjsLczox5L6M";
  }
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/${supplierEmail}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((account) => {
      if (account && account.data) {
        supplierAccount = account.data;
        if (
          isToken ==
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwaHVvbmdsdmQwMDYzMUBmcHQuZWR1LnZuIiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpc3MiOiJodHRwczovL2hmYi10MTA5OGUuaGVyb2t1YXBwLmNvbS9hcGkvdjEvaGZiL2xvZ2luIiwiZXhwIjoxNjM2NTU4MzQyfQ.GWSbBk2gvGqsvgq8s-3c7P-bmO0PeFKgjsLczox5L6M"
        ) {
          token = "";
        }
        bindDataAccount(supplierAccount);
      }
    })
    .catch((error) => console.log(error));
}

function bindDataAccount(data) {
  getAverageRating(data.id);
  var avatar_url = `https://res.cloudinary.com/vernom/image/upload/${data.avatar}`;
  if (!data.avatar & (data.avatar == null)) {
    document
      .querySelector("#supplier-avatar")
      .setAttribute(
        "src",
        "https://res.cloudinary.com/vernom/image/upload/v1635678562/hanoi_food_bank_project/users_avatar/null_avatar.jpg"
      );
  } else {
    document.querySelector("#supplier-avatar").setAttribute("src", avatar_url);
  }

  document.getElementById("supplier-name").innerHTML = data.name;
  document.getElementById("supplier-email").innerHTML = data.email;
  document.getElementById("supplier-phone").innerHTML =
    data.phone.slice(0, 6) + "***";
  document.getElementById("supplier-address").innerHTML = data.address;
}

$(document).ready(function () {
  Notification.config();
});
// lay id theo url
let params = new URL(document.URL).searchParams;
var id = params.get("id");
if (id == null) {
  location.replace("../food");
}

var getDetailFood = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${id}`;
var shopItem = document.querySelector(".view-image-product");
var viewInfoProduct = document.querySelector(".view-info-product");
var listFoodCategory;

// get token
var pairs = document.cookie.split(";");
var cookies = {};
for (var i = 0; i < pairs.length; i++) {
  var pair = pairs[i].split("=");
  cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
}
var token = cookies.token;
var usernameAccount = cookies.username;

var itemFoodInfo;
// Get InfoFood
function getInfoFood() {
  fetch(getDetailFood, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((listItems) => {
      getSupplierInfo(listItems.data.supplierEmail);

      let myPromiseInfoFood = new Promise(function (myResolve) {
        listFoodCategory = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/search?categoryId=${listItems.data.categoryId}&page=0&limit=4&status=2`;
        var listItemImages = listItems.data.images;
        if (listItemImages.slice(-1) == ",") {
          listItemImages = listItemImages.slice(0, -1);
        }
        listItemImages = listItemImages.split(",");
        var htmlsItem = `
      <div class="row multi-columns-row" >
            <div class="slider-image">`;
        listItemImages.map(function (image) {
          htmlsItem += `
          <div class="slider-info-food">
            <img src="https://res.cloudinary.com/vernom/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/${image}" style="width:100%; max-height: 450px">
          </div>`;
        });

        htmlsItem += `
              <div>`;
        for (let i = 0; i < listItemImages.length; i++) {
          htmlsItem += `
          <div class="column-img-info-food">
            <img class="demo-slides-img-food cursor-img-info-food" src="https://res.cloudinary.com/vernom/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/${
              listItemImages[i]
            }" style="width:100%" onclick="showSlides(${
            i + 1
          })" alt="The Image ${i + 1}">
          </div>
        `;
        }
        htmlsItem += `
          </div>
        </div>
      </div>
      `;

        var htmlsInfoProduct = `
          <div class="row">
            <div class="col-sm-12">
              <h1 class="product-title font-alt">${listItems.data.name}</h1>
              <p class="product_meta">Categories: <span style="font-weight: bolder">${listItems.data.category}<span></p>
            </div>
          </div>
          <div class="col-sm-12">
            <div class="food-card">
              <p class="label1">Expiration Date: <span class="expiration-date">${listItems.data.expirationDate}</span></p>
              <p class="label2">Time Remaining: <span class="time-countdown" id="timeCountdown"></span></p>
              <p class="label3">Content: <span class="food-content">${listItems.data.content}</span></p>
              <p class="label4">Description: <span class="food-description">${listItems.data.description}</span> </p>
            </div>
          </div>
          <div class="row mb-20">
            <div class="col-sm-12"><button class="btn btn-lg btn-block btn-round btn-b" type="button" id="requestForFood" onclick="requestForFood()">Ask for food</button></div>
          </div>`;

        shopItem.innerHTML = htmlsItem;
        viewInfoProduct.innerHTML = htmlsInfoProduct;
        var expiration = getTimeFromString2(listItems.data.expirationDate);
        var now1 = new Date().getTime();
        var timeRest1 = expiration - now1;
        if (timeRest1 <= 0) {
          document.querySelector("#requestForFood").disabled = true;
          document.querySelector("#requestForFood").innerText = "Expired food";
        }
        showSlides(1);

        fetch(`https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((itemFood) => {
            itemFoodInfo = itemFood.data;

            if (itemFood.data.createdBy == idAccount) {
              document.querySelector("#requestForFood").disabled = true;
              document.querySelector("#requestForFood").innerText = "Your Food";

              document.querySelector("#timeCountdown").innerHTML =
                "Expired food";
              document.querySelector("#timeCountdown").style.color = "#000";
              document.querySelector("#timeCountdown").style.fontWeight =
                "bolder";
              document.querySelector("#timeCountdown").style.fontSize = "16px";
            }
          })
          .catch((error) => console.log(error));

        myResolve();
      });

      myPromiseInfoFood.then(function () {
        var p = document.querySelector(`#timeCountdown`);
        var tet = getTimeFromString2(listItems.data.expirationDate);
        var now1 = new Date().getTime();
        var timeRest1 = tet - now1;
        if (timeRest1 > 0) {
          run();
          var countDown = setInterval(run, 1000);
          // Tổng số giây
          function run() {
            var now = new Date().getTime();
            //Số s đến thời gian hiện tại
            var timeRest = tet - now;
            //Số s còn lại để đến tết;
            var day = Math.floor(timeRest / (1000 * 60 * 60 * 24));
            //Số ngày còn lại
            var hours = Math.floor(
              (timeRest % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            // Số giờ còn lại
            var minute = Math.floor(
              (timeRest % (1000 * 60 * 60)) / (1000 * 60)
            );
            // Số phút còn lại
            var sec = Math.floor((timeRest % (1000 * 60)) / 1000);
            // Số giây còn lại
            if (timeRest <= 0) {
              clearInterval(countDown);
              p.innerHTML = "Expired food";
              p.style.color = "#000";
              p.style.fontWeight = "900";
              p.style.fontSize = "16px";
              document.getElementById("requestForFood").disabled = true;
            }
            p.innerHTML =
              day + " DAYS " + hours + " : " + minute + " : " + sec + "  ";
          }

          listRelatedProducts();
        } else {
          p.innerHTML = "Expired food";
          p.style.color = "#000";
          p.style.fontWeight = "900";
          p.style.fontSize = "16px";
          document.getElementById("requestForFood").disabled = true;
          document.getElementById("requestForFood").innerText = "Expired food";
        }
      });
    })
    .catch((error) => console.log(error));
}
getInfoFood();

// tai day
function listRelatedProducts() {
  var relatedProducts = document.querySelector(".related-products");
  fetch(listFoodCategory)
    .then((response) => response.json())
    .then((listFood) => {
      let myPromise = new Promise(function (myResolve) {
        // console.log(listFood.data.content);
        var htmlsItem = listFood.data.content.map(function (item) {
          return `
                <div class="col-sm-6 col-md-3 col-lg-3" style="min-height: 350px" id="shop-item-${item.id}">
                  <div class="shop-item">
                    <div class="shop-item-image">
                      <img class="img-food" src="https://res.cloudinary.com/vernom/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/${item.avatar}" class="img-food" alt="Cold Garb"/>
                      <div class="shop-item-detail">
                        <a class="btn btn-round btn-b" href="./food_detail?id=${item.id}">
                          <i class="fa fa-eye"></i> View Details
                        </a>
                      </div>
                    </div>
                    <h4 class="shop-item-title font-alt"><a href="#">${item.name}</a></h4>
                    <p>Expiration Date: ${item.expirationDate}</p>
                  </div>
                </div>
                `;
        });
        relatedProducts.innerHTML = htmlsItem.join("");
        myResolve(); // when successful
      });
      myPromise.then(function () {
        listFood.data.content.map(function (item2) {
          var tet = getTimeFromString2(item2.expirationDate);
          run();

          // Tổng số giây
          var countDown = setInterval(run, 1000);
          function run() {
            var now = new Date().getTime();
            var timeRest = tet - now;
            if (timeRest <= 0) {
              clearInterval(countDown);
              document.querySelector(`#shop-item-${item2.id}`).style.display =
                "none";

              var urlUpdateStatus = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/foods/status/${item2.id}`;
              fetch(urlUpdateStatus, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  status: 0,
                  updatedBy: 1,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  listRelatedProducts();
                })
                .catch((error) => console.log(error));
            }
          }
        });
      });
    })
    .catch((error) => console.log(error));
}

// Add To Cart
var idUserFood;
var modalsinglefood = document.querySelector(".modal-single-food");
function requestForFood() {
  var cookie = document.cookie;
  if (
    cookie === null ||
    cookie === undefined ||
    cookie === NaN ||
    cookie === "" ||
    cookie === []
  ) {
    location.replace("../login_register.html");
  } else {
    idUserFood = itemFoodInfo.createdBy;
    avatarFood = itemFoodInfo.avatar;
    var getRequestById = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests/${idAccount}/${id}`;
    fetch(getRequestById, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((itemRequest) => {
        if (itemRequest.status == 200) {
          modalsinglefood.style.display = "none";
          swal(
            "Error!",
            "You have applied, please wait for the giver to confirm",
            "error"
          );
        } else {
          modalsinglefood.style.display = "flex";
        }
      })
      .catch((error) => console.log(error));
  }
}

// Close Modal Message
function closeSendMail() {
  modalsinglefood.style.display = "none";
}

var avatarFood;
// Send Request
function sendRequest() {
  // get Id User
  var idAccount;
  var getUserByUsername = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/${usernameAccount}`;
  fetch(getUserByUsername, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((account) => {
      idAccount = account.data.id;
      postRequest();
    })
    .catch((error) => console.log(error));
}

var postRequestAPI = `https://hanoifoodbank.herokuapp.com/api/v1/hfb/requests`;
function postRequest() {
  var message = document.querySelector("#messageModal").value;
  if (message == "" || message == null || message == undefined) {
    swal("Warning!", "Please say something to the giver!", "warning");
  } else {
    fetch(postRequestAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: idAccount,
        foodId: id,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
        swal("Success!", "Successful request for food!", "success");
        modalsinglefood.style.display = "none";

        Notification.send(idUserFood, {
          idNotify: "",
          usernameaccount: usernameAccount,
          foodid: id,
          avatar: avatarFood,
          title: "Someone is asking you about food",
          message: "Time request: " + time,
          category: "request",
          status: 1,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

// Chuyen time tu string sang long
function getTimeFromString2(strDate) {
  var arrDate = strDate.split("/");
  var year = parseInt(arrDate[2]);
  var month = parseInt(arrDate[1]) - 1;
  var date = parseInt(arrDate[0]);
  return new Date(year, month, date).getTime();
}

function getAverageRating(supplierId) {
  fetch(
    `https://hanoifoodbank.herokuapp.com/api/v1/hfb/feedbacks/search?userId=${supplierId}&status=1`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isToken}`,
      },
    }
  )
    .then((data) => data.json())
    .then((data) => {
      let sumAllRate = 0;
      var feedbacksList = data.data.content;
      for (feedback of feedbacksList) {
        sumAllRate = sumAllRate + parseInt(feedback.rate);
      }
      avgRating = Math.round(sumAllRate / feedbacksList.length);
      document.getElementById("avg-rating-score").innerHTML = avgRating;

      for (var i = 1; i <= avgRating; i++) {
        document
          .getElementsByClassName(`star${i}`)[0]
          .classList.add("rating__icon--star");
      }
    });
}
