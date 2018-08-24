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
  db.manyOrNone('select * from consensus_events where processed is not true;')
  .then((response) => {
    response.map(getEvent)
  })
  .catch((error) => {
    console.log(error);
  });
}

function getEvent(event) {
  axios.get('http://18.191.184.199:8000/event/'+event.hash)
  .then((response) => {
    insertConsensusEventData(event.hash, response.data)
  })
  .catch((error) => {
    console.log(error);
  });
}

function insertConsensusEventData(event, eventData) {
  db.none('insert into consensus_events_data (hash, payload) values ($1, $2);', [
    event, eventData
  ])
  .then(() => {
    updateConsensusEvent(event)
  })
  .catch((err) => {
    console.log(err)
  })
}

function updateConsensusEvent(event) {
  db.none('update consensus_events set processed = true where hash = $1', [
    event
  ])
  .then(() => {
    //done
  })
  .catch((err) => {
    console.log(err)
  })
}
