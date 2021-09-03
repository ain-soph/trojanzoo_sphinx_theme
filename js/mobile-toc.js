window.mobileTOC = {
  bind: function() {
    $("[data-behavior='toggle-table-of-contents']").on("click", function(e) {
      e.preventDefault();

      var $parent = $(this).parent();

      if ($parent.hasClass("is-open")) {
        $parent.removeClass("is-open");
        $(".sphinx-template-left-menu").slideUp(200, function() {
          $(this).css({display: ""});
        });
      } else {
        $parent.addClass("is-open");
        $(".sphinx-template-left-menu").slideDown(200);
      }
    });
  }
}
