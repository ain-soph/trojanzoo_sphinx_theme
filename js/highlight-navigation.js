// Modified from https://stackoverflow.com/a/32396543
window.highlightNavigation = {
  navigationListItems: document.querySelectorAll("#sphinx-template-right-menu li"),
  sections: document.querySelectorAll(".sphinx-template-article section section"),
  sectionIdTonavigationLink: {},

  bind: function() {
    if (!sideMenus.displayRightMenu) {
      return;
    };

    for (var i = 0; i < highlightNavigation.sections.length; i++) {
      var id = highlightNavigation.sections[i].id;
      highlightNavigation.sectionIdTonavigationLink[id] =
        document.querySelectorAll('#sphinx-template-right-menu li a[href="#' + id + '"]')[0];
    }

    $(window).scroll(utilities.throttle(highlightNavigation.highlight, 100));
  },

  highlight: function() {
    var rightMenu = document.getElementById("sphinx-template-right-menu");

    // If right menu is not on the screen don't bother
    if (rightMenu.offsetWidth === 0 && rightMenu.offsetHeight === 0) {
      return;
    }

    var scrollPosition = utilities.scrollTop();
    var OFFSET_TOP_PADDING = 25;
    var offset = document.getElementById("header-holder").offsetHeight +
                 document.getElementById("sphinx-template-page-level-bar").offsetHeight +
                 OFFSET_TOP_PADDING;

    var sections = highlightNavigation.sections;

    for (var i = (sections.length - 1); i >= 0; i--) {
      var currentSection = sections[i];
      var sectionTop = utilities.offset(currentSection).top;

      if (scrollPosition >= sectionTop - offset) {
        var navigationLink = highlightNavigation.sectionIdTonavigationLink[currentSection.id];
        var navigationListItem = utilities.closest(navigationLink, "li");

        if (navigationListItem && !navigationListItem.classList.contains("active")) {
          for (var i = 0; i < highlightNavigation.navigationListItems.length; i++) {
            var el = highlightNavigation.navigationListItems[i];
            if (el.classList.contains("active")) {
              el.classList.remove("active");
            }
          }

          navigationListItem.classList.add("active");

          // Scroll to active item. Not a requested feature but we could revive it. Needs work.

          // var menuTop = $("#sphinx-template-right-menu").position().top;
          // var itemTop = navigationListItem.getBoundingClientRect().top;
          // var TOP_PADDING = 20
          // var newActiveTop = $("#sphinx-template-side-scroll-right").scrollTop() + itemTop - menuTop - TOP_PADDING;

          // $("#sphinx-template-side-scroll-right").animate({
          //   scrollTop: newActiveTop
          // }, 100);
        }

        break;
      }
    }
  }
};
