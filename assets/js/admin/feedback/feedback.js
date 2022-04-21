var orderBy = 'desc';

function onChangeOrderByFeedback(e, type){
    orderBy = type;
    addActive(e);
    getListFeedback();
}
// get data Feedback
function getListFeedback(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (orderBy) {
        optionUrl += '&order=' + orderBy;
    }
    optionUrl += '&sortBy=createdAt';
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/feedbacks/search?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function(result){
        if (result && result.status == 200) {
            if (result && result.data && result.data.content) {
                if (result.data.content.length > 0) {
                    if (document.querySelectorAll("#table-Feedback tbody").lastElementChild) {
                        document.querySelectorAll("#table-Feedback tbody").item(0).innerHTML = '';
                    }
                    document.querySelectorAll("#table-Feedback tbody").item(0).innerHTML = renderListFeedback(result.data.content);
                    $('#table-Feedback').removeClass('d-none');
                    $('.axbox-footer').removeClass('d-none');
                    $('.zero-warning').addClass('d-none');
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
                            getListFeedback(page - 1);
                        }
                    }
                    $('#nextpage').bootstrapPaginator(options);
                } else {
                    $('#table-Feedback').addClass('d-none');
                    $('.axbox-footer').addClass('d-none');
                    $('.zero-warning').removeClass('d-none');
                }
            }
        }
    },
        function(errorThrown){}
    );
}
getListFeedback();
function renderListFeedback(data) {
    var count = 0;
    var html = data.map(function (e) {
        count++;
        var htmlS = '';
        htmlS += '<tr>';
        htmlS += '<td>' + count + '</td>';
        htmlS += '<td><img src="https://res.cloudinary.com/vernom/image/upload/'+ e.avatar +'" width="40" height="40"></td>';
        htmlS += '<td>'+ (e.sentName || '') +'</td>';
        htmlS += '<td><img src="https://res.cloudinary.com/vernom/image/upload/'+ e.image +'" width="40" height="40"></td>';
        htmlS += '<td>' + (e.rate || 0) + ' $</td>';
        htmlS += '<td>' + (e.content || '') + '</td>';
        htmlS += '<td>' + (e.name || '') +'</td>';
        htmlS += '<td>' + (e.createdAt || "") + '</td>';
        htmlS += '</tr>';
        return htmlS;
    });
    return html.join("");
}