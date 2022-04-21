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
  
//   // delete image
// $("body").on("click", ".cloudinary-delete", function () {
//     var splittedImg = $(this).parent().find("img").attr("src").split("/");
//     var imgName =
//         splittedImg[splittedImg.length - 3] +
//         "/" +
//         splittedImg[splittedImg.length - 2] +
//         "/" +
//         splittedImg[splittedImg.length - 1];
//     var publicId = $(this).parent().attr("data-cloudinary");
//     $(this).parent().remove();
//     $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
// });
function findFood() {
    getConnectAPI('GET', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${dataIdFood}`, null, function(result){
        if (result && result.status == 200) {
            console.log(result)
            if (result.data) {
                if (result.data.images) {
                    var arrImage = result.data.images.split(',');
                    if (arrImage && arrImage.length > 0) {
                        $('#avatar_food').attr('src', 'https://res.cloudinary.com/vernom/image/upload/' + arrImage[0]);
                        var htmlI = '';
                        for (let index = 0; index < arrImage.length; index++) {
                            var element = arrImage[index];
                            htmlI += '<div class="col"><img src="https://res.cloudinary.com/vernom/image/upload/'+ element +'/110x110" width="70" class="border rounded cursor-pointer" alt=""></div>';
                        }
                        $('#avatar_food').append(htmlI);
                    }
                }
                
                
                
                $('.nameCategory').text(result.data.category);
                $('.supplierName').text(result.data.supplierName);
                $('.supplierEmail').text(result.data.supplierEmail);
                // $('.expiration_Date').text(result.data.expirationDate);
                $('.titleFood').text(result.data.name);
                $('.contentFood').text(result.data.content);
                $('#primaryhome p').text(result.data.description);
            }
        }
    },
        function(errorThrown){}
    );
}
findFood();
// save food
function saveUpdateFood(){
    var name = $('#nameFood').val();
    var categoryId = $('#category_newFood').val();
    var expirationDate = $('#expirationDate').val();
    var description = $('#description').val();
    if (!name) {
        notification('warning', "Food name is required!");
        return false;
    }
    if (!expirationDate) {
        notification('warning', "Expiration Date is required!");
        return false;
    }
    if (listImageFood.length == 0) {
        notification('warning', "Food pictures is required!");
        return false;
    }
    
    var dataPost = {
        name: name,
        avatar: listImageFood[0],
        images: listImageFood.join(","),
        expirationDate: expirationDate,
        createdBy: objAccount.id,
        categoryId: categoryId,
        description: description
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods', JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            notification('success', "Successfully added new");
            goBack('food', 'food');
        }
    },
        function(errorThrown){}
    );
}
function renderOptionCategory(){
    var htmlO = '';
    for (let index = 0; index < arr_Category.length; index++) {
        var element = arr_Category[index];
        htmlO += '<option value="' + element.id + '">' + element.name + '</option>';
    }
    console.log(htmlO)
    $('#category_newFood').append(htmlO);
}
renderOptionCategory();
// getConnectAPI('GET', 'http://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/' + id, null, function(result){
//         if (result && result.status == 200) {
//             dataFindFood = result;
//         }
//     },
//         function(errorThrown){}
//     );