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

getLatestRound()

function getLatestRound() {
  axios.get('http://18.191.184.199:8000/stats')
  .then(function (response) {
    getLatestSavedRound(response.data.last_consensus_round)
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getLatestSavedRound(latestRound) {
  db.oneOrNone('select max(round_number) as latest_saved_round from rounds;')
  .then((round) => {
    getNewRounds(round.latest_saved_round, latestRound)
  })
  .catch((error) => {
    console.log(error)
  })
}

function getNewRounds(latestSavedRound, latestRound) {
  if(typeof latestSavedRound == 'undefined' || latestSavedRound == null) {
    latestSavedRound = 0
  }
  for(var i = latestSavedRound; i <= latestRound;  i++) {
    getRound(i)
  }
}

function getRound(index) {
  axios.get('http://18.191.184.199:8000/round/'+index)
  .then((response) => {
    insertRound(index, response.data)
  })
  .catch((error) => {
    console.log(error);
  });
}

function insertRound(index, round) {
  db.none('insert into rounds (round_number, payload) values ($1, $2);', [
    index, round
  ])
  .then(() => {
    console.log(index+" inserted")
  })
  .catch((err) => {
    console.log(err)
  })
}
