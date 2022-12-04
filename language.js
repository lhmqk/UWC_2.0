// json
var langJSON = {
    "en" : {
      "language"     : "Language",
      "projectTitle"     : "URBAN WASTE COLLECTION AID",
      "signIn"           : "Sign In",
      "signIn2"          : "Sign In",
      "noacc"            : "Have no account?",
      "google"           : "Sign in with Google",
      "forgot"           : "Forgot password",
      "assign"           : "Assign",
      "home"             : "Home",
      "view"             : "View",
      "route"            : "Route",
      "mess"             : "Message",
      "about"            : "About Us:",
      "teamdev"          : "Development Team from HCMUT",
      "subject"          : "Software Engineering - Class CC05",
      "sysinfo"          : "System Information:",
      "ver"              : "Version 2.0",
      "verinfo"          : "Enhancing from Version 1.0 with reuse data",
      "contact"          : "Contact Us:",
      "tel"              : "Tel: 0254.3456.789",
      "chatroom"         : "Join UWC Chat Room",
      "name"             : "Please type in your nickname:",
    },
  
    "vn" : {
      "language"     : "Ngôn ngữ",
      "projectTitle"     : "Hệ thống hỗ trợ thu gom rác thải đô thị",
      "signIn"           : "Đăng nhập",
      "signIn2"          : "Đăng nhập",
      "noacc"            : "Bạn không có tài khoản?",
      "google"           : "Đăng nhập bằng Google",
      "forgot"           : "Quên mật khẩu",
      "assign"           : "Phân công",
      "home"             : "Trang chủ",
      "view"             : "Hiển thị",
      "route"            : "Tuyến đường",
      "mess"             : "Tin nhắn",
      "about"            : "Giới thiệu:",
      "teamdev"          : "Đội ngũ phát triển từ ĐHBK-TPHCM",
      "subject"          : "Lớp CC05-Công nghệ phần mềm",
      "sysinfo"          : "Về hệ thống:",
      "ver"              : "Phiên bản 2.0",
      "verinfo"          : "Nâng cấp và tái sử dụng dữ liệu từ bản 1.0",
      "contact"          : "Liên lạc:",
      "tel"              : "Số điện thoại: 0254.3456.789",
      "chatroom"         : "Tham Gia Nhắn Tin",
      "name"             : "Hãy chọn biệt danh của bạn:",
    }
  }
  
  // run function after page load :: get/set localstorage value and run function
  document.addEventListener("DOMContentLoaded", function(event) {
    var appLang = localStorage.getItem('lang');
  
    // if no language value saved in local-storage, set en as default
    if(appLang === null){
      localStorage.setItem('lang', 'vn'); // updaet local-storage
  
      // fun contentUpdate function with en value
      contentUpdate('vn'); 
  
      // select radiobutton which has data-value = en
      document.querySelector('[data-value="vn"]').checked = true; 
    }
    else{
      // fun contentUpdate function with value from local-storage - en, ru..
      contentUpdate(appLang); 
  
      // select radiobutton which has data-value == local storage value
      document.querySelector('[data-value="'+appLang+'"]').checked = true;
    }
  });
  
  // change innerhtml on radiobtn click
  function changeLang(langVal){
    // set local-storage lang value from value given in onchange="changeLang(value)"
    localStorage.setItem('lang', langVal);
  
    // fun contentUpdate function with value from onchange="changeLang(value)"
    contentUpdate(langVal);
  }
  
  // content/innerhtml update/assign
  function contentUpdate(cl){
    // get current langage contents in array
    var currLang = Object.entries(langJSON)[Object.keys(langJSON).indexOf(cl)][1],
        // get current language content array length
        langCont = Object.entries(currLang).length;
  
    for(let i = 0; i < langCont; i++){
      // get selectors which has .langchange classes
      var getSelector = document.querySelectorAll('.langchange')[i],
          // get data-key attribute from .langchange class selectors
          getAttr = getSelector.getAttribute('data-key');
  
      // assign the data-key value from current language array to the .langchange[data-key] selector
      getSelector.innerHTML = currLang[getAttr];
    }
  }
