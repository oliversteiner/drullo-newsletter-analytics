#!/usr/bin/env bash
# add dist to drullo
#
# requires:  npm install -g open

URL='https://drullo.local/admin/newsletter/analytics';
DRULLO='/Volumes/Aktuell/MAMP/drullo/web/';
MODULE='modules/custom/smmg_newsletter/';
ANALYTICS=${DRULLO}${MODULE}'analytics';

echo ''
echo '------------------------'
echo 'copy dist to drullo...'
echo ''

# app.js
echo '  -- js'
cp  ./dist/js/* ${ANALYTICS};

# app.css
echo '  -- css'
cp  ./dist/css/* ${ANALYTICS};


FILE=${ANALYTICS}'/app.js'
if test -f "$FILE"; then
    echo ''
    echo "done."
fi
echo '------------------------'
cd ${DRULLO}
drush cr
open ${URL}
echo ''
