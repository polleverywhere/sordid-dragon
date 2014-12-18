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
      position: "absolute",
      left: "-999999px",
      top: "-999999px",
      opacity: 1
    });
    $parent.append($ghost);

    var positions = [];

    $parent.children().each(function(index, child) {
      var $child = $(child);

      positions.push([
        $child.position().top,
        $child.position().top + $child.outerHeight()
      ]);

      var currentPosition = function(touch) {
        for (var i = 0; i < positions.length; i++) {
          if ( touch.pageY >= positions[i][0] && touch.pageY < positions[i][1] ) {
            return i;
          }
        }
      };

      $child.on("touchstart", function(e) {
        $ghost.html($child.clone());
        e.preventDefault();
      });


      $child.on("touchmove", function(e) {
        var touch = e.originalEvent.targetTouches[0];

        $ghost.css({
          position: "absolute",
          left: $child.position().left,
          top: touch.pageY - ($child.outerHeight() / 2) + "px",
          width: $child.outerWidth()
        });
        $child.css({
          opacity: 0.5
        });

        var newPosition = currentPosition(touch);
        if (typeof newPosition !== "undefined") {
          var $moveTo = $($parent.children()[newPosition]);
          if ($moveTo.index() > $child.index()) {
            $moveTo.after($child.detach());
          } else if ($moveTo.index() < $child.index()) {
            $moveTo.before($child.detach());
          }
        }

        e.preventDefault();
      });


      $child.on("touchend", function(e) {
        $ghost.html("");
        $ghost.css({
          left: "-999999px",
          top: "-999999px",
          width: "0px"
        });

        $child.css({
          opacity: 1
        });
        e.preventDefault();
      });
    });
  };
})(jQuery);
