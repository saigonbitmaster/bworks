# Bworks

## Setup docker

```shell
curl -fsSL https://get.docker.com | sh -
```

## Setup docker-compose

```
sudo curl -L https://github.com/docker/compose/releases/download/1.26.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Login registry for pull docker images

```
docker login gitlab.Bworks.online:5050

```

## Setup .env file

example:

```shell
DK_DATA=.data

MONGO_USERNAME=admin
MONGO_PASSWORD=SfHcm2017

DOMAIN=hcm.Bworks.online

```

DOMAIN_TRAEFIK=dashboard.dev.Bworks.online

## Make sure domain already point to server ip

## RUN

```
docker-compose up -d
```
