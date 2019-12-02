// Player {{player.id}}
call SetPlayerStartLocation(Player({{player.id}}), {{player.id}})
call SetPlayerColor(Player({{player.id}}), ConvertPlayerColor({{player.id}}))
call SetPlayerRacePreference(Player({{player.id}}), {{player.race}})
call SetPlayerRaceSelectable(Player({{player.id}}), true)
call SetPlayerController(Player({{player.id}}), {{player.control}})
