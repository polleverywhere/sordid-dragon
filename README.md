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

Then open your browser to [http://localhost:9292/examples/example.html](http://localhost:9292/examples/example.html)


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
