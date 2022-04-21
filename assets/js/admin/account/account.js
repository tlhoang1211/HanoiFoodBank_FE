
var orderByAccount = 'desc', statusAccount = null, searchName_Account;
function formNewAccount() {
    var pageContent = document.getElementsByClassName('page-content');
    if (pageContent.item(0)) {
		pageContent.item(0).remove();
	}
	localStorage.setItem('page', 'newFood');
	loadHtml( '../../../inc/layout/admin/content/account/newAccount.html', '.page-wrapper', 'div', 'page-content', '', 'afterbegin', '../../../assets/js/admin/account/newAccount.js');
}
function onChangeOrderBy(e, type) {
    orderByAccount = type;
    addActive(e);
    getListAccount();
}
function filterStatus(e, type,) {
    if (type) {
        statusAccount = type;
    } else {
        statusAccount = null;
    }
    addActive(e);
    getListAccount();
}
function searchNameAccount(ele) {
    searchName_Account = $(ele).val();
    getListAccount();
}
// get data Account
function getListAccount(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (statusAccount) {
        optionUrl += '&status=' + parseInt(statusAccount);
    }
    if (orderByAccount) {
        optionUrl += '&order=' + orderByAccount;
    }
    optionUrl += '&sortBy=createdAt';
    if (searchName_Account) {
        optionUrl += '&keyword=' + searchName_Account;
    }
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/search?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function (result) {
        if (result && result.status == 200) {
            if (result && result.data && result.data.content && result.data.content.length > 0) {
                if (document.querySelectorAll("#table-Account tbody").lastElementChild) {
                    document.querySelectorAll("#table-Account tbody").item(0).innerHTML = '';
                }
                document.querySelectorAll("#table-Account tbody").item(0).innerHTML = renderListAccount(result.data.content);
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
                    size: 'normal',
                    alignment: 'right',
                    onPageClicked: function (e, originalEvent, click, page) {
                        getListAccount(page - 1);
                    }
                }
                $('#nextpage').bootstrapPaginator(options);
            }

        }
    },
        function (errorThrown) { }
    );
}
getListAccount();
function renderListAccount(data) {
    var count = 0;
    var html = data.map(function (e) {
        count++;
        var htmld = '';
        htmld += '<tr><td>' + count + '</td>';
        if (e.avatar) {
            htmld += '<td><img src="https://res.cloudinary.com/vernom/image/upload/' + e.avatar + '" style="width: 30px;height: 30px;"/></td>'
        } else {
            htmld += '<td><img src="https://via.placeholder.com/110x110" style="width: 30px;height: 30px;"/></td>';
        }
        htmld += '<td>' + (e.name || '') + '</td>';
        htmld += '<td>' + (e.username || '') + '</td>';
        htmld += '<td>' + (e.phone || '') + '</td>';
        htmld += '<td>' + (e.address || '') + '</td>';
        htmld += '<td>';
        htmld += '<div class="d-flex align-items-center ' + colorStatusAccount(e.status) +'">';
        htmld += '<i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i>'
        htmld += '<span>' + convertStatusAccount(e.status) +'</span></div></td>';
        htmld += '<td>' + e.createdAt + '</td>';
        htmld += '<td><div class="d-flex order-actions">';
        htmld += '<a onclick="formUpdateAccount(this, \'' + e.id + '\', \'' + e.username + '\')"><i class="bx bx-edit"></i></a>';
        htmld += '<a class="ms-4" onclick="changeRole(this, \'' + e.id + '\')"><i class="bx bx-user"></i></a>';
        htmld += '<a class="ms-4 ' + (e.status == 1 ? '' : 'd-none') + '" onclick="deleteAccount(this, \'' + e.id + '\')"><i class="bx bx-trash"></i></a>';
        htmld += '</td>';
        return htmld;
    });
    return html.join("");
}
var objDeleteAccount;
function deleteAccount(e, id, name, cateID, avatar, images, description, content, expirationDate) {
    objDeleteAccount = {
        ele: e.parentElement.parentElement.parentElement,
        id: id,
        name: name,
        cateID: cateID,
        avatar: avatar,
        images: images,
        description: description,
        content: content,
        expirationDate: expirationDate
    }
    $('#deleteAccount').modal('show');
}
function onDeleteAccount() {
    var dataPost = {
        name: objDeleteAccount.name,
        updatedBy: objAccount.id,
        categoryId: objDeleteAccount.cateID,
        status: 0,
        avatar: objDeleteAccount.avatar,
        images: objDeleteAccount.images,
        description: objDeleteAccount.description,
        content: objDeleteAccount.content,
        expirationDate: objDeleteAccount.expirationDate
    };
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/Accounts/${objDeleteAccount.id}`, JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
            notification('success', result.message);
            $('#deleteAccount').modal('hide');
            getListAccount();
        } else {
            notification('warning', result.message);
        }
    },
        function (errorThrown) { }
    );
}

function convertStatusAccount(status) {
    var text = '';
    switch (status) {
        case 0:
            text = 'Deactive';
            break;
        case 1:
            text = 'Active';
            break;
        default:
            text = 'Active';
            break;
    }
    return text;
}
function colorStatusAccount(status) {
    var color = '';
    switch (status) {
        case 0:
            color = 'text-danger';
            break;
        case 1:
            color = 'text-success';
            break;
        default:
            color = 'text-success';
            break;
    }
    return color;
}
function changeRole(e, id) {
    $('#modal-changeRole').modal('show');
}
var usernameDetail, idUserDetail;
function formUpdateAccount(e, id, username) {
    idUserDetail = id;
    usernameDetail = username;
    var pageContent = document.getElementsByClassName('page-content');
    if (pageContent.item(0)) {
		pageContent.item(0).remove();
	}
	localStorage.setItem('page', 'updateAccount');
	loadHtml( '../../../inc/layout/admin/content/account/profile.html', '.page-wrapper', 'div', 'page-content', '', 'afterbegin', '../../../assets/js/admin/account/profile.js');
}