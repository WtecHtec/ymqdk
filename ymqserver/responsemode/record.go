package responsemode

type RecordResult struct {
	RecordImg     string ` json:"record_img"`
	RecordDesc    string `json:"record_desc" `
	StrCreateDate string ` json:"str_create_date"`
	ArenaName     string ` json:"arena_name"`
	ArenaLocation string ` json:"arena_location"`
}
