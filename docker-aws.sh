#!/bin/bash
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 644854060878.dkr.ecr.ap-southeast-1.amazonaws.com
docker build -t water .
docker tag water:latest 644854060878.dkr.ecr.ap-southeast-1.amazonaws.com/water:sandbox
docker push 644854060878.dkr.ecr.ap-southeast-1.amazonaws.com/water:sandbox

