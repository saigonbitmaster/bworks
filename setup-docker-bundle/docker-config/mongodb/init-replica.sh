#!/bin/sh
echo 'INIT REPLACE Wait for 20 sec'
date
sleep 20
date
echo 'INIT REPLICA START'
mongo -u admin -p SfHcm2017 <<EOF
rs.initiate({
  _id: 'rs0',
  members: [{
    _id: 0,
    host: 'mongo:27017'
  }]
})

EOF
sleep 20
echo 'INIT REPLICA RETRY after 20 sec'
date
mongo -u admin -p SfHcm2017 <<EOF
rs.initiate({
  _id: 'rs0',
  members: [{
    _id: 0,
    host: 'mongo:27017'
  }]
})

EOF
date
echo 'INIT REPLICA FINISHED'