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
  
document.getElementById("btn-upload-account").addEventListener("click", function () {
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
// get data Account
function getDetailAccount() {
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/' + usernameDetail, null, function (result) {
        if (result && result.status == 200) {
            if (result.data) {
                console.log(result)
                $('#name_account, .name_account').val(result.data.name);
                $('.name_account').text(result.data.name);
                $('#username_account, .username_account').val(result.data.username);
                $('.username_account').text(result.data.username);
                $('#phone_account').val(result.data.phone);
                $('#address_account, .address_account').val(result.data.address);
                $('#avatar_account').attr('src', 'https://res.cloudinary.com/vernom/image/upload/' +result.data.avatar);
            }
        }
    },
        function (errorThrown) { }
    );
}
getDetailAccount();
// save Account
function saveChangeAccount() {
    var name = $('#name_account').val();
    var username = $('#username_account').val();
    var phone = $('#phone_account').val();
    var address = $('#address_account').val();
    var password = $('#address_account').val();
    if (!name) {
        notification('warning', "Name is required!");
        return false;
    }
    if (!username) {
        notification('warning', "Username is required!");
        return false;
    }
    if (!username) {
        notification('warning', "Username is required!");
        return false;
    }
    if (listImageAccount.length == 0) {
        notification('warning', "Avatar is required!");
        return false;
    }

    var dataPost = {
        name: name,
        username: username,
        email: "meow@gmail.com",
        phone: phone,
        address: address,
        avatar: listImageAccount[0],
        updatedBy: objAccount.id,
        status: 1
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/' + idUserDetail, JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
            notification('success', "Successfully added new");
            goBack('account', 'account');
        }
    },
        function (errorThrown) { }
    );
}