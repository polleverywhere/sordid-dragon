// jQuery the Sordid Dragon
// Copyright 2014 Poll Everywhere
// Paul Cortens & Mike Foley
// https://github.com/polleverywhere/sordid-dragon
// Version 0.0.5

(function ($) {
  $.fn.sordidDragon = function (options) {
    var $parent = this;

    // The $ghost is a faded copy of the element that moves with the mouse or
    // finger.
    // In most (but not all) browsers that support drag events, the browser will
    // create a ghost under the cursor for us. That doesn't happen with touch
    // events, so we create one ourselves.
    // In IE9 the browser won't create a ghost for us. However, if we show the
    // ghost in IE9, then the dragenter events won't fire (because the browser
    // always thinks you are dragging over the ghost, not the items in the
    // list.)
    // IE8 also doesn't create a ghost for us. However, showing the ghost in
    // IE8 makes the UI choppy.
    // Therefore, we only show this ghost for touch devices.
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
      positions = [];

      $parent.children().each(function(_, child) {
        var $child = $(child);
        positions.push([
          $child.offset().top,
          $child.offset().top + $child.outerHeight()
        ]);
      });

      return positions;
    };

    var currentPosition = function(pageY) {
      for (var i = 0, positionsLength = positions.length; i < positionsLength; i++) {
        if ( pageY >= positions[i][0] && pageY < positions[i][1] ) {
          return i;
        }
      }
    };

    var isTouch = function(e) {
      return (/touch/).test(e.type);
    };

    var preventTouchDefault = function(e) {
      if ( isTouch(e) ) {
        e.preventDefault();
      }
    };

    var moveChild = function($besideChild) {
      var $children = $parent.children(":visible");
      var newPosition = $children.index($besideChild);
      var oldPosition = $children.index($childBeingMoved);

      if (newPosition > oldPosition) {
        $besideChild.after($childBeingMoved);
      } else if (newPosition < oldPosition) {
        $besideChild.before($childBeingMoved);
      }
    };


    $parent.children().not(".sordidDragon-ghost").each(function(_, child) {
      var $child = $(child);
      $child.attr("draggable", "true");

      // Setting draggable=true doesn't work in IE8 and IE9. We must call dragDrop().
      if ( $.browser.msie && (parseInt($.browser.version, 10) == 8 || parseInt($.browser.version, 10) == 9 )) {
        $child.on("selectstart", function() {
          if (this.dragDrop) {
            this.dragDrop();
          }
          return false;
        });
      }


      $child.on("dragenter.sordidDragon", function(e) {
        moveChild($child);
      });


      $child.on("touchstart.sordidDragon dragstart.sordidDragon", function(e) {
        // We must pre-cache the positions after they have been rendered, but
        // before anything has changed. Otherwise the extra elements we create
        // during the drag process will interfere.
        if ( isTouch(e) ) {
          calculatePositions();
        }

        // Firefox won't trigger "drag" events without this.
        var dt = e.originalEvent.dataTransfer;
        if ( dt ) {
          dt.setData("text", "");
        }

        if ( isTouch(e) ) {
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
        $child.css({opacity: 0});
        if (!$childBeingMoved.is(":visible") ) {
          $child.after($childBeingMoved);

          $childBeingMoved.css({
            opacity: 0.5
          });
        }
        // The hiding must come after the clone is inserted. Otherwise when
        // you are scrolled down to the bottom of the screen, the act of hiding
        // $child will cause the screen to scroll up. This makes it feel like
        // dragging has caused the list to jump around.
        $child.hide();
        $child.css({opacity: 1});

        if ( isTouch(e) ) {
          var pageY = e.originalEvent.targetTouches[0].pageY;

          $ghost.css({
            left: $childBeingMoved.offset().left,
            top: (pageY - ($childBeingMoved.outerHeight() / 2)) - window.scrollY,
            width: $childBeingMoved.outerWidth() - window.scrollX,
            opacity: 1
          });

          // On touch devices, we don't have dragenter events, so we'll update
          // the position of the element being dragged here instead.
          var newPosition = currentPosition(pageY);
          if (typeof newPosition !== "undefined") {
            moveChild($parent.children(":visible").eq(newPosition));
          }
        }

        preventTouchDefault(e);
      });


      $child.on("touchend.sordidDragon dragend.sordidDragon", function(e) {
        $childBeingMoved.after($child);
        $childBeingMoved.remove();
        $child.show();

        if ( isTouch(e) ) {
          hideGhost();
        }

        // We must recalculate the positions because in the case where items
        // are not all the same height, we would get unexpected results from
        // currentPosition.
        if ( isTouch(e) ) {
          calculatePositions();
        }

        preventTouchDefault(e);
      });
    });
  };
})(jQuery);
