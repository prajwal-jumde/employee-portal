//Declaration of Variables

var userArray = USER_ARRAY;
var isAdded = true;
var oldUserName;
var userList;
var sortColumn;
var sortType;
var isAscending = false;
var isDescending = false;
var isSubmitted = true;
var isEmailValid = true;
var isfullNameValid = true;
var isPhoneNumberValid = true;
var isUsernameValid = true;
var isPasswordValid = true;
var tableData;
var search;

$(document).ready(function () {
    $("#" + SEARCH_KEY).keyup(function () {
        if (event.keyCode === 13) {
            searchRecords();
        }
    })
})

// Edit function
function openEditForm(editUserName) {
    document.getElementById("submit").disabled = false;
    // document.getElementById('password').innerHTML = ''
    $("#password").val("");
    this.userArray.forEach(function (field) {
        document.getElementById(field + ERROR).innerHTML = '';
    });
    for (i = 0; i < userMaster.length; i++) {
        if (editUserName == userMaster[i][USERNAME]) {
            $(USERID).val(userMaster[i][USER_ID]).html();
        }
    }
    $(MODAL_HEADER).html(UPDATE_USER);
    isAdded = false;
    $(SUBMIT).html(UPDATE_HEADER_NAME);
    $(PASSWORD_ID).html(NEW_PASSWORD);
    $(USERNAME_ID).prop(DISABLED, true);
    $(FULLNAME_ID).val($(USER + editUserName + FULL_NAME).html());
    $(EMAIL_ID).val($(USER + editUserName + EMAIL).html());
    oldUserName = editUserName;
    $(USERNAME_ID).val(editUserName);
    $(PHONE_NUMBER_ID).val($(USER + editUserName + PHONE).html());
    $(USER_ROLE_ID).val($(USER + editUserName + USERROLE).html());
    $(MODAL).modal(TOGGLE);
}

var user_name;
// Delete Function
$(document).on(CLICK, DELETE_MODAL, function () {
    user_name = $(this).data(ID);
    $(DELETE_CLASS).attr(ID, user_name);
});

function deleteUser(deleteUserName) {
    deleteUserName = user_name;
    var cookieUser = getCookie("user_session");
    var data = JSON.stringify({
        user_name: deleteUserName,
        updated_by: cookieUser,
        action: DELETE
    });
    $.ajax({
        url: USER_ACTION_URL,
        data: data,
        type: POST,
        success: function (result) {
            $("#deleteModal").modal(TOGGLE);
            updateList()
            toasterFunction(result)
        }
    });
}
function enableDisableUser(user_name){
    console.log('inside funxxxxxxxxxxxxxx')
    var cookieUser = getCookie("user_session");
    var data = JSON.stringify({
        user_name: user_name,
        updated_by: cookieUser,
        action: 'enable_disable'
    });
    $.ajax({
        url: USER_ACTION_URL,
        data: data,
        type: POST,
        success: function (result) {
            updateList()
            toasterFunction(result)
        }
    });
}

// Submit Form
function submitAddForm() {
    validateForm();
    document.getElementById("submit").disabled = false;
    var cookieUser = getCookie("user_session");

    var action = "";
    if (isAdded) {
        action = ADD;
    } else {
        action = UPDATE;
    }
    if (this.isSubmitted && this.isfullNameValid && this.isPasswordValid && this.isEmailValid && this.isPhoneNumberValid &&
        this.isUsernameValid) {
        
        var data = JSON.stringify({
            user_name: $(USERNAME_ID).val(),
            password: $(PASSWORD).val(),
            email: $(EMAIL_ID).val(),
            userId: $(USERID).val().trim(),
            phone_number: $(PHONE_NUMBER_ID).val(),
            full_name: $(FULLNAME_ID).val(),
            userRole: $(USER_ROLE_ID).val(),
            created_by: cookieUser,
            updated_by: cookieUser,
            action: action,
            oldUserName: oldUserName,
        });
        $.ajax({
            url: USER_ACTION_URL,
            data: data,
            type: POST,
            success: function (result) {
                $(MODAL).modal(TOGGLE);
                updateList()
                toasterFunction(result)
                // window.location.reload();
                document.getElementById("submit").disabled = true;

            }
        });
    }
}

