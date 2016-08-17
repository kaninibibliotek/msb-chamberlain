## Configure NAS for autostart

```sh
sudo cp /volume1/git/msb-chamberlain/extras/msb-chamberlain.conf /etc/init
```

SSH to NAS to View logs:

```sh
sudo tail -f /var/log/upstart/msb-chamberlain.log
```
