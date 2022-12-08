// json
var langJSON = {
    "en" : {
      "language"         : "Language",
      "chatroom"         : "Join UWC Chat Room",
      "name"             : "Please type in your nickname:",
      "exit"             : "Exit",
      "join"             : "Join",
      "send"             : "Send",
    },
  
    "vn" : {
      "language"         : "Ngôn ngữ",
      "chatroom"         : "Tham Gia Nhắn Tin",
      "name"             : "Hãy chọn biệt danh của bạn:",
      "exit"             : "Thoát",
      "join"             : "Tham gia",
      "send"             : "Gửi",
      "innerchat"        : "Phòng nhắn tin"
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
