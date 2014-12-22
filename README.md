Sordid Dragon
=============

jQuery plugin for vertical sorting

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
jQuery `$.browser` (moved to jQuery Migrate in 1.9)


Development
===========

If you have the [rackup](https://rack.github.io/) tool, you can start a simple
webserver (which makes it easier to test with virtual machines):

    rackup -b 'require "rack"; run Rack::File.new(".")'

Then open your browser to [http://localhost:9292/example.html](http://localhost:9292/example.html)


TODO
====

Remove flickering on desktops when elements are of different heights.

Add way to removing (turn off) for a given DOM element.

Add option for specifying a "handle".
