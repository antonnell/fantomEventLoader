const axios = require('axios');
var pgp = require('pg-promise')(/*options*/)

var cn = {
  host: 'localhost',
  port: 5432,
  database: 'fantom',
  user: 'postgres',
  password: 'ert123iop123ert'
}
var db = pgp(cn)

getConsensusEvents()

function getConsensusEvents() {
  axios.get('http://18.191.184.199:8000/consensusevents/')
  .then((response) => {
    console.log(response.data)
    response.data.map(insertConsensusEvent)
  })
  .catch((error) => {
    console.log(error);
  });
}

function insertConsensusEvent(event) {
  db.none('insert into consensus_events (hash) select ($1) where NOT EXISTS (SELECT hash FROM consensus_events WHERE hash = $1);', [
    event
  ])
  .then(() => {
    console.log(event+" inserted")
  })
  .catch((err) => {
    console.log(err)
  })
}
