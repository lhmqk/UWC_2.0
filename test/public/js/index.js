//ACTIVE BUTTON SIDEBAR
$(function () {
  $(".sidebar-link").click(function () {
    $(".sidebar-link").removeClass("is-active");
    $(this).addClass("is-active");
  });
});
//MINIMIZE SIDEBAR
$(window)
  .resize(function () {
    if ($(window).width() > 1090) {
      $(".sidebar").removeClass("collapse");
    } else {
      $(".sidebar").addClass("collapse");
    }
  })
  .resize();
//TRAVERSE SECTIONS
$(function () {
  $(".logo, .logo-expand, .home").on("click", function (e) {
    $(".home-section").addClass("show");
    $(".view-section").removeClass("show");
    $(".assign-section").removeClass("show");
    $(".route-section").removeClass("show");
    $(".message-section").removeClass("show");
    $(".message-container").scrollTop(0);
  });
  $(".view").on("click", function (e) {
    $(".home-section").removeClass("show");
    $(".view-section").addClass("show");
    $(".assign-section").removeClass("show");
    $(".route-section").removeClass("show");
    $(".message-section").removeClass("show");
    $(".main-container").scrollTop(0);
    $(".sidebar-link").removeClass("is-active");
    $(".view").addClass("is-active");
  });
  $(".assign").on("click", function (e) {
    $(".home-section").removeClass("show");
    $(".view-section").removeClass("show");
    $(".assign-section").addClass("show");
    $(".route-section").removeClass("show");
    $(".message-section").removeClass("show");
    $(".main-container").scrollTop(0);
    $(".sidebar-link").removeClass("is-active");
    $(".assign").addClass("is-active");
  });
  $(".route").on("click", function (e) {
    $(".home-section").removeClass("show");
    $(".view-section").removeClass("show");
    $(".assign-section").removeClass("show");
    $(".route-section").addClass("show");
    $(".message-section").removeClass("show");
    $(".main-container").scrollTop(0);
    $(".sidebar-link").removeClass("is-active");
    $(".route").addClass("is-active");
  });
  $(".message").on("click", function (e) {
    $(".home-section").removeClass("show");
    $(".view-section").removeClass("show");
    $(".assign-section").removeClass("show");
    $(".route-section").removeClass("show");
    $(".message-section").addClass("show");
    $(".main-container").scrollTop(0);
    $(".sidebar-link").removeClass("is-active");
    $(".message").addClass("is-active");
  });
});
