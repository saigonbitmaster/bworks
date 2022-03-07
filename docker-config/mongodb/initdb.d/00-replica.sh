#!/bin/sh
FILE=/tmp/init-replica.sh
LOG=/tmp/init-replica.log

nohup $FILE > $LOG < /dev/null &
echo 'DELAY REPLICA SET'

