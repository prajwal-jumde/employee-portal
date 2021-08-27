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
////////////////////////////////////////////////////// ADD FORM /////////////////////////////////////////

$(document).ready(function () {
    $("#" + SEARCH_KEY).keyup(function () {
        if (event.keyCode === 13) {
            searchRecords();
        }
    })

    var userRole = getCookie("user");
    if(userRole == 'Read'){
       var x= document.getElementsByClassName('add-button') 

       //    x.style.visibility="hidden";
       for (i=0;i<x.length;i++)
       {
        x[i].style.display="none";
       }
    }
})

//////////////////////////////////////////////// Add Leave Settings ////////////////////////////////
function submitAddForm() {
    /*
    Function to add the leave settings.
    
    */
   validateForm();
   var cookieUser = getCookie("user_session")
   document.getElementById("submit").disabled = false;

    if (this.isSubmitted == true) {

        var data = JSON.stringify({
            leave_name: $('#leaveName').val().trim(),
            monthly_quota: $('#monthlyLimit').val(),
            yearly_quota:$('#yearlyLimit').val()

        });
        $.ajax({
            url: "../add-leave/",
            data: data,
            type: "POST",
            success: function (result) {
                updateList()
                $("#myModal").modal("toggle");
                console.log('result',result)
                toasterFunction(result)
                document.getElementById("submit").disabled = true;
            }, error: function (err) {
                console.log(err)
                toasterFunction(err)
            }
            
      });
}


}

////////////////////////////////////////////////////// VALIDATE FORM /////////////////////////////////////////

function validateForm() {
    /*
    Function to validate the form

    */
   document.getElementById("submit").disabled = false;
   this.isSubmitted = true;

   if (document.getElementById('leaveName').value.length == 0) {
    document.getElementById('leaveName_error').innerHTML = 'Must be filled out';
    this.isSubmitted = false;
  } else{
    document.getElementById('leaveName_error').innerHTML = '';
  }
  if (!document.getElementById('leaveName').value.match(NAME_PATTERN)) {
    document.getElementById('leaveName_error').innerHTML = 'Invalid name ';
    this.isSubmitted = false;
  } else{
    document.getElementById('leaveName_error').innerHTML = '';
  }
  if (document.getElementById('monthlyLimit').value == 0 || !(document.getElementById('monthlyLimit').value)) {
    document.getElementById('number_error').innerHTML = 'Must be greater than 0';
    this.isSubmitted = false;
  } else{
    document.getElementById('number_error').innerHTML = '';
  }
  if (document.getElementById('yearlyLimit').value == 0 || !(document.getElementById('yearlyLimit').value)){
    document.getElementById('number_error2').innerHTML = 'Must be greater than 0';
    this.isSubmitted = false;
  } else{
    document.getElementById('number_error2').innerHTML = '';
  }
  console.log('1',document.getElementById('monthlyLimit').value ,document.getElementById('yearlyLimit').value)
  if (parseFloat(document.getElementById('monthlyLimit').value) > parseFloat(document.getElementById('yearlyLimit').value)){
    document.getElementById('number_error2').innerHTML = 'Must be greater than monthly limit';
    this.isSubmitted = false;
  }else{
    document.getElementById('number_error2').innerHTML = '';
  }
  
   
}


////////////////////////////////////////////////////// SET PAGE OFFSET  ////////////////////////////////////////////////////////

function setPageOffset(offset) {

    /*
      Function to set the offset of the leave settings page.
  
    */
    pageOffset = offset;
    updateList();
}

////////////////////////////////////////////////////// UPDATE LIST  ////////////////////////////////////////////////////////

function updateList() {

    /*
    Function to update leave settings.
    */
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
            listLeaveSettings(data.result);
            leaveMaster = data.result;
        },
        error: function (err) {
            console.log(err)
        }
    });
}

////////////////////////////////////////////////////// SEARCH RECORDS  ////////////////////////////////////////////////////////

function searchRecords() {

    /*
    Funtion to search from the leave settings. 

   */
    var input = document.getElementById("searchKey");
    document.getElementById("search-image").click();
    updateList();
}

////////////////////////////////////////////////////// LIST USERS  ////////////////////////////////////////////////////////

function listLeaveSettings(allLeaveList) {

    /*
    Function to list all the leave settings.

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
    Function to add new leave type in the table.
    */

    var addRow =
        '<tr class="data-row">' +
        '<td id="category_' + leave.leave_type + '" value="' + leave.leave_type + '">' + leave.leave_type + '</td>' +
        '<td id="category_' + leave.monthly_quota+ '_categoryname" value="' + leave.monthly_quota+ '">' + leave.monthly_quota+ '</td>' +
        '<td id="category_' + leave.yearly_quota+ '_logo" value="' + leave.yearly_quota+ '">' +  leave.yearly_quota + '</td>' +'</tr>';
        
      $("table").append(addRow);

    var userRole = getCookie("user_role");
    if(userRole == 'Read'){
       var x= document.getElementsByClassName('add-button') 

       //    x.style.visibility="hidden";
       for (i=0;i<x.length;i++)
       {
           x[i].style.display="none";
       }
    }
}
////////////////////////////////////////////////////// SET PAGE OFFSET  ////////////////////////////////////////////////////////


function sortHeaderName(sortColumn) {

    /*
    Function to sort the Leaves Settings.
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
            $("#totalRecords").val(data.totalRecords).trigger('change');
            listLeaveSettings(data.result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}


////////////////////////////////////////////////////// RESET FORM ////////////////////////////////////////////////////////

function resetForm() {
    /*
     Function to make form empty.
      Returns: empty form for user to be filled.
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
