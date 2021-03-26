#!/bin/bash
# TODO

#  if [[ "x$PROD" == "x" ]]; then
	#  echo "This script is for starting in production."
	#  echo "Use"
	#  echo "   mix phx.server"
	#  exit
#  fi

export SECRET_KEY_BASE=#TODO
export MIX_ENV=prod mix phx.server
export PORT=8910

echo "Stopping old copy of app, if any..."

_build/prod/rel/serverside/bin/serverside stop || true

echo "Starting app..."

_build/prod/rel/serverside/bin/serverside start
