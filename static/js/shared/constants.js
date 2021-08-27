//Common Constants
var HIDE = "hide";
var COLOR = "color";
var WHITE_COLOR = "white";
var READ_ROLE = "Read";
var WRITE_ROLE = "Write";
var NONE = "none";
var TOTAL_RECORDS_ID = "#totalRecords";
var TABLE_FOOTER_ID = "#tableFooter";
var DISABLED = 'disabled';
var MODAL = "#myModal";
var MODAL_HEADER = "#modal_header";
var TOGGLE = "toggle";
var CLICK = "click";
var DELETE_MODAL = ".delete-modal";
var ID = 'id';
var DELETE_ID = ".footer #delete";
var DELETE_CLASS = ".delete-close"
var POST = "POST";
var DELETE = "delete";
var ADD = "add";
var UPDATE = "update";
var FLEX = 'flex';
var SUBMIT_BTN_NAME = "SUBMIT";
var ADMIN = 'Admin';
var TABLE = "table";
var SEARCH_KEY = "searchKey";
var SEARCH_KEY_ID = "#searchKey";
var NO_RECORD_CONTAINER = 'no-record-container';
var DATA_ROW = ".data-row";
var CHANGE = 'change';
var EMPTY_FIELD_ERROR = ' must be filled out';
var EDIT = 'edit';
var SUBMIT = "#submit";
var UPDATE_HEADER_NAME = "UPDATE";
var SUBMIT_BUTTON_NAME = "SUBMIT";


// Pattern Constants
var NAME_PATTERN = '^[a-zA-Z ]+$';
var EMAIL_PATTERN = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
var MOBILE_PATTERN = '^[0-9]{10}$';
var INTEGER_PATTERN = '^[0-9]+(\.[0-9]{1,2})?$';
var NUMBER_PATTERN = '^[0-9]*$';
var SPACE_PATTERN = /\s/g;


// Constants for URL paths
var USER_LISTING_URL = "http://56a16866.ngrok.io/users/";
var ADD_CATEGORY_URL_PATH = "http://56a16866.ngrok.io/categoryListing/Category-action/";
var EDIT_CATEGORY_URL_PATH = "http://56a16866.ngrok.io/categoryListing/Category-action/?catId=";
var CATEGORY_LISTING_URL_PATH = "http://56a16866.ngrok.io/categoryListing/";


// Constants for Header
var USER_FULLNAME_EXPIRY = "user_full_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
var USER_SESSION_EXPIRY = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
var LOGIN_SCREEN_PATH = "../";

//Constants for Side Navigation
var CATEGORY_LISTING_PATH = "/categoryListing/";
var USER_LISTING_PATH = "/users/";
var CATEGORY_ACTION_PATH = "/categoryListing/Category-action/";
var DRIVER_LISTING_PATH = "/DriverListing/";
var DRIVER_ACTION_PATH = "/DriverListing/driver-action/";
var FEEDBACK_LISTING_PATH = "/feedbackListing/";
var RIDE_CATEGORY_ID = "#rideCategory";
var USER_MANAGE_ID = "#userManage";
var DRIVER_MANAGE_ID = "#driverManage";
var FEEDBACK_MANAGE_ID = "#feedbackManage";
var USER_MANAGEMENT = 'UserManagement';
var USER_MANAGE_INDICATOR = ".rec-2";
var DRIVER_MANAGE_INDICATOR = ".rec-3";
var FEEDBACK_MANAGE_INDICATOR = ".rec-5";
var CATEGORY_MANAGE_INDICATOR = ".rec-1";
var NOTIFY_MANAGE_INDICATOR = ".rec-4";

// Constants for Pagination
var PAGE_OPTION_ONE_ID = "#pgnOpt1";
var PAGE_OPTION_TWO_ID = "#pgnOpt2";
var PAGE_OPTION_THREE_ID = "#pgnOpt3";
var PAGE_ACTIVE = "pageActive";
var PAGE_INACTIVE = "pageInactive";
var ACTIVE_INACTIVE_PAGE = "pageActive pageInactive";
var FIRST_PAGE = "#pgnFirst";
var PREVIOUS_PAGE = "#pgnPrevious";
var NEXT_PAGE = "#pgnNext";
var LAST_PAGE = "#pgnLast";
var FIRST_RECORD_NUMBER = "#firstRecordNum";
var LAST_RECORD_NUMBER = "#lastRecordNum";
var TOTAL_RECORD_NUMBER = "#totalRecordNum";

