#! /bin/bash

# Delete cf-ddns
sudo userdel cf-ddns || true
sudo rm -fr /home/cf-ddns || true

# Create cf-ddns user.
sudo useradd cf-ddns -m -s /bin/false

# Create a fresh symlink to the current directory
sudo ln -s "$(pwd)" /home/cf-ddns/cf-ddns

# Create symlink to systemd dir
# So files appears there but stays in the repo
sudo cp ./systemd/cf-ddns.service /etc/systemd/system/cf-ddns.service
sudo cp ./systemd/cf-ddns.timer /etc/systemd/system/cf-ddns.timer

# Register the service and timer
sudo systemctl enable cf-ddns.service
sudo systemctl enable cf-ddns.timer

# Start the service
sudo systemctl start cf-ddns.service
sudo systemctl start cf-ddns.timer

# Restart the service
sudo systemctl restart cf-ddns.service
sudo systemctl restart cf-ddns.timer