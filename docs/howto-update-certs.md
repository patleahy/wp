# Howto Update Wilburton Pottery Certs

Make new certs:
```
pat> sudo certbot certonly --manual --config-dir /usr/certbot/wilburtonpottery-com --work-dir /usr/certbot/wilburtonpottery-com --logs-dir /usr/certbot/wilburtonpottery-com
```

Copy certs to 
```
/var/site/keys-YYYY-MM-DD
```

Update keys symlink:

```
ec2> sudo ln -sfn keys-YYYY-MM-DD keys
```

Restart node web server

```
ec2> forever restartall
```