// Constants for User Management
var ERROR = "_error";
var USERNAME = 'user_name';
var USER_ID = 'user_id';
var USERID = "#userId";
var UPDATE_USER = "Update User";
var PASSWORD_ID = "#newPassword";
var NEW_PASSWORD = "New Password";
var USERNAME_ID = "#userName";
var FULLNAME_ID = "#fullName";
var EMAIL_ID = "#emailId";
var PHONE_NUMBER_ID = "#phoneNumber";
var PHONE_NO_EXISTS = "phone number already exists"
var USER_ROLE_ID = "#userRole";
var USER = "#user_";
var FULL_NAME = "_full_name";
var EMAIL = "_email";
var PHONE = "_phone";
var USERROLE = "_user_role";
var USER_ACTION_URL = "user-action/";
var PASSWORD = "#password";
var USER_FORM = 'userForm';
var PASSWORD_SECTION = 'password-section';
var ADD_USER = "Add User";
var USER__ID = 'userId';
var USER__ROLE = 'userRole';
var FULLNAME_ERROR = 'fullName_error';
var EMAIL_ID_ERROR = 'emailId_error';
var PHONE_NUMBER_ERROR = 'phoneNumber_error';
var USERNAME_ERROR = 'userName_error';
var EMPTY_FULLNAME_FIELD_ERROR = 'Full Name must be filled out';
var INVALID_FULLNAME = 'Invalid FullName';
var EMAIL_EXISTS = 'Email already exists';
var INVALID_EMAIL = 'Invalid Email';
var INVALID_NUMBER = 'Invalid Number';
var EMPTY_PHONE_NUMBER_FIELD_ERROR = 'Phone Number must be filled out';
var USERNAME_EXISTS = 'Username already exists';
var EMPTY_USERNAME_FIELD_ERROR = 'Enter a valid Username';
var PASSWORD_FIELD = "password";
var USER_ARRAY = ['fullName', 'emailId', 'userName', 'password', 'phoneNumber'];
var DISPLAY_ARRAY = ['Full Name', 'Email Id', 'User Name', 'Password', 'Phone Number'];
var USER_ARRAY_ERROR = ['Full Name', 'Email Id', 'User Name', 'Password', 'Phone Number'];

// Constants for Add Category
var ADDFORMHEADER = "#addFormHeader";
var UPDATE_CATEGORY = "UPDATE CATEGORY";
var CATEGORY_NAME = "#CategoryName";
var BASE_FARE = "#BaseFare";
var BASE_TIME = "#BaseTime";
var BASE_DISTANCE = "#BaseDistance";
var NUMBER_OF_SEATS = "#NumberofSeats";
var COST_MIN = "#CostMin";
var COST_KM = "#CostKm";
var DRIVER_MATCHING = "#DriverMatching";
var CANCELLATION_CHARGE = "#CancellationCharge";
var DRIVER_DISTRIBUTION = "#DriverDistribution";
var ESTIMATED_TIME_ARRIVAL = "#EstimatedTimeArrival";
var ADD_CATEGORY = "ADD CATEGORY";
var CATEGORY_ACION_PATH = "../Category-action/";
var CATEGORY_NAME_ID = 'CategoryName';
var CATEGORY_NAME_ERROR = 'CategoryName_error';
var INVALID_CATEGORY_NAME = 'Invalid CategoryName';
var NUMBER_OF_SEATS_ID = 'NumberofSeats';
var NUMBER_OF_SEATS_ERROR = 'NumberofSeats_error';
var INVALID_NUMBER_OF_SEATS = 'Invalid NumberofSeats';
var BASE_TIME_ID = 'BaseTime';
var BASE_TIME_ERROR = 'BaseTime_error';
var EMPTY_BASE_TIME_FIELD_ERROR = 'Enter a valid BaseTime';
var INVALID_BASE_TIME = 'Invalid BaseTime';
var BASE_FARE_ID = 'BaseFare';
var BASE_FARE_ERROR = 'BaseFare_error';
var EMPTY_BASE_FARE_FIELD_ERROR = 'Enter a valid BaseFare';
var INVALID_BASE_FARE = 'Enter BaseFare upto 2 decimal';
var BASE_DISTANCE_ID = 'BaseDistance';
var BASE_DISTANCE_ERROR = 'BaseDistance_error';
var EMPTY_BASE_DISTANCE_FIELD_ERROR = 'Enter a valid BaseDistance';
var INVALID_BASE_DISTANCE = 'Enter BaseDistance upto 2 decimal';
var EMPTY_NUMBER_OF_SEATS_FIELD_ERROR = 'Enter a valid Number of Seats';
var ROOT_URL = 'http://localhost:8000/';
// var ROOT_URL = 'http://543ee18a.ngrok.io/';

var SHOP_AND_INVENTORY_URL = 'http://localhost:8001/'

// Toaster message
var addSuccess = "Add operation successfull";
var addFail = "Add operation failed";
var deleteSuccess = "Delete operation successfull"