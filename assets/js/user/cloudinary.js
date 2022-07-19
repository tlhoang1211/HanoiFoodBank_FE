// hoangtl2 - 28/10
// start



// add class "selected" to chosen option
// $(document).ready(function () {
//   $("select#category").change(function () {
//     $(this)
//       .find(":selected")
//       .addClass("selected")
//       .siblings("option")
//       .removeClass("selected");
//     var selectedCategory = $(this).children("option:selected").text();
//     console.log(selectedCategory);
//     myWidgetFood.update({
//       folder: "hanoi_food_bank_project/uploaded_food/" + selectedCategory,
//     });
//   });
// });

// // food
// var myWidgetFood = cloudinary.createUploadWidget(
//   {
//     cloudName: "vernom",
//     uploadPreset: "fn5rpymu",
//     form: "#new-food-form",
//     folder: "hanoi_food_bank_project/uploaded_food",
//     fieldName: "thumbnails[]",
//     thumbnails: ".thumbnails",
//   },
//   (error, result) => {
//     if (!error && result && result.event === "success") {
//       listImageFood.push(result.info.path);
//       var arrayThumnailInputs = document.querySelectorAll(
//         'input[name="thumbnails[]"]'
//       );
//       for (let i = 0; i < arrayThumnailInputs.length; i++) {
//         arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
//           "data-cloudinary-public-id"
//         );
//       }
//     }
//   }
// );

// document.getElementById("upload_image_food").addEventListener(
//   "click",
//   function () {
//     myWidgetFood.open();
//   },
//   false
// );

// // delete image
// $("body").on("click", ".cloudinary-delete", function () {
//   var splittedImg = $(this).parent().find("img").attr("src").split("/");
//   var imgName =
//     splittedImg[splittedImg.length - 3] +
//     "/" +
//     splittedImg[splittedImg.length - 2] +
//     "/" +
//     splittedImg[splittedImg.length - 1];
//   var publicId = $(this).parent().attr("data-cloudinary");
//   $(this).parent().remove();
//   $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
// });

// end
