Sordid Dragon
=============

jQuery plugin for vertical sorting.

Tested on:
* Chrome
* Firefox
* IE8-11
* Safari
* Android
* iOS
* Microsoft Surface

Usage
=====

Call `sordidDragon()` on a jQuery selector to make its immediate children sortable:

    $(".list").sordidDragon();

To use handles for dragging rather than the whole element, include the `handle` option:

    $(".list").sordidDragon({ handle: ".handle" });

To remove all event listeners (and disable dragging) specify "destroy" as the argument:

    $(".list").sordidDragon("destroy");

or

    $(".list").sordidDragon("destroy", { handle: ".handle" });

To only allow a subset of the child elements to be dragged, include the `childSelector` option:

    $(".list").sordidDragon({ childSelector: ":not(.undraggable)" });

NOTE: If a child element excluded by `childSelector` is in the middle of the
list, you will be able to drag items from above it to below it or vice versa.
However, if the child element excluded by `childSelector` is at the beginning
or end of the list, you will not be able to drag items above/below it.

To register an event handler that fires when a sort/drag is complete, include the `sortEnd` option:

    $(".list").sordidDragon({
      sortEnd: function(event, child) {
        // event is the raw JavaScript event
        // child is a jQuery object referencing the child element that was just moved.
      }
    });

Dependencies
============

* jQuery >= 1.7


Known issues
============

* The "ghost" doesn't appear while dragging in IE8/IE9.
* Edge case in Microsoft Surface: If draggable items do not have a CSS width set, the drag ghost image will be taken from the top of the web page. The workaround is to explicitly set the width of the draggable items.


Development
===========

If you have the [rackup](https://rack.github.io/) tool, you can start a simple
webserver (which makes it easier to test with virtual machines):

    rackup -b 'require "rack"; run Rack::File.new(".")'

Then open your browser to load the examples:

- [Basic](http://localhost:9292/examples/basic.html)
- [Handles](http://localhost:9292/examples/handles.html)
- [childSelector](http://localhost:9292/examples/complex.html)


Contributing
============

Compile to JavaScript prior to committing CoffeeScript changes:

    ./build.sh


TODO
====

Remove flickering on desktops when elements are of different heights.

In Firefox there are some bugs if something other than a child element is
dragged onto one of the child elements.
