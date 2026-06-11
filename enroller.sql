DELETE FROM meeting;
DELETE FROM sqlite_sequence WHERE name='meeting';

DELETE FROM participant;
DELETE FROM sqlite_sequence WHERE name='participant';

DELETE FROM meeting_participant;
DELETE FROM sqlite_sequence WHERE name='meeting_participant';

select * from meeting;