#!/bin/bash

# Check if a path is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_wallpaper>"
    exit 1
fi

echo "$1"

WALLPAPER_PATH="$1"
HYPRPAPER_CONFIG="$HOME/.config/hypr/hyprpaper.conf"

# Write the new wallpaper path to the config
echo "preload=$WALLPAPER_PATH"$'\n'"wallpaper=, $WALLPAPER_PATH" > "$HYPRPAPER_CONFIG"

# Reload hyprpaper with the new configuration
hyprctl hyprpaper reload , "$WALLPAPER_PATH"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Wallpaper updated and hyprpaper reloaded successfully."
else
    echo "Failed to reload hyprpaper. Check the configuration and path."
    exit 1
fi