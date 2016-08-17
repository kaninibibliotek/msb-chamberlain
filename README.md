# msb-chamberlain

:tophat: Application server for Lilla slottet.

Chamberlain serves the `msb-miniscreen` and `msb-krumelur-player` applications and provides a REST API for accessing local files on the NAS.

## Setup

Install Node.js
Install the Miniscreen and Krumelurplayer applications

```sh
$ git clone https://github.com/unsworn/msb-miniscreen.git
$ git clone https://github.com/unsworn/msb-krumelur-player.git
```

- Now get Chamberlain

```sh
$ git clone https://github.com/unsworn/msb-chamberlain.git
$ cd msb-chamberlain
$ npm install
```

## Develop

```sh
$ npm run dev  # use the files in /mock-fs
```

Run msb-miniscreen

```sh
$ open http://localhost:3000/miniscreen/app/blixt
```

or msb-krumelurmaskin-player

```sh
$ open http://localhost:3000/krumelur/app
```

## View Log

SSH to NAS, then 

```sh
sudo tail -f /var/log/upstart/msb-chamberlain.log
```

## Deploy

...
