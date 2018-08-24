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

getLatestBlock()

function getLatestBlock() {
  axios.get('http://18.191.184.199:8000/stats')
  .then(function (response) {
    getLatestSavedBlock(response.data.last_block_index)
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getLatestSavedBlock(latestBlock) {
  db.oneOrNone('select max(block_number) as latest_saved_block from blocks;')
  .then((block) => {
    getNewBlocks(block.latest_saved_block, latestBlock)
  })
  .catch((error) => {
    console.log(error)
  })
}

function getNewBlocks(latestSavedBlock, latestBlock) {
  if(typeof latestSavedBlock == 'undefined' || latestSavedBlock == null) {
    latestSavedBlock = 0
  }
  for(var i = latestSavedBlock; i <= latestBlock;  i++) {
    getBlock(i)
  }
}

function getBlock(index) {
  axios.get('http://18.191.184.199:8000/block/'+index)
  .then((response) => {
    insertBlock(response.data)
  })
  .catch((error) => {
    console.log(error);
  });
}

function insertBlock(block) {
  db.none('insert into blocks (block_number, payload) values ($1, $2);', [
    block.Body.Index, block
  ])
  .then(() => {
    console.log(block.Body.Index+" inserted")
  })
  .catch((err) => {
    console.log(err)
  })
}
