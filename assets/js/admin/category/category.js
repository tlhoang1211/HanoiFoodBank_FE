var orderByCategory = 'asc', statusCategory = null, searchName_Category;
function formAddCategory() {
    $('#modalAddCategory').modal('show');
}
// save Category
function saveCategory(){
    var name = $('#nameCategory').val();
    var status = $('#statusCategory').val();
    var id = $('#idCategory').val(); 
    if (!name) {
        // name is required
        $(".alert-danger").alert();
        return false;
    }
    var dataPost = {
        name: name,
        createdBy: objAccount.id
    }
    var idUpdate = '';
    if (id) {
        dataPost['status'] = parseInt(status);
        idUpdate = '/' + id;
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/categories' + idUpdate, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            getListCategory();
            $('#modalAddCategory').modal('hide');
        }
    },
        function(errorThrown){}
    );
}
function onChangeOrderByCategory(e, type){
    orderByCategory = type;
    addActive(e);
    getListCategory();
}
function filterStatusCategory(e, type){
    if (type) {
        statusCategory = type;
    } else {
        statusCategory = null;
    }
    addActive(e);
    getListCategory();
}
function searchNameCategory(ele){
    searchName_Category = $(ele).val();
    getListCategory();
}
// get data Category
function getListCategory(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (statusCategory) {
        optionUrl += '&status=' + parseInt(statusCategory);
    }
    if (orderByCategory) {
        optionUrl += '&order=' + orderByCategory;
    }
    optionUrl += '&sortBy=id';
    if (searchName_Category) {
        optionUrl += '&name=' + searchName_Category;
    }
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/categories?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function(result){
        if (result && result.status == 200) {
            if (result && result.data && result.data.content && result.data.content.length > 0) {
                if (document.querySelectorAll("#table-category tbody").lastElementChild) {
                    document.querySelectorAll("#table-category tbody").item(0).innerHTML = '';
                }
                document.querySelectorAll("#table-category tbody").item(0).innerHTML = renderListCategory(result.data.content);
                var total = 0;
                total = result.data.totalElements;
                var pageNumber = Math.ceil(total / pageSize);
                if (pageNumber == 0){
                    pageNumber = 1;
                }
                var options = {
                    currentPage: pageIndex + 1,
                    totalPages: pageNumber,
                    totalCount: total,
                    size: 'normal',
                    alignment: 'right',
                    onPageClicked: function (e, originalEvent, click, page) {
                        getListCategory(page - 1);
                    }
                }
                $('#nextpage').bootstrapPaginator(options);
            }
            
        }
    },
        function(errorThrown){}
    );
}
getListCategory();
function renderListCategory(data) {
    var count = 0;
    var html = data.map(function (e) {
        count++;      
        return (
            `<tr>
                <td>${count}</td>
                <td>${e.name || ""}</td>
                <td>${e.createdAt}</td>
                <td>${e.createdBy}</td>
                <td>
                    <div class="d-flex align-items-center ${colorStatusCategory(e.status)}">
                        <i class='bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1'></i>
                        <span>${convertStatusCategory(e.status)}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex order-actions">`
                        + "<a onclick=\"formUpdateCategory('" + e.id + "', '" + e.name + "', '" + e.status + '\')"><i class="bx bx-edit"></i></a>'
                        + "<a onclick=\"deleteCategory(this, '" + e.id + "', '" + e.name + '\')" class="ms-4 ' + (e.status == 0 ? 'd-none' : '') + '"><i class="bx bxs-trash"></i></a></div>' +
                `</td>
            </tr>`
            );
        });
    return html.join("");
}
function formUpdateCategory(id, name, status) {
    $('#modalAddCategory').modal('show');
    document.getElementById('statusCategory').parentElement.classList.remove('d-none');
    $('#nameCategory').val(name);
    $('#statusCategory').val(status);
    $('#idCategory').val(id); 
}
var objDeleteCategory;
function deleteCategory(e, id, name) {
    objDeleteCategory = {
        id: id,
        name: name
    }
    $('#deleteCategory').modal('show');
}
function onDeleteCategory(){
    var dataPost = {
        name: objDeleteCategory.name,
        updatedBy: objAccount.id,
        status: 0
    };
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/categories/${objDeleteCategory.id}`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            $('#deleteCategory').modal('hide');
            getListCategory();
        }
    },
        function(errorThrown){}
    );
}

function convertStatusCategory(status){
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

function colorStatusCategory(status){
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