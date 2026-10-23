// Ghost Buster GO — shared cloud config.
// Optional: paste a JSONBlob ID here to give every player the same
// global leaderboard. Create one in-game (Crew tab > "Create shared ledger")
// or run:  curl -X POST https://jsonblob.com/api/jsonBlob \
//            -H "Content-Type: application/json" \
//            -d '{"leaderboard":[],"pings":[]}'
// then copy the ID from the Location header into blobId below.
window.GB_CONFIG = {
  blobId: ""
};
