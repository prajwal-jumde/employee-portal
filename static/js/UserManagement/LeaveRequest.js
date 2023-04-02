////////////////////////////////////////////////////// Global vars /////////////////////////////////////////
var isAdded = true;
var oldCategoryId;
var array = []
var allCategoryList;
var pageOffset;
var sortColumn;
var sortType;
var pageLimit = 10;
var user_name;
var isSubmitted = true;
var reject_reason =''
var user_id
////////////////////////////////////////////////////// ADD FORM /////////////////////////////////////////

function submitAddForm() {

 document.getElementById("submit").disabled = false;
 var user_name = getCookie("user_session");
 var user_full_name = getCookie("user_full_name");
 validateForm();

 var action = "";
 if (isAdded) {
   action = "add";
  }
  else {
    action = "update";
  }

  if (this.isSubmitted == true) {
    var data = JSON.stringify({ 
        user_name: user_name,
        full_name: user_full_name,
        leave_details: $('#leaveDetails').val(),
        leave_type: $('#leaveType').val(),
        total_days: $('#totalDays').val(),
        leave_from: $('#fromDate').val(),
        leave_to: $('#toDate').val(),
        paid_leave: $('#paidUnpaid').val(),
        action: 'add',
        created_by: user_name
    })
    $.ajax({
      url: "../leave-request-action/",
      data: data,
      type: "POST",
      success: function (result) {

        updateList()
        toasterFunction(result)
        $("#myModal").modal("toggle");
        document.getElementById("submit").disabled = true;

      },error: function (err) {
        console.log(err)
      }
    });
  }
}
////////////////////////////////////////////////////// EDIT FORM /////////////////////////////////////////

function openEditForm(editCategory) {

  $("#modal_header").html("Update Category");
  document.getElementById('categoryLogo_error').innerHTML = '';
  document.getElementById('categoryName_error').innerHTML = '';
  document.getElementById('categoryLogo').value = '';
  document.getElementById("submit").disabled = false;
  isAdded = false;
  $("#submit").html("UPDATE");
  oldCategoryId = editCategory;
  for (i = 0; i < leaveMaster.length; i++) {
    if (editCategory == leaveMaster[i]['id']) {
      oldCategoryId = editCategory;
      $("#categoryName").val(leaveMaster[i]['categoryName']).html();
    }
  }

  $("#myModal").modal("toggle");
}

function approveLeave(leave) {
  console.log(leave)
  var cookieUser = getCookie("user_session");
  var data = JSON.stringify({
      id:leave,
      user_name: cookieUser,
      updated_by: cookieUser,

      action: "approve"
  });
  $.ajax({
    url: "../leave-request-action/",
    data: data,
    type: "POST",
    success: function (result) {
      updateList()
      toasterFunction(result)
    }
  });
}

$(document).on('click', '.delete-modal', function () {
  user_id = $(this).data('id');
  $(".footer #delete").attr('id', user_id);
});

function rejectLeave(leave) {
  console.log(leave)
  console.log(user_id)
  var cookieUser = getCookie("user_session");
  var data = JSON.stringify({
      updated_by: cookieUser,
      id:user_id,
      rejected_reason:$('#rejectedReason').val().trim(),
      action: "reject"
  });
  $.ajax({
    url: "../leave-request-action/",
    data: data,
    type: "POST",
    success: function (result) {
      updateList()
      toasterFunction(result)
      $("#deleteModal").modal("toggle");
    }
  });
}
////////////////////////////////////////////////////// DELETE CATEGORY /////////////////////////////////////////

// Delete Function
// function deleteCategory(deleteCategory) {

//  var cookieUser = getCookie("user_session")
//  deleteCategory = user_name;
//   let data = new FormData();
//   data.append('id', deleteCategory);
//   data.append('action', "delete");
//   data.append('updatedBy',cookieUser);

//   $.ajax({
//     url: "../productCategoryAction/",
//     data: data,
//     type: "POST",
//     processData: false,
//     contentType: false,
//     success: function (result) {
//       updateList()
//       toasterFunction(result)
//       $("#deleteModal").modal("toggle");
//     }
//   });
// }

////////////////////////////////////////////////////// VALIDATE FORM /////////////////////////////////////////