//Reset the form and validation onclick the add button
function resetForm() {
    document.getElementById("submit").disabled = false;

    document.getElementById(PASSWORD_SECTION).style.display = FLEX;
    $(MODAL_HEADER).html(ADD_USER);
    $(SUBMIT).html(SUBMIT_BTN_NAME);
    $(USERNAME_ID).prop(DISABLED, false);
    isAdded = true;
    this.userArray.forEach(function (field) {
        document.forms[USER_FORM][field].value = '';
        document.getElementById(field + ERROR).innerHTML = '';
    });
    document.getElementById(USER__ID).value = '';
    document.getElementById(USER__ROLE).value = ADMIN;
    document.getElementById("submit").disabled = false;

}

// Validation the form before submitting
function validateForm() {
    this.userArray.forEach(function (field) {
        document.getElementById(field).onkeyup = function () {
            document.getElementById(field + ERROR).innerHTML = '';
        };
    });
    document.getElementById("submit").disabled = false;

    if (!$(FULLNAME_ID).val().match(NAME_PATTERN)) {
        document.getElementById(FULLNAME_ERROR).innerHTML = INVALID_FULLNAME;
        this.isfullNameValid = false;
    } else if (!$(FULLNAME_ID).val()) {
        // document.getElementById(FULLNAME_ERROR).innerHTML = EMPTY_FULLNAME_FIELD_ERROR;
        this.isfullNameValid = false;
    } else {
        this.isfullNameValid = true;
    }

    if (!$(EMAIL_ID).val().match(EMAIL_PATTERN)) {
        document.getElementById(EMAIL_ID_ERROR).innerHTML = INVALID_EMAIL;
        this.isEmailValid = false;
    } else {
        this.isEmailValid = true;
    }
    if (this.isAdded) {
        var sameEmail = this.tableData.map(field => field.email_id.toLowerCase() == $(EMAIL_ID).val().toLowerCase());
        if (sameEmail.includes(true) || sameEmail.includes(true).length == 2) {
            document.getElementById(EMAIL_ID_ERROR).innerHTML = EMAIL_EXISTS;
            this.isEmailValid = false;
        }
    }
    if (this.isAdded) {
        if ($('#password').val().length < 8) {
            document.getElementById("password_error").innerHTML = "Minimun 8 character requires.";
            this.isPasswordValid = false;
        }
        else {
            this.isPasswordValid = true;
    }
    }

    if (this.isAdded) {
        var sameUsername = this.userMaster.map(field => field.user_name.toLowerCase() == $(USERNAME_ID).val().trim().toLowerCase());
        if ($(USERNAME_ID).val().trim() == '' || $(USERNAME_ID).val().length > 20) {
            document.getElementById(USERNAME_ERROR).innerHTML = EMPTY_USERNAME_FIELD_ERROR;
            this.isUsernameValid = false;
        } else if (sameUsername.includes(true)) {
            document.getElementById(USERNAME_ERROR).innerHTML = USERNAME_EXISTS;
            this.isUsernameValid = false;
        } else {
            this.isUsernameValid = true;
        }


        if (!$(EMAIL_ID).val().match(EMAIL_PATTERN)) {
            document.getElementById(EMAIL_ID_ERROR).innerHTML = INVALID_EMAIL;
            this.isEmailValid = false;
        } else if ($(EMAIL_ID).val().trim() == '') {
            document.getElementById(EMAIL_ID_ERROR).innerHTML = INVALID_EMAIL;
            this.isEmailValid = false;
        } else if (userMaster) {
            isIterated = false;
            userMaster.forEach(field => {
                if (($(EMAIL_ID).val().trim().toLowerCase() == field.email_id.trim().toLowerCase()) &&
                    (field.user_name.trim().toLowerCase() != $(USERNAME_ID).val().trim().toLowerCase())) {
                    document.getElementById(EMAIL_ID_ERROR).innerHTML = EMAIL_EXISTS;
                    this.isEmailValid = false;
                    isIterated = true;
                } else if ((field.email_id.trim().toLowerCase() == $(EMAIL_ID).val().trim().toLowerCase()) &&
                    (field.user_name.trim().toLowerCase() == $(USERNAME_ID).val().trim().toLowerCase())) {
                    this.isEmailValid = true;
                    isIterated = true;
                }
            });

            if (isIterated == false) {
                this.isEmailValid = true;
            }
        } else {
            this.isEmailValid = true;
        }
        if (!$(PHONE_NUMBER_ID).val().match(MOBILE_PATTERN)) {

            document.getElementById(PHONE_NUMBER_ERROR).innerHTML = INVALID_NUMBER;
            this.isPhoneNumberValid = false;
        } else if (!$(PHONE_NUMBER_ID).val()) {


            document.getElementById(PHONE_NUMBER_ERROR).innerHTML = EMPTY_PHONE_NUMBER_FIELD_ERROR;
            this.isPhoneNumberValid = false;
        } else if (userMaster) {

            var existingPhoneNumber = true; 
            userMaster.forEach(field => {
                if ((field.user_phone.trim().toLowerCase() == $(PHONE_NUMBER_ID).val().trim().toLowerCase()) &&
                (field.user_name.trim().toLowerCase() != $(USERNAME_ID).val().trim().toLowerCase())) {

                    existingPhoneNumber = false;
 
                    document.getElementById(PHONE_NUMBER_ERROR).innerHTML = PHONE_NO_EXISTS;
                    this.isPhoneNumberValid = false;
                } else if ((field.user_phone.trim().toLowerCase() == $(PHONE_NUMBER_ID).val().trim().toLowerCase()) &&
                (field.user_name.trim().toLowerCase() == $(USERNAME_ID).val().trim().toLowerCase())) {
              
                    existingPhoneNumber = false;
                    this.isPhoneNumberValid = true;
                } 
            });
            
            if(existingPhoneNumber){
                this.isPhoneNumberValid = true;
            }
        } else {

            this.isPhoneNumberValid = true;
        }
    }


    // this.userArray.forEach(function (field) {
    //     if (isAdded == false && field != PASSWORD_FIELD || isAdded == true) {
    //         var inputFieldValue = document.forms[USER_FORM][field].value;
    //         if (!inputFieldValue) {
    //             document.getElementById(field + ERROR).innerHTML = field.charAt(0).toUpperCase() +
    //                 field.substr(1) + EMPTY_FIELD_ERROR;
    //             this.isSubmitted = false;
    //         } else {
    //             this.isSubmitted = true;
    //         }
    //     }
    // });
    for (let index = 0; index < userArray.length; index++) {
        const idElement = userArray[index];
        const displayElement = DISPLAY_ARRAY[index];
        if (isAdded == false && idElement != PASSWORD_FIELD || isAdded == true) {
            var inputFieldValue = document.forms[USER_FORM][idElement].value;
            if (!inputFieldValue) {
                document.getElementById(idElement + ERROR).innerHTML = displayElement.charAt(0).toUpperCase() +
                    displayElement.substr(1) + EMPTY_FIELD_ERROR;
                this.isSubmitted = false;
            } else {
                this.isSubmitted = true;
            }
        }
    }
}

