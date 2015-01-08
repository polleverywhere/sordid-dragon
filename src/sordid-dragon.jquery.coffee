# jQuery the Sordid Dragon
# Copyright Poll Everywhere
# Paul Cortens & Mike Foley
# https://github.com/polleverywhere/sordid-dragon
# Version 1.0.0

do ($=jQuery) ->
  $.fn.sordidDragon = (options) ->
    $parent = this

    # Windows touch devices (such as the Microsoft Surface Pro 3) will end
    # the drag event early (and not call dragend) if the element being
    # dragged is moved in the DOM by JavaScript.
    # To work around that problem we:
    #   1) clone the element being moved
    #   2) hide the element being moved
    #   3) move the clone around in the DOM
    # Then we clean it all up in the dragend event.
    $placeholder = undefined
    showPlaceholder = ($child) ->

      # Hide the element being moved and replace it with the clone.
      $child.css opacity: 0
      unless $placeholder.is(":visible")
        $placeholder.addClass "sordidDragon-placeholder"
        $child.after $placeholder
        $placeholder.css opacity: 0.5

      # The hiding must come after the clone is inserted. Otherwise when
      # you are scrolled down to the bottom of the screen, the act of hiding
      # $child will cause the screen to scroll up. This makes it feel like
      # dragging has caused the list to jump around.
      $child.hide()
      $child.css opacity: 1

    hidePlaceholder = ($child) ->
      $placeholder.after $child
      $placeholder.remove()
      $child.show()

    # The $ghost is a faded copy of the element that moves with the mouse or
    # finger.
    # In most (but not all) browsers that support drag events, the browser will
    # create a ghost under the cursor for us. That doesn't happen with touch
    # events, so we create one ourselves.
    # In IE9 the browser won't create a ghost for us. However, if we show the
    # ghost in IE9, then the dragenter events won't fire (because the browser
    # always thinks you are dragging over the ghost, not the items in the
    # list.)
    # IE8 also doesn't create a ghost for us. However, showing the ghost in
    # IE8 makes the UI choppy.
    # Therefore, we only show this ghost for touch devices.
    $ghost = undefined
    showGhost = (pageY) ->
      unless $ghost.is(":visible")
        $ghost.addClass "sordidDragon-ghost"
        $ghost.css
          position: "fixed"
          opacity: 1

        $parent.append $ghost
      $ghost.css
        left: $placeholder.offset().left
        top: (pageY - ($placeholder.outerHeight() / 2)) - window.scrollY
        width: $placeholder.outerWidth() - window.scrollX

    hideGhost = ->
      $ghost.remove()

    # Touch devices don't support dragenter or dragover events. Instead we
    # keep track of the location of each child so we can know which child is
    # currently under the user's finger.
    positions = undefined
    calculatePositions = ->
      positions = []
      $parent.children().each (_, child) ->
        $child = $(child)
        positions.push [
          $child.offset().top
          $child.offset().top + $child.outerHeight()
        ]
      positions

    currentPosition = (pageY) ->
      for i in [0..positions.length]
        return i if pageY >= positions[i][0] && pageY < positions[i][1]

    moveChild = ($besideChild) ->
      $children = $parent.children(":visible")
      newPosition = $children.index($besideChild)
      oldPosition = $children.index($placeholder)
      if newPosition > oldPosition
        $besideChild.after $placeholder
      else if newPosition < oldPosition
        $besideChild.before $placeholder

    isTouch = (e) ->
      (/touch/).test e.type

    $parent.children().each (_, child) ->
      $child = $(child)
      $child.attr "draggable", "true"

      # Setting draggable=true doesn't work in IE8 and IE9. We must call
      # dragDrop(). The selectstart event only fires on IE8/IE9.
      $child.on "selectstart", ->
        @dragDrop?()
        false

      $child.on "touchstart.sordidDragon dragstart.sordidDragon", (e) ->
        if isTouch(e)
          # We must pre-cache the positions after they have been rendered, but
          # before anything has changed. Otherwise the extra elements we create
          # during the drag process will interfere.
          calculatePositions()
          $ghost = $child.clone()
          e.preventDefault()
        # Firefox won't trigger "drag" events without this.
        dt = e.originalEvent.dataTransfer
        dt?.setData "text", ""
        $placeholder = $child.clone()

      $child.on "touchmove.sordidDragon drag.sordidDragon", (e) ->
        showPlaceholder $child
        if isTouch(e)
          pageY = e.originalEvent.targetTouches[0].pageY
          showGhost pageY

          # On touch devices, we don't have dragenter events, so we'll update
          # the position of the element being dragged here instead.
          newPosition = currentPosition(pageY)
          if typeof newPosition != "undefined"
            moveChild $parent.children(":visible").eq(newPosition)
          e.preventDefault()

      $child.on "dragenter.sordidDragon", (e) ->
        moveChild $child

      $child.on "touchend.sordidDragon dragend.sordidDragon", (e) ->
        hidePlaceholder $child
        if isTouch(e)
          hideGhost()

          # We must recalculate the positions because in the case where items
          # are not all the same height, we would get unexpected results from
          # currentPosition.
          calculatePositions()
          e.preventDefault()
