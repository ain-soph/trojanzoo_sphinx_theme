var jQuery = (typeof(window) != 'undefined') ? window.jQuery : require('jquery');

// Sphinx theme nav state
function ThemeNav () {

    var nav = {
        navBar: null,
        win: null,
        winScroll: false,
        winResize: false,
        linkScroll: false,
        winPosition: 0,
        winHeight: null,
        docHeight: null,
        isRunning: false
    };

    nav.enable = function (withStickyNav) {
        var self = this;

        // TODO this can likely be removed once the theme javascript is broken
        // out from the RTD assets. This just ensures old projects that are
        // calling `enable()` get the sticky menu on by default. All other cals
        // to `enable` should include an argument for enabling the sticky menu.
        if (typeof(withStickyNav) == 'undefined') {
            withStickyNav = true;
        }

        if (self.isRunning) {
            // Only allow enabling nav logic once
            return;
        }

        self.isRunning = true;
        jQuery(function ($) {
            self.init($);

            self.reset();
            self.win.on('hashchange', self.reset);

            if (withStickyNav) {
                // Set scroll monitor
                self.win.on('scroll', function () {
                    if (!self.linkScroll) {
                        if (!self.winScroll) {
                            self.winScroll = true;
                            requestAnimationFrame(function() { self.onScroll(); });
                        }
                    }
                });
            }

            // Set resize monitor
            self.win.on('resize', function () {
                if (!self.winResize) {
                    self.winResize = true;
                    requestAnimationFrame(function() { self.onResize(); });
                }
            });

            self.onResize();
        });

    };

    // TODO remove this with a split in theme and Read the Docs JS logic as
    // well, it's only here to support 0.3.0 installs of our theme.
    nav.enableSticky = function() {
        this.enable(true);
    };

    nav.init = function ($) {
        var doc = $(document),
            self = this;

        this.navBar = $('div.sphinx-template-side-scroll:first');
        this.win = $(window);

        // Set up javascript UX bits
        $(document)
            // Shift nav in mobile when clicking the menu.
            .on('click', "[data-toggle='sphinx-template-left-menu-nav-top']", function() {
                $("[data-toggle='sphinx-template-nav-shift']").toggleClass("shift");
                $("[data-toggle='rst-versions']").toggleClass("shift");
            })

            // Nav menu link click operations
            .on('click', ".sphinx-template-menu-vertical .current ul li a", function() {
                var target = $(this);
                // Close menu when you click a link.
                $("[data-toggle='sphinx-template-nav-shift']").removeClass("shift");
                $("[data-toggle='rst-versions']").toggleClass("shift");
                // Handle dynamic display of l3 and l4 nav lists
                self.toggleCurrent(target);
                self.hashChange();
            })
            .on('click', "[data-toggle='rst-current-version']", function() {
                $("[data-toggle='rst-versions']").toggleClass("shift-up");
            })

        // Make tables responsive
        $("table.docutils:not(.field-list,.footnote,.citation)")
            .wrap("<div class='sphinx-template-table-responsive'></div>");

        // Add extra class to responsive tables that contain
        // footnotes or citations so that we can target them for styling
        $("table.docutils.footnote")
            .wrap("<div class='sphinx-template-table-responsive footnote'></div>");
        $("table.docutils.citation")
            .wrap("<div class='sphinx-template-table-responsive citation'></div>");

        // Add expand links to all parents of nested ul
        $('.sphinx-template-menu-vertical ul').not('.simple').siblings('a').each(function () {
            var link = $(this);
                expand =
                    $('<span class="toctree-expand"></span>');
            expand.on('click', function (ev) {
                self.toggleCurrent(link);
                ev.stopPropagation();
                return false;
            });
            link.prepend(expand);
        });
    };

    nav.reset = function () {
        // Get anchor from URL and open up nested nav
        var anchor = encodeURI(window.location.hash) || '#';

        try {
            var vmenu = $('.sphinx-template-menu-vertical');
            var link = vmenu.find('[href="' + anchor + '"]');
            if (link.length === 0) {
                // this link was not found in the sidebar.
                // Find associated id element, then its closest section
                // in the document and try with that one.
                var id_elt = $('.document [id="' + anchor.substring(1) + '"]');
                var closest_section = id_elt.closest('section section');
                link = vmenu.find('[href="#' + closest_section.attr("id") + '"]');
                if (link.length === 0) {
                    // still not found in the sidebar. fall back to main section
                    link = vmenu.find('[href="#"]');
                }
            }
            // If we found a matching link then reset current and re-apply
            // otherwise retain the existing match
            if (link.length > 0) {
                $('.sphinx-template-menu-vertical .current')
                    .removeClass('current')
                    .attr('aria-expanded','false');
                link.addClass('current')
                    .attr('aria-expanded','true');
                link.closest('li.toctree-l1')
                    .parent()
                    .addClass('current')
                    .attr('aria-expanded','true');
                for (let i = 1; i <= 10; i++) {
                    link.closest('li.toctree-l' + i)
                        .addClass('current')
                        .attr('aria-expanded','true');
                }
                link[0].scrollIntoView();
            }
            $('.sphinx-template-menu-vertical li.toctree-l1')
                .attr('aria-expanded','true');
        }
        catch (err) {
            console.log("Error expanding nav for anchor", err);
        }

    };

    nav.onScroll = function () {
        this.winScroll = false;
        var newWinPosition = this.win.scrollTop(),
            winBottom = newWinPosition + this.winHeight,
            navPosition = this.navBar.scrollTop(),
            newNavPosition = navPosition + (newWinPosition - this.winPosition);
        if (newWinPosition < 0 || winBottom > this.docHeight) {
            return;
        }
        this.navBar.scrollTop(newNavPosition);
        this.winPosition = newWinPosition;
    };

    nav.onResize = function () {
        this.winResize = false;
        this.winHeight = this.win.height();
        this.docHeight = $(document).height();
    };

    nav.hashChange = function () {
        this.linkScroll = true;
        this.win.one('hashchange', function () {
            this.linkScroll = false;
        });
    };

    nav.toggleCurrent = function (elem) {
        var parent_li = elem.closest('li');
        parent_li
            .siblings('li.current')
            .removeClass('current')
            .attr('aria-expanded','false');
        parent_li
            .siblings()
            .find('li.current')
            .removeClass('current')
            .attr('aria-expanded','false');
        var children = parent_li.find('> ul li');
        // Don't toggle terminal elements.
        if (children.length) {
            children
                .removeClass('current')
                .attr('aria-expanded','false');
            parent_li
                .toggleClass('current')
                .attr('aria-expanded', function(i, old) {
                    return old == 'true' ? 'false' : 'true';
                });
        }
    }

    return nav;
};