async function validateForm() {

  document.getElementById("submit").disabled = false;
  this.isSubmitted = true;

  if (document.getElementById('leaveDetails').value.length == 0) {
    document.getElementById('leaveDetails_error').innerHTML = 'Name must be filled out';
    this.isSubmitted = false;
  } else{
    document.getElementById('leaveDetails_error').innerHTML = '';
  }
  
  if (document.getElementById('fromDate').value.length == 0) {
    document.getElementById('fromDate_error').innerHTML = 'Required';
    this.isSubmitted = false;
    } else{
        document.getElementById('fromDate_error').innerHTML = '';
    }

    if (document.getElementById('toDate').value.length == 0) {
        document.getElementById('toDate_error').innerHTML = 'Required';
        this.isSubmitted = false;
    } else{
        document.getElementById('toDate_error').innerHTML = '';
    }

    if (document.getElementById('toDate').value && document.getElementById('fromDate').value){
        var toDate = new Date(document.getElementById('toDate').value)
        var fromDate = new Date(document.getElementById('fromDate').value)

        if (fromDate > toDate){
            document.getElementById('toDate_error').innerHTML = 'Must be greater than from date';
        }else{
            document.getElementById('toDate_error').innerHTML = '';
            
        }
    }
    if (document.getElementById('totalDays').value == 0 || !(document.getElementById('totalDays').value)) {
        document.getElementById('totalDays_error').innerHTML = 'Must greater than 0';
        this.isSubmitted = false;
      } else{
        document.getElementById('totalDays_error').innerHTML = '';
      }

    if (this.isSubmitted){
        console.log($('#totalDays').val())
        console.log(document.getElementById('totalDays').value)
        days = parseFloat($('#totalDays').val())
        console.log('days',days);
        var user_name = getCookie("user_session") 
        var data = JSON.stringify({
            user_name: user_name,
            to_date: $('#toDate').val(),
            from_date:$('#fromDate').val(),
            total_days: days,
            leave_type:$('#leaveType').val()

        });
        $.ajax({
            url: "../check-paid/",
            data: data,
            type: "POST",
            success: function (result) {
                // updateList()
                // $("#myModal").modal("toggle");
                console.log('result',result)
                // toasterFunction(result)
                document.getElementById("paidUnpaid").innerHTML = result.paid_unpaid;
                document.getElementById("paidUnpaid").value = result.paid_unpaid;
                document.getElementById("paidUnpaid_error").innerHTML = "";
            }, error: function (err) {
                console.log(err)
                document.getElementById("paidUnpaid_error").innerHTML = "something went wrong";
                // toasterFunction(err)
            }
        });
    }
    
}

function validateDate(){
    document.getElementById("submit").disabled = false;
    this.isSubmitted = true; 

    if (document.getElementById('fromDate').value.length == 0) {
        document.getElementById('fromDate_error').innerHTML = 'Required';
        this.isSubmitted = false;
    } else{
        document.getElementById('fromDate_error').innerHTML = '';
    }
    
    if (document.getElementById('toDate').value.length == 0) {
        document.getElementById('toDate_error').innerHTML = 'Required';
        this.isSubmitted = false;
    } else{
        document.getElementById('toDate_error').innerHTML = '';
    }
    
    if (document.getElementById('toDate').value && document.getElementById('fromDate').value){
        var toDate = new Date(document.getElementById('toDate').value)
        var fromDate = new Date(document.getElementById('fromDate').value)

        if (fromDate > toDate){
            document.getElementById('toDate_error').innerHTML = 'Must be greater than from date';
        }else{
            document.getElementById('toDate_error').innerHTML = '';

        }
    }
}


////////////////////////////////////////////////////// SET PAGE OFFSET  ////////////////////////////////////////////////////////

function setPageOffset(offset) {

  /*
    Function to set the offset of the page.
  */
  pageOffset = offset;
  updateList();
}

////////////////////////////////////////////////////// UPDATE LIST  ////////////////////////////////////////////////////////

function updateList() {

  /*
  Function to update the list of leave requesy.
  */
  var cookieUser = getCookie("user_session")
  var user_role = getCookie("user")

  var reqBody = JSON.stringify({
    search: $("#searchKey").val(),
    pageLimit: pageLimit,
    pageOffset: pageOffset,
    sortColumn: sortColumn,
    sortType: sortType,
    user_name: cookieUser,
    user_role: user_role
  });
  $.ajax({
    type: "POST",
    url: '../list-leave-request/',
    data: reqBody,
    success: function (data) {
      console.log(data)
      $("#totalRecords").val(data.result.totalRecords).trigger('change');
      listLeaves(data.result);
      leaveMaster = data.result;
    },
    error: function (err) {
      console.log(err)
    }
  });
}

////////////////////////////////////////////////////// SEARCH RECORDS  //////////////////////////////////////////////////////////


$(document).ready(function () {
  $("#" + SEARCH_KEY).keyup(function () {
      if (event.keyCode === 13) {
          searchRecords();
      }
    // var el = document.getElementById("totalDays");
    //   el.addEventListener("keyup", function() {
    //       alert('yahoooo0');
    //   });
  })
  // console.log('hi')
  // var userRole = getCookie("user_role");
  // if(userRole == 'Read'){
  //    var x= document.getElementsByClassName('add-button') 
  //    for (i=0;i<x.length;i++)
  //    {
  //     x[i].style.display="none";
  //    }
  // }
})

