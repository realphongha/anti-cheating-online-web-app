// Colors
export const blue = "#59ADFF";
export const darkBlue = "#022E69";
export const white = "#FFFFFF";
export const black = "#000000";
export const yellow = "#FBFC39";
export const red = "#F34607";
export const green = "#3BF516";
export const lightGray = "#F0F0F0";
export const gray = "#808080";
export const slightGray = "#D3D3D3";

// URLs
export const backend = "http://20.247.88.157:5000";


// User
export const USER_STATUS_LOCKED = 0;
export const USER_STATUS_ACTIVE = 1;
export const USER_STATUS = {
    0: "Đã khóa", 
    1: "Đang hoạt động"
};
export const USER_STATUS_MAP = Object.keys(USER_STATUS).map(key => 
    new Object({id: key, name: USER_STATUS[key]})
);
export const USER_ROLE_ADMIN = 1;
export const USER_ROLE_SUPERVISOR = 2;
export const USER_ROLE_STUDENT = 3;
export const USER_ROLE = {
    1: "Quản trị viên",
    2: "Giám thị",
    3: "Học sinh"
}
export const USER_ROLE_MAP = Object.keys(USER_ROLE).map(key => 
    new Object({id: key, name: USER_ROLE[key]})
);
export const MAX_SIZE_AVATAR = 1000000;

// Class
export const CLASS_STATUS_DELETED = 0;
export const CLASS_STATUS_ACTIVE = 1;
export const CLASS_STATUS = {
    0: "Đã xóa", 
    1: "Đang hoạt động"
}
export const CLASS_STATUS_MAP = Object.keys(CLASS_STATUS).map(key => 
    new Object({id: key, name: CLASS_STATUS[key]})
);

// Cheating types
export const NO_CHEATING = 0;
export const CHEATING_PERSONS = 1;
export const CHEATING_LAPTOP = 2;
export const CHEATING_MOUSE = 3;
export const CHEATING_KEYBOARD = 4;
export const CHEATING_WRONG_POSE = 5;
export const EXCEPTION_HAPPENED = 6;
export const NO_IMAGE = 7;

// DB
export const DB_CHEATINGS_COLLECTION = "cheatings";
export const DB_CLASSES_COLLECTION = "classes";
export const DB_USERS_COLLECTION = "users";

// Token
export const TOKEN_EXPIRED_DAYS = 14;

// Exam
export const MAX_SUPERVISING_IMAGES = 21;
export const PATIENCE_SUPERVISING_IMAGES = 20000;  // ms
export const INTERVAL_BROADCAST_SID = 5000;  // ms
export const INTERVAL_CHECKING_IMAGES = 10000;  // ms 
export const NOT_REQUESTED_STATUS = 0;
export const REQUESTING_STATUS = 1;
export const ENDED_STATUS = 2;