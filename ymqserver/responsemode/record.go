package responsemode

type RecordResult struct {
	RecordId      string `json:"record_id"`
	ArenaId       string `json:"arena_id"`
	EmojId        string ` json:"emoj_id"`
	RecordImg     string ` json:"record_img"`
	RecordDesc    string `json:"record_desc" `
	StrCreateDate string ` json:"str_create_date"`
	ArenaName     string ` json:"arena_name"`
	ArenaLocation string ` json:"arena_location"`
}
