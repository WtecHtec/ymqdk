package responsemode

type ArenaResult struct {
	ArenaId        string ` json:"arena_id"`
	ArenaName      string ` json:"arena_name"`
	ArenaLocation  string `json:"arena_location" `
	ArenaLongitude string ` json:"arena_longitude"`
	ArenaLatitude  string ` json:"arena_latitude"`
	EmoId          string ` json:"emo_id"`
}
