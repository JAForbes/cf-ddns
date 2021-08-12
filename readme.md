cf-ddns
=======

A node.js systemd service that periodically updates a DNS record to match the current external IP of the current server.

## How?

Runs as a [systemd timer](./systemd-d/cf-ddns.timer) every 5 mins.

The service simply fetches the latest ip from `icanhazip.com` and then creates or updates a DNS record using the Cloudflare REST API

All the credentials are stored in the `.env` file.  A no login user will be created named `cf-ddns` which runs the service.

## Installation

> ⚠ All commands should be run from the root directory of the project.

- Run `sudo ./systemd/install.sh` to install/refresh the service.
- Run `sudo ./systemd/logs.sh` to follow the service logs.

## Problems?

If I canhazip.com ever goes away, this script will break - yay!