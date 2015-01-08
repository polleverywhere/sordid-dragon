#!/usr/bin/env bash

set -e
set -u

COFFEE_FILE="sordid-dragon.jquery.coffee"
JS_FILE="sordid-dragon.jquery.js"
MIN_JS_FILE="sordid-dragon.jquery.min.js"
COMMENT_LINES=6

coffeebar --bare --output $JS_FILE.tmp $COFFEE_FILE
coffeebar --bare --minify --output $MIN_JS_FILE.tmp $COFFEE_FILE

function add_header {
  head -$COMMENT_LINES $COFFEE_FILE | sed 's/^#/\/\//' > $1
  cat $1.tmp >> $1
  rm -f $1.tmp
}

add_header "$JS_FILE"
add_header "$MIN_JS_FILE"
