#!/bin/bash

# Check if a resource name is provided
if [ $# -eq 0 ]; then
    echo "Please provide a resource name (e.g., factions, characters)"
    exit 1
fi

# Set the resource name
RESOURCE=$1

# Function to singularize the resource name
singularize() {
    local word=$1
    if [[ $word == *s ]]; then
        echo "${word%s}"
    else
        echo "$word"
    fi
}

# Function to capitalize the first letter
capitalize() {
    local word=$1
    echo "$(tr '[:lower:]' '[:upper:]' <<< ${word:0:1})${word:1}"
}

# Get singular form of the resource
SINGULAR_RESOURCE=$(singularize "$RESOURCE")
CAPITALIZED_RESOURCE=$(capitalize "$SINGULAR_RESOURCE")

# Set the base directory relative to the script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
ROUTES_DIR="$PROJECT_ROOT/app/routes"

# Create the directories and files
mkdir -p "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE"
mkdir -p "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE._index"
mkdir -p "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE.new"
mkdir -p "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE.\$$SINGULAR_RESOURCE""Id"

# Create route.tsx files
touch "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE/route.tsx"
touch "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE._index/route.tsx"
touch "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE.new/route.tsx"
touch "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE.\$$SINGULAR_RESOURCE""Id/route.tsx"

# Add some basic content to each route.tsx file
echo 'export default function '"$CAPITALIZED_RESOURCE"'Layout() {
  return <div>'"$CAPITALIZED_RESOURCE"' Layout</div>;
}' > "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE/route.tsx"

echo 'export default function '"$CAPITALIZED_RESOURCE"'IndexRoute() {
  return <div>'"$CAPITALIZED_RESOURCE"' Index</div>;
}' > "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE._index/route.tsx"

echo 'export default function New'"$CAPITALIZED_RESOURCE"'Route() {
  return <div>New '"$CAPITALIZED_RESOURCE"'</div>;
}' > "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE.new/route.tsx"

echo 'export default function '"$CAPITALIZED_RESOURCE"'DetailRoute() {
  return <div>'"$CAPITALIZED_RESOURCE"' Detail</div>;
}' > "$ROUTES_DIR/_app.games.\$gameId.$RESOURCE.\$$SINGULAR_RESOURCE""Id/route.tsx"

echo "Folders and route.tsx files created for $RESOURCE in app/routes directory"
