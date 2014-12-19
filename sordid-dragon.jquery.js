// jQuery the Sordid Dragon
// Copyright 2014 Poll Everywhere
// Paul Cortens & Mike Foley
// Version 0.0.1

(function ($) {
  $.fn.sordidDragon = function (options) {
    var $parent = this;

    var $ghost = $("<div></div>");
    $ghost.addClass("sordidDragon-ghost");
    $ghost.css({
      position: "fixed",
      left: "-999999px",
      top: "-999999px",
      opacity: 1
    });
    $parent.append($ghost);

    var _positions;
    var positions = function() {
      if (!_positions) {
        _positions = [];

        $parent.children().each(function(index, child) {
          var $child = $(child);
          _positions.push([
            $child.offset().top,
            $child.offset().top + $child.outerHeight()
          ]);
        });
      }

      return _positions;
    };

    var preventTouchDefault = function(e) {
      if ( isTouch(e) ) {
        e.preventDefault();
      }
    };

    var isTouch = function(e) {
      return (/touch/).test(e.type);
    }

    $parent.children().each(function(index, child) {
      var $child = $(child);
      $child.attr("draggable", "true");

      var currentPosition = function(pageY) {
        for (var i = 0; i < positions().length; i++) {
          if ( pageY >= positions()[i][0] && pageY < positions()[i][1] ) {
            return i;
          }
        }
      };

      $child.on("touchstart dragstart", function(e) {
        if ( isTouch(e) ) {
          $ghost.html($child.clone());
        }
        preventTouchDefault(e);
      });


      $child.on("touchmove drag", function(e) {
        var pageY;
        if ( e.originalEvent.targetTouches ) {
          pageY = e.originalEvent.targetTouches[0].pageY;
        } else {
          pageY = e.originalEvent.y;
        }

        if ( isTouch(e) ) {
          $ghost.css({
            left: $child.offset().left,
            top: pageY - ($child.outerHeight() / 2) + "px",
            width: $child.outerWidth()
          });
        }

        $child.css({
          opacity: 0.5
        });

        var newPosition = currentPosition(pageY);
        if (typeof newPosition !== "undefined") {
          var $moveTo = $($parent.children()[newPosition]);
          if ($moveTo.index() > $child.index()) {
            $moveTo.after($child.detach());
          } else if ($moveTo.index() < $child.index()) {
            $moveTo.before($child.detach());
          }
        }

        preventTouchDefault(e);
      });


      $child.on("touchend dragend", function(e) {
        if ( isTouch(e) ) {
          $ghost.html("").css({
            left: "-999999px",
            top: "-999999px",
            width: "0px"
          });
        }

        $child.css({
          opacity: 1
        });
        preventTouchDefault(e);
      });
    });
  };
})(jQuery);
