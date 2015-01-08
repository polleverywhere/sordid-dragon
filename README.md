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


Dependencies
============

* jQuery >= 1.7


Known issues
============

* Edge case in Microsoft Surface: If draggable items do not have a CSS width set, the drag ghost image will be taken from the top of the web page. The workaround is to explicitly set the width of the draggable items.


Development
===========

If you have the [rackup](https://rack.github.io/) tool, you can start a simple
webserver (which makes it easier to test with virtual machines):

    rackup -b 'require "rack"; run Rack::File.new(".")'

Then open your browser to load the examples:

- [Basic](http://localhost:9292/examples/basic.html)
- [Handles](http://localhost:9292/examples/handles.html)


Contributing
============

Compile to JavaScript prior to committing CoffeeScript changes:

    ./build.sh


TODO
====

Remove flickering on desktops when elements are of different heights.

In Firefox there are some bugs if something other than a child element is
dragged onto one of the child elements.

Add way to removing (turn off) for a given DOM element.

Add option for specifying a "handle".
