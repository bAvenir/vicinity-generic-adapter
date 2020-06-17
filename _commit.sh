#!/bin/bash
USAGE="$(basename "$0") [-h] [-v version -d description]
 -- Runs app docker on linux/mac
Where:
  Flags:
    -h  shows help
  Options with argument:
    -v  <version> [patch, minor, major]
    -d  <description>"

#  Default configuration
VER="false"
DESC=""

# Get configuration
while getopts 'hd:v:d:' OPTION; do
  case "$OPTION" in
    h)
      echo "$USAGE"
      exit 0
      ;;
    v)
      VER="$OPTARG"
      ;;
    d)
      DESC="$OPTARG"
      ;;
  esac
done

# RUN
if [ ${VER} != "false" ]
then
    git add .
    git commit -m "${DESC}"
    npm version ${VER}
    echo "Successfully commited. You can push now"
else
    echo "Missing version number"
fi