drop table consensus_events;
create table consensus_events (
  hash varchar(100),
	processed boolean
);

drop table consensus_events_data;
create table consensus_events_data (
  hash varchar(100),
	payload json,
	event_time timestamp,
	index numeric
);

drop table blocks;
create table blocks (
  block_number numeric,
	payload json,
	processed boolean
);

drop table rounds;
create table rounds (
  round_number numeric,
	payload json
);


drop table accounts;
create table accounts (
	address char(42),
	balance char(22),
	nonce numeric
)