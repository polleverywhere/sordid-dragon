// jQuery the Sordid Dragon
// Copyright 2014 Poll Everywhere
// Paul Cortens & Mike Foley
// https://github.com/polleverywhere/sordid-dragon
// Version 0.0.5

(function ($) {
  $.fn.sordidDragon = function (options) {
    var $parent = this;

    // Used to store the current mouse position for browsers that don't expose
    // that on "drag" events.
    var customPageY;

    var $ghost = $("<div></div>");
    $ghost.addClass("sordidDragon-ghost");
    $ghost.css({position: "fixed"});
    var hideGhost = function() {
      $ghost.css({
        left: "-999999px",
        top: "-999999px",
        width: "0px",
        opacity: 0
      });
    };
    hideGhost();
    $parent.append($ghost);


    var $childBeingMoved;

    var positions;
    var calculatePositions = function() {
      if (!positions) {
        positions = [];

        $parent.children().each(function(_, child) {
          var $child = $(child);
          positions.push([
            $child.offset().top,
            $child.offset().top + $child.outerHeight()
          ]);
        });
      }

      return positions;
    };

    var isTouch = function(e) {
      return (/touch/).test(e.type);
    };

    // In most (but not all) browsers that support drag events, the browser will
    // create a ghost under the cursor for us. That doesn't happen with touch
    // events, so we create one ourselves.
    var useGhost = function(e) {
      return isTouch(e) || ($.browser.ie && parseInt($.browser.version, 10) == 8) || ($.browser.ie && parseInt($.browser.version, 10) == 9);
    };

    var preventTouchDefault = function(e) {
      if ( isTouch(e) ) {
        e.preventDefault();
      }
    };

    $parent.children().each(function(_, child) {
      var $child = $(child);
      $child.attr("draggable", "true");

      // Setting draggable=true doesn't work in IE8 and IE9. We must call dragDrop().
      if ( $.browser.ie && (parseInt($.browser.version, 10) == 8 || parseInt($.browser.version, 10) == 9 )) {
        $child.on("selectstart.sordidDragon", function() {
          if (this.dragDrop) {
            this.dragDrop();
          }
          return false;
        });
      }


      // IE8 and IE10 won't ever tell us the _current_ position of the mouse,
      // not even during drag, dragenter, or dragover events. Instead we look
      // at the position of the child element that the event is triggered on
      // because it is (by definition) under the mouse cursor.
      if ( $.browser.ie && (parseInt($.browser.version, 10) == 8 || parseInt($.browser.version, 10) == 10 )) {
        $child.on("dragenter.sordidDragon", function(e) {
          customPageY = $child.offset().top + ($child.outerHeight() / 2);
        });
      }

      // Firefox and IE 11 won't tell us the position of the mouse during drag
      // events. But they will for dragover (and dragenter) events, so we store
      // that so we can use it in the drag events.
      if ( $.browser.mozilla || ($.browser.ie && parseInt($.browser.version, 10) == 11)) {
        $child.on("dragover.sordidDragon", function(e) {
          customPageY = e.originalEvent.pageY;
        });
      }


      var currentPosition = function(pageY) {
        for (var i = 0, positionsLength = positions.length; i < positionsLength; i++) {
          if ( pageY >= positions[i][0] && pageY < positions[i][1] ) {
            return i;
          }
        }
      };


      $child.on("touchstart.sordidDragon dragstart.sordidDragon", function(e) {
        // We must pre-cache the positions after they have been rendered, but
        // before anything has changed. Otherwise the extra elements we create
        // during the drag process will interfere.
        calculatePositions();


        // Firefox won't trigger "drag" events without this.
        var dt = e.originalEvent.dataTransfer;
        if ( dt ) {
          dt.setData("text", "");
        }

        if ( useGhost(e) ) {
          $ghost.html($child.clone());
        }

        // Windows touch devices (such as the Microsoft Surface Pro 3) will end
        // the drag event early (and not call dragend) if the element being
        // dragged is moved in the DOM by JavaScript.
        // To work around that problem we:
        //   1) clone the element being moved
        //   2) hide the element being moved
        //   3) move the clone around in the DOM
        // Then we clean it all up in the dragend event.
        $childBeingMoved = $child.clone();

        preventTouchDefault(e);
      });


      $child.on("touchmove.sordidDragon drag.sordidDragon", function(e) {
        // Hide the element being moved and replace it with the clone.
        $child.hide();
        if (!$childBeingMoved.is(":visible") ) {
          $child.after($childBeingMoved);
        }

        var pageY;
        if ( customPageY ) {
          // This must be before the general Desktop option (e.originalEvent.pageY)
          // because in IE10/11 that value is set, but it will be the starting
          // position of the mouse, which is not what we want here.
          pageY = customPageY;
        } else if ( e.originalEvent.targetTouches ) {
          // Touch devices
          pageY = e.originalEvent.targetTouches[0].pageY;
        } else {
          // Desktop devices
          pageY = e.originalEvent.pageY;
        }

        if ( useGhost(e) ) {
          $ghost.css({
            left: $child.offset().left,
            top: pageY - ($child.outerHeight() / 2),
            width: $child.outerWidth(),
            opacity: 1
          });
        }

        $childBeingMoved.css({
          opacity: 0.5
        });

        var newPosition = currentPosition(pageY);

        if (typeof newPosition !== "undefined") {
          var $children = $parent.children(":visible");
          var $moveTo = $children.eq(newPosition);

          if (newPosition > $children.index($childBeingMoved)) {
            $moveTo.after($childBeingMoved.detach());
          } else if (newPosition < $children.index($childBeingMoved)) {
            $moveTo.before($childBeingMoved.detach());
          }
        }

        preventTouchDefault(e);
      });


      $child.on("touchend.sordidDragon dragend.sordidDragon", function(e) {
        $childBeingMoved.after($child);
        $childBeingMoved.remove();
        $child.show();

        if ( useGhost(e) ) {
          hideGhost();
        }

        preventTouchDefault(e);
      });
    });
  };
})(jQuery);
