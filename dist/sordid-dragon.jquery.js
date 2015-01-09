// jQuery the Sordid Dragon
// Copyright Poll Everywhere
// Paul Cortens & Mike Foley
// https://github.com/polleverywhere/sordid-dragon
// Version 1.1.3

// Generated by CoffeeScript 1.7.1
(function($) {
  return $.fn.sordidDragon = function(options) {
    var $ghost, $parent, $placeholder, calculatePositions, currentPosition, hideGhost, hidePlaceholder, isTouch, moveChild, positions, showGhost, showPlaceholder;
    if (options == null) {
      options = {};
    }
    $parent = this;
    $placeholder = void 0;
    showPlaceholder = function($child) {
      $child.css({
        opacity: 0
      });
      if (!$placeholder.is(":visible")) {
        $placeholder.addClass("sordidDragon-placeholder");
        $child.after($placeholder);
        $placeholder.css({
          opacity: 0.5
        });
      }
      $child.hide();
      return $child.css({
        opacity: 1
      });
    };
    hidePlaceholder = function($child) {
      $placeholder.after($child);
      $placeholder.remove();
      return $child.show();
    };
    $ghost = void 0;
    showGhost = function(pageY) {
      if (!$ghost.is(":visible")) {
        $ghost.addClass("sordidDragon-ghost");
        $ghost.css({
          position: "fixed",
          opacity: 1
        });
        $parent.append($ghost);
      }
      return $ghost.css({
        left: $placeholder.offset().left,
        top: (pageY - ($placeholder.outerHeight() / 2)) - window.scrollY,
        width: $placeholder.outerWidth() - window.scrollX
      });
    };
    hideGhost = function() {
      return $ghost.remove();
    };
    positions = void 0;
    calculatePositions = function() {
      positions = [];
      $parent.children().each(function(_, child) {
        var $child;
        $child = $(child);
        return positions.push([$child.offset().top, $child.offset().top + $child.outerHeight()]);
      });
      return positions;
    };
    currentPosition = function(pageY) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = positions.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (pageY >= positions[i][0] && pageY < positions[i][1]) {
          return i;
        }
      }
    };
    moveChild = function($besideChild) {
      var $children, newPosition, oldPosition;
      $children = $parent.children(":visible");
      newPosition = $children.index($besideChild);
      oldPosition = $children.index($placeholder);
      if (newPosition > oldPosition) {
        return $besideChild.after($placeholder);
      } else if (newPosition < oldPosition) {
        return $besideChild.before($placeholder);
      }
    };
    isTouch = function(e) {
      return /touch/.test(e.type);
    };
    return $parent.children().each(function(_, child) {
      var $child, $handle;
      $child = $(child);
      $handle = options.handle ? $child.find(options.handle) : $child;
      $handle.attr("draggable", "true");
      $handle.on("selectstart", function() {
        if (typeof this.dragDrop === "function") {
          this.dragDrop();
        }
        return false;
      });
      $handle.on("touchstart.sordidDragon dragstart.sordidDragon", function(e) {
        var _ref;
        if (isTouch(e)) {
          calculatePositions();
          $ghost = $child.clone();
          e.preventDefault();
        }
        if ((_ref = e.originalEvent.dataTransfer) != null) {
          _ref.setData("text", "");
        }
        return $placeholder = $child.clone();
      });
      $handle.on("touchmove.sordidDragon drag.sordidDragon", function(e) {
        var newPosition, pageY;
        showPlaceholder($child);
        if (isTouch(e)) {
          pageY = e.originalEvent.targetTouches[0].pageY;
          showGhost(pageY);
          newPosition = currentPosition(pageY);
          if (typeof newPosition !== "undefined") {
            moveChild($parent.children(":visible").eq(newPosition));
          }
          return e.preventDefault();
        }
      });
      $child.on("dragenter.sordidDragon", function(e) {
        return moveChild($child);
      });
      return $handle.on("touchend.sordidDragon dragend.sordidDragon", function(e) {
        hidePlaceholder($child);
        if (isTouch(e)) {
          hideGhost();
          calculatePositions();
          return e.preventDefault();
        }
      });
    });
  };
})(jQuery);