// Adding new Row and its data in the table when admin add new user
function addNewUserRow(user) {
  
        var addRow = '<tr class="data-row"><td title="' + user.user_name + '" id="user_' + user.user_name + '_username" value="' +
        user.user_name + '">' + user.user_name + '</td><td title="' + user.full_name + '" id="user_' +
        user.user_name + '_full_name" value="' + user.full_name + '">' + user.full_name +
        '</td><td title="' + user.email_id + '" id="user_' + user.user_name + '_email" value="' + user.user_name + '">' +
        user.email_id + '</td><td title="' + user.user_phone + '" id="user_' + user.user_phone + '" value="' + user.user_phone +
        '">' + user.user_phone +'</td><td><input type="button" class="button" id ="user_' + user.user_name + '_button" src="../static/assets/edit.png" onClick="enableDisableUser(\'' +
        user.user_name + '\')"></td><td title="' + user.user_role + '" id="user_' + user.user_name + '_user_role" value="' +
        user.user_role + '">' + user.user_role +
        '</td><td><img class="action-icons" src="../static/assets/edit.png" onClick="openEditForm(\'' +
        user.user_name + '\')"><img class="delete-modal action-icons" data-backdrop="static" data-toggle="modal" data-id="' + user.user_name +
        '" data-target="#deleteModal" src="../static/assets/delete.png"></td></tr>';    
        $(TABLE).append(addRow);
        
        if (user.enabled =="enabled"){
            $('#user_' + user.user_name + '_button').val('Disable');

        }else{
            $('#user_' + user.user_name + '_button').val('Enable');
        }
}

