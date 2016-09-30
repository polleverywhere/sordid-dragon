# jQuery the Sordid Dragon
# Copyright Poll Everywhere
# Paul Cortens, Mike Foley and Adam Heath
# https://github.com/polleverywhere/sordid-dragon
# Version 2.1.0

do ($=jQuery) ->
  $.fn.sordidDragon = (command="enable", options={}) ->
    unless typeof command is "string"
      options = command

    $parent = this
    isDragging = false

    # Remove old instance if it exists
    if $.isFunction $parent.data("removeSordidDragon")
      $parent.data("removeSordidDragon")()

    # Handle removing an old instance in case 'enable' is called multiple times
    $parent.data "removeSordidDragon", ->
      isDragging = false
      hidePlaceholder()
      hideGhost()

    # Windows touch devices (such as the Microsoft Surface Pro 3) will end
    # the drag event early (and not call dragend) if the element being
    # dragged is moved in the DOM by JavaScript.
    # To work around that problem we:
    #   1) clone the element being moved
    #   2) hide the element being moved
    #   3) move the clone around in the DOM
    # Then we clean it all up in the dragend event.

    $placeholder = null
    $activePlaceholderChild = null
    showPlaceholder = ($child) ->
      $activePlaceholderChild = $child
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

    hidePlaceholder = ->
      if $placeholder?.is(":visible")
        $placeholder.after $activePlaceholderChild
        $placeholder.remove()
        $activePlaceholderChild.show()

    # The $ghost is a faded copy of the element that moves with the mouse or
    # finger.
    # In most (but not all) browsers that support drag events, the browser will
    # create a ghost under the cursor for us. That doesn't happen with touch
    # events, so we create one ourselves.
    $ghost = null
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
      $ghost?.remove()

    # Touch devices don't support dragenter or dragover events. Instead we
    # keep track of the location of each child so we can know which child is
    # currently under the user's finger.
    positions = null
    calculatePositions = ->
      positions = []
      $parent.children(options.childSelector).each (_, child) ->
        $child = $(child)
        positions.push [
          $child.offset().top
          $child.offset().top + $child.outerHeight()
        ]
      positions

    currentPosition = (pageY) ->
      for i in [0...positions.length]
        return i if pageY >= positions[i][0] && pageY < positions[i][1]
      null

    moveChild = ($besideChild) ->
      $children = $parent.children("#{options.childSelector || ""}:visible")
      newPosition = $children.index($besideChild)
      oldPosition = $children.index($placeholder)
      if newPosition > oldPosition
        $besideChild.after $placeholder
      else if newPosition < oldPosition
        $besideChild.before $placeholder

    isTouch = (e) ->
      (/touch/).test e.type

    $parent.children(options.childSelector).each (_, child) ->
      $child = $(child)
      $handle = if options.handle
        $child.find(options.handle)
      else
        $child
      # Careful here. This might be interfering with other code that sets the
      # "draggable" attribute.
      $handle.attr "draggable", String(command != "destroy")

      # Clear out the existing events (so they aren't duplicated).
      $handle.off "touchstart.sordidDragon dragstart.sordidDragon touchmove.sordidDragon drag.sordidDragon touchend.sordidDragon dragend.sordidDragon"
      $child.off "dragenter.sordidDragon"

      # If we are destroying, then just move on to the next child rather
      # than setting up any event listeners.
      return if command is "destroy"

      $handle.on "touchstart.sordidDragon dragstart.sordidDragon", (e) ->
        if isTouch(e)
          # We must pre-cache the positions after they have been rendered, but
          # before anything has changed. Otherwise the extra elements we create
          # during the drag process will interfere.
          calculatePositions()
          $ghost = $child.clone()
          e.preventDefault()
        # Firefox won't trigger "drag" events without this.
        e.originalEvent.dataTransfer?.setData "text", ""
        $placeholder = $child.clone()
        isDragging = true
        options.sortStart?(e, $child)

      $handle.on "touchmove.sordidDragon drag.sordidDragon", (e) ->
        return unless isDragging

        showPlaceholder $child
        if isTouch(e)
          pageY = e.originalEvent.targetTouches[0].pageY
          showGhost pageY

          # On touch devices, we don't have dragenter events, so we'll update
          # the position of the element being dragged here instead.
          newPosition = currentPosition(pageY)
          if newPosition?
            moveChild $parent.children("#{options.childSelector || ""}:visible").eq(newPosition)
          e.preventDefault()

      $child.on "dragenter.sordidDragon", (e) ->
        return unless isDragging

        moveChild $child

      $handle.on "touchend.sordidDragon dragend.sordidDragon", (e) ->
        return unless isDragging

        hidePlaceholder $child
        if isTouch(e)
          hideGhost()

          # We must recalculate the positions because in the case where items
          # are not all the same height, we would get unexpected results from
          # currentPosition.
          calculatePositions()
          e.preventDefault()
        options.sortEnd?(e, $child)

        isDragging = false