module.exports.ThemeNav = ThemeNav();

if (typeof(window) != 'undefined') {
    window.SphinxRtdTheme = {
        Navigation: module.exports.ThemeNav,
        // TODO remove this once static assets are split up between the theme
        // and Read the Docs. For now, this patches 0.3.0 to be backwards
        // compatible with a pre-0.3.0 layout.html
        StickyNav: module.exports.ThemeNav,
    };
}


// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// https://gist.github.com/paulirish/1579671
// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

$(".sphx-glr-thumbcontainer").removeAttr("tooltip");
$("table").removeAttr("border");

//This code handles the Expand/Hide toggle for the Docs left nav items

$(document).ready(function() {
  var caption = "#sphinx-template-left-menu p.caption";
  var collapseAdded = $(this).not("checked");
  $(caption).each(function () {
    var menuName = this.innerText.replace(/[^\w\s]/gi, "").trim();
    $(this).find("span").addClass("checked");
    if (collapsedSections.includes(menuName) == true && collapseAdded && sessionStorage.getItem(menuName) !== "expand" || sessionStorage.getItem(menuName) == "collapse") {
      $(this.firstChild).after("<span class='expand-menu'>[ + ]</span>");
      $(this.firstChild).after("<span class='hide-menu collapse'>[ - ]</span>");
      $(this).next("ul").hide();
    } else if (collapsedSections.includes(menuName) == false && collapseAdded || sessionStorage.getItem(menuName) == "expand") {
      $(this.firstChild).after("<span class='expand-menu collapse'>[ + ]</span>");
      $(this.firstChild).after("<span class='hide-menu'>[ - ]</span>");
    }
  });

  $(".expand-menu").on("click", function () {
    $(this).prev(".hide-menu").toggle();
    $(this).parent().next("ul").toggle();
    var menuName = $(this).parent().text().replace(/[^\w\s]/gi, "").trim();
    if (sessionStorage.getItem(menuName) == "collapse") {
      sessionStorage.removeItem(menuName);
    }
    sessionStorage.setItem(menuName, "expand");
    toggleList(this);
  });

  $(".hide-menu").on("click", function () {
    $(this).next(".expand-menu").toggle();
    $(this).parent().next("ul").toggle();
    var menuName = $(this).parent().text().replace(/[^\w\s]/gi, "").trim();
    if (sessionStorage.getItem(menuName) == "expand") {
      sessionStorage.removeItem(menuName);
    }
    sessionStorage.setItem(menuName, "collapse");
    toggleList(this);
  });

  function toggleList(menuCommand) {
    $(menuCommand).toggle();
  }
});

// Jump back to top on pagination click

$(document).on("click", ".page", function() {
    $('html, body').animate(
      {scrollTop: $("#dropdown-filter-tags").position().top},
      'slow'
    );
});

$(".stars-outer > i").hover(function() {
    $(this).prevAll().addBack().toggleClass("fas star-fill");
});

$(".stars-outer > i").on("click", function() {
    $(this).prevAll().each(function() {
        $(this).addBack().addClass("fas star-fill");
    });

    $(".stars-outer > i").each(function() {
        $(this).unbind("mouseenter mouseleave").css({
            "pointer-events": "none"
        });
    });
})

$("#sphinx-template-side-scroll-right").on("click", "a.reference.internal", function (e) {
  var href = $(this).attr("href");
  href.replace('.', '\\.');
  $('html, body').stop().animate({
    scrollTop: $(href).offset().top - 100
  }, 850);
  e.preventDefault;
});

var lastId,
  topMenu = $("#sphinx-template-side-scroll-right"),
  topMenuHeight = topMenu.outerHeight() + 1,
  // All sidenav items
  menuItems = topMenu.find("a[href^='#']"),
  // Anchors for menu items
  scrollItems = {};
  for (var i = 0; i < menuItems.length; i++) {
    var ref = menuItems[i].getAttribute("href").replaceAll('.', '\\.');
    if (ref.length > 1 && $(ref).length) {
      scrollItems[ref] = menuItems[i];
    }
  }

$(window).scroll(function () {
  var article = Object.keys(scrollItems).join(', ');

  $(article).each(function () {
    var offsetScroll = $(this).offset().top - $(window).scrollTop();
    if (
      offsetScroll <= 120 &&
      offsetScroll >= -120 &&
      $(".hidden:visible")
    ) {
      $(menuItems).removeClass("side-scroll-highlight");
      $(scrollItems['#' + this.id.replaceAll('.', '\\.')]).addClass("side-scroll-highlight");
    }
  });
});

