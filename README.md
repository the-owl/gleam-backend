<h1 align="center">
  <br>Gleam: backend<br>
  <p align="center">
    <img src="https://img.shields.io/badge/Language-TypeScript-blue.svg">
    <img src="https://img.shields.io/badge/Event-VK Hackathon 2018-orange.svg">
  </p>
</h1>
<p align="center">Server side for Gleam iOS app</p>
<br><br>

## What is this?

This is a server that provides RESTful API for Gleam iOS app.
It allows users to choose the nearest clinic and visit a doctor to check
their diagnosis.

Also, it includes a simple web viewer for sent forms - so that
admins can view what users send.

Server written in: **Node.js + TypeScript + PostgreSQL**

Web viewer: **Vue.js**

## Deployment

To start the server using Docker, do:
1. Create a `client/.htpasswd` auth file using command:
```$ htpasswd -c client/.htpasswd.```
(`htpasswd` is part of Apache)
2. Create a `config.yaml` file with the following contents:
```
database:
  host: postgres
```
3. If necessary, change the public port for nginx in `docker-compose.yml`.
4. Run:
```
$ docker-compose up --build -d
```
5. Visit `http://<your-host>:<nginx-port>/` to make sure that it works.

To develop or start *without* Docker, you will need:
- Node.js;
- npm;
- PostgreSQL.
