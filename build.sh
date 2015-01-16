#!/usr/bin/env bash

set -e
set -u

COFFEE_FILE="src/sordid-dragon.jquery.coffee"
JS_FILE="dist/sordid-dragon.jquery.js"
MIN_JS_FILE="dist/sordid-dragon.jquery.min.js"
COMMENT_LINES=6
COFFEEBAR="node_modules/.bin/coffeebar"

npm install

$COFFEEBAR --bare --output $JS_FILE.tmp $COFFEE_FILE
$COFFEEBAR --bare --minify --output $MIN_JS_FILE.tmp $COFFEE_FILE

function add_header {
  head -$COMMENT_LINES $COFFEE_FILE | sed 's/^#/\/\//' > $1
  cat $1.tmp >> $1
  rm -f $1.tmp
}

add_header "$JS_FILE"
add_header "$MIN_JS_FILE"