function searchRecords() {

  var input = document.getElementById("searchKey");
  document.getElementById("search-image").click();
  updateList();
}

////////////////////////////////////////////////////// LIST USERS  ////////////////////////////////////////////////////////

function listLeaves(allCategoryList) {

  document.getElementById(NO_RECORD_CONTAINER).style.display = NONE;
  $(".data-row").remove();
  allCategoryList.forEach(category => {
    addNewLeave(category);
  });
}

////////////////////////////////////////////////////// ADD NEW ROW  ////////////////////////////////////////////////////////
function addNewLeave(leave) {

  var statusColor = 'black'
  if (leave.status == "approved"){
    statusColor='green'
  }else if (leave.status == "rejected"){
    statusColor='red'
  }

  var addRow =
    '<tr class="data-row">' +
    '<td id="leave_' + leave.full_name + '_full_name" value="' + leave.full_name + '">' + leave.full_name + '</td>' +
    '<td id="leave_' + leave.leave_type + '_leave_type" value="' + leave.leave_type + '">' + leave.leave_type + '</td>' +
    '<td id="leave_' + leave.status + '_status" value="' + leave.status + '" style="color:'+statusColor+' ";>' + leave.status + '</td>' +
    '<td id="leave_' + leave.leave_from + '_leave_from" value="' + leave.leave_from + '">' + leave.leave_from + '</td>' +
    '<td id="leave_' + leave.leave_to + '_leave_to" value="' + leave.leave_to + '">' + leave.leave_to + '</td>' +
    '<td id="leave_' + leave.paid_leave + '_paid_leave" value="' + leave.paid_leave + '">' + leave.paid_leave + '</td>' +
    '<td id="leave_' + leave.rejected_reason + '_rejected_reason" value="' + leave.rejected_reason + '">' + leave.rejected_reason + '</td>' +
    '<td class = "action-tab">' +
    '<img class="approvereject-icons" src="../../static/assets/approve-icon.png" onClick="approveLeave(\'' +
    leave.id + '\')"><img class="delete-modal approvereject-icons" data-backdrop="static" data-toggle="modal" data-id="' + leave.id +
    '" data-target="#deleteModal" src="../../static/assets/reject-icon.png"></td></tr>';
    
  $("table").append(addRow);

  var userRole = getCookie("user");
  if(userRole == 'admin'){
     var x= document.getElementsByClassName('add-button') 

     for (i=0;i<x.length;i++)
    {
      x[i].style.display="none";
    }
  }else if(userRole == 'employee'){
    var x= document.getElementsByClassName('action-tab') 
    for (i=0;i<x.length;i++)
    {
        x[i].style.display="none";
    }
  }
}
////////////////////////////////////////////////////// SET PAGE OFFSET  ////////////////////////////////////////////////////////


function sortHeaderName(sortColumn) {

  /*
  Function to sort the leave table.

  */

  if (this.isAscending === false && this.isDescending === false) {
    this.isAscending = true;
    this.isDescending = false;
    sortType = '';
  } else if (this.isAscending === true) {
    this.isDescending = true;
    this.isAscending = false;
    sortType = '-';
  } else {
    this.isAscending = true;
    this.isDescending = false;
    sortType = '';
  }
  this.reqBody = JSON.stringify({
    search: $('#searchKey').val().trim(),
    pageLimit: pageLimit,
    pageOffset: pageOffset,
    sortType: sortType,
    sortColumn: sortColumn,
  });
  $.ajax({
    type: 'post',
    url: '',
    data: this.reqBody,
    success: function (data) {
      $("#totalRecords").val(data.result.totalRecords).trigger('change');
      listLeaves(data.result.catData);
    },
    error: function (err) {
      console.log(error);
      window.location.replace('/');
    }
  });
}

////////////////////////////////////////////////////// RESET FORM ////////////////////////////////////////////////////////

function resetForm() {
  /*
   Function to make form empty.
   Returns: empty form for user to be filled.
   */
  $("#submit").html("SUBMIT");
  $(MODAL_HEADER).html("ADD CATEGORY");
  isAdded = true;
  document.getElementById("addForm").reset();
  document.getElementById("submit").disabled = false;
  document.getElementById('leaveDetails_error').innerHTML = '';
  document.getElementById('fromDate_error').innerHTML = '';
  document.getElementById('toDate_error').innerHTML = '';
  document.getElementById('paidUnpaid_error').innerHTML = '';

}

////////////////////////////////////////////////////////// Toaster /////////////////////////////////////////////////

function toasterFunction(status) {
    var toaster = document.getElementById("toaster-container");
    toaster.className = "show";
    if (status.status == 200) {
        toaster.style.backgroundColor = 'green';
    } else {
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
