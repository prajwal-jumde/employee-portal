////////////////////////////////////////////////////// Global vars /////////////////////////////////////////
var isAdded = true;
var oldCategoryId;
var array = []
var allLeaveList;
var pageOffset;
var pageLimit = 10;
var sortColumn;
var sortType;
var user_name;

var isSubmitted = true;


////////////////////////////////////////////////////// SET PAGE OFFSET  ////////////////////////////////////////////////////////

function setPageOffset(offset) {

    pageOffset = offset;
    updateList();
}

////////////////////////////////////////////////////// UPDATE LIST  ////////////////////////////////////////////////////////

function updateList() {

    var reqBody = JSON.stringify({
        search: $("#searchKey").val(),
        pageLimit: pageLimit,
        pageOffset: pageOffset,
        sortColumn: sortColumn,
        sortType: sortType
    });
    $.ajax({
        type: "post",
        url: "",
        data: reqBody,
        success: function (data) {
            $("#totalRecords").val(data.totalRecords).trigger('change');
            listLeaves(data.result);
            leaveMaster = data.result;
        },
        error: function (err) {
            console.log(err)
        }
    });
}

////////////////////////////////////////////////////// SEARCH RECORDS  ////////////////////////////////////////////////////////

function searchRecords() {
    var input = document.getElementById("searchKey");
    document.getElementById("search-image").click();
    updateList();
}

////////////////////////////////////////////////////// LIST USERS  ////////////////////////////////////////////////////////

function listLeaves(allLeaveList) {

    /*
    Function to list all the leaves and remaining leaves.

    */
    document.getElementById(NO_RECORD_CONTAINER).style.display = NONE;
    $(".data-row").remove();
    allLeaveList.forEach(leave => {
        addNewleaveRow(leave);
    });
}

////////////////////////////////////////////////////// ADD NEW ROW  ////////////////////////////////////////////////////////
function addNewleaveRow(leave) {

    /*
    Function to add new leave in the table.

    */

    var addRow =
        '<tr class="data-row">' +
        '<td id="category_' + leave.leave_type + '" value="' + leave.leave_type + '">' + leave.leave_type + '</td>' +
        '<td id="category_' + leave.total_leaves_month+ '_categoryname" value="' + leave.total_leaves_month+ '">' + leave.total_leaves_month+ '</td>' +
        '<td id="category_' + leave.remaining_leaves_month+ '_logo" value="' + leave.remaining_leaves_month+ '">' +  leave.remaining_leaves_month + '</td>'+
        '<td id="category_' + leave.total_leaves_year+ '_logo" value="' + leave.total_leaves_year+ '">' +  leave.total_leaves_year + '</td>' +
        '<td id="category_' + leave.remaining_leaves_year+ '_logo" value="' + leave.remaining_leaves_year+ '">' +  leave.remaining_leaves_year + '</td>' +'</tr>';
        
      $("table").append(addRow);

    var userRole = getCookie("user_role");

}


////////////////////////////////////////////////////// RESET FORM ////////////////////////////////////////////////////////

function resetForm() {
    /*
     Function to make form empty.
 
     */
    $("#modal_header").html("Add Leave");
    $("#submit").html("SUBMIT");
    isAdded = true;
    this.isSubmitted = true;
    document.getElementById("addForm").reset();
    document.getElementById("submit").disabled = false;
    document.getElementById('leaveName_error').innerHTML = '';
    document.getElementById('number_error').innerHTML = '';
}

////////////// toaster
function toasterFunction(status) {

    var toaster = document.getElementById("toaster-container");
    toaster.className = "show";
    if (status.status == 200) {
        document.getElementById("toaster-container").style.visibility = 'visible';
        toaster.style.backgroundColor = 'green';
    } else {
        document.getElementById("toaster-container").style.visibility = 'visible';
        toaster.style.backgroundColor = 'red';
    }
    document.getElementById("snackbar").innerHTML = status.message;
    setTimeout(function() {
        toaster.className = toaster.className.replace("show", "");
    }, 5000);
}
function closeToaster() {
    var toaster = document.getElementById("toaster-container");
    toaster.className = "show";
    toaster.className = toaster.className.replace("show", "");
}
////////////////////////////////////////////////////// END ////////////////////////////////////////////////////////
