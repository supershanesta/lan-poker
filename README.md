# Lan Poker

![image](https://github.com/supershanesta/lan-poker/assets/20649126/bdeae3e7-7c2c-496b-aa89-9c658af5c4ca)


Simple game poker game you can play with friends locally.  
Based on [https://memory-cards.mazz.lol/](https://memory-cards.mazz.lol/)

Here's a complete article about process and implementation used as base:  
[https://francois-steinel.fr/articles/build-lobby-based-online-multiplayer-browser-games-with-react-and-nodejs](https://francois-steinel.fr/articles/build-lobby-based-online-multiplayer-browser-games-with-react-and-nodejs)

## Installation

To install project locally, make sure to have NodeJS (version 16.13.0 at least) and Yarn (version 1.22.17 at least) installed.

* Clone the project `git@github.com:supershanesta/lan-poker.git`
* Enter project `cd lan-poker/`
* Install dependencies `yarn`
* Start dev environment for client `yarn start:dev:client`
* Start dev environment for server `yarn start:dev:server`

## Stack

### Yarn Workspaces

Project makes use of Yarn `workspaces` to manage client and server projects but also to share some code between both.

### Next.js / React.js

Client application is built on top of Next.js.

### NestJS / NodeJS

Server side is built using NestJS to manage game instances and handle interactions with clients.

### Socket.IO

To handle realtime, project uses websockets and manage socket connections with Socket.IO.

### Docker

For deployment, I use docker containers (using Alpine NodeJS images for client and server).

## Credits

Created by Shane
