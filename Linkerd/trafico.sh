
for i in {0..100000}; do  curl --location --request POST 'http://35.222.121.43.nip.io/Jugar' \
--header 'Content-Type: application/json' \
--data-raw '{
    "game_id" : 1,
    "players" : 7
}'; done.

