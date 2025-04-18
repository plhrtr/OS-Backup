#!/usr/bin/env sh

# get current powermode
mode=$(powerprofilesctl get)

# switch powermode
# -r 843920483 to replace notificaiton when changig -> random id used, may cause issues
if [ "$mode" = "performance" ]; then 
    powerprofilesctl set balanced
    notify-send -r 843920483 -t 1500 -i "power-profile-balanced-rtl-symbolic" "balanced"
elif [ "$mode" = "balanced" ]; then 
    powerprofilesctl set power-saver
    notify-send -r 843920483 -t 1500 -i "battery-profile-powersave-symbolic" "power saver"
else 
    powerprofilesctl set performance
    notify-send -r 843920483 -t 1500 -i "power-profile-performance-symbolic" "performance"
fi
