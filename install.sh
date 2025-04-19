# copy the config files into the right folder
cp -r ./dotfiles/* ~/.config

# install the basic packages
xargs -a ./packages.txt sudo pacman -Syu --noconfirm

