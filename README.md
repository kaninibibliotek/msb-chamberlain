# msb-chamberlain

Application server for Lilla slottet. It serves the `msb-miniscreen`

## Setup

- Install Node.js
- Install the Miniscreen and Krumelurplayer applications

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
$ open http://localhost:3000/msb-miniscreen/blixt
```

or msb-krumelurmaskin-player

```sh
$ open http://localhost:3000/msb-krumelurmaskin-player
```

## Deploy

...