// Search Function
function searchRecords() {
    event.preventDefault();
    search = $(SEARCH_KEY_ID).val().trim()
    pageOffset = 1;
    updateList();
    resetPagination();

}

// Listing all the users
function listUsers(userList) {

    if (userList == 0) {
        document.getElementById(NO_RECORD_CONTAINER).style.display = FLEX;
    } else {
        document.getElementById(NO_RECORD_CONTAINER).style.display = NONE;
    }
    $(DATA_ROW).remove();
    userList.forEach(user => {
        addNewUserRow(user);
    });
    this.tableData = userList;
}

// Sorting function
function sortHeader(sortColumn) {

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
        search: $(SEARCH_KEY_ID).val().trim(),
        pageLimit: 10,
        pageOffset: pageOffset,
        sortType: sortType,
        sortColumn: sortColumn,
    });
    $.ajax({
        type: POST,
        url: '',
        data: this.reqBody,
        success: function (data) {

            $(TOTAL_RECORDS_ID).val(data.result.totalRecords).trigger(CHANGE);
            listUsers(data.result.userList);
        },
        error: function (err) {
            console.log(err);
            // location.href = USER_LISTING_URL;
        }
    });
}

// Setting the Page Offset
function setPageOffset(offset) {
    pageOffset = offset;
    updateList();
}

// Common function for updating the list after searching and sorting the list
function updateList() {
    var reqBody = JSON.stringify({
        search: search,
        pageLimit: 10,
        pageOffset: pageOffset,
        sortColumn: sortColumn,
        sortType: sortType
    });
    $.ajax({
        type: POST,
        url: "",
        data: reqBody,
        success: function (data) {
            $(TOTAL_RECORDS_ID).val(data.result.totalRecords).trigger(CHANGE);
            listUsers(data.result.userList);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

////////////// toaster

function toasterFunction(status) {
    var toaster = document.getElementById("toaster-container");
    toaster.className = "show";
    if (status.status == 200) {
        toaster.style.backgroundColor = 'green';
    } else {
        toaster.style.backgroundColor = 'red';
    }
    document.getElementById("snackbar").innerHTML = status.message;
    setTimeout(function () {
        toaster.className = toaster.className.replace("show", "");
    }, 5000);
}
function closeToaster() {
    var toaster = document.getElementById("toaster-container");
    toaster.className = "show";
    toaster.className = toaster.className.replace("show", "");
}
////////////////////////////////////////////////// Cookie ///////////////////////////////////////////////