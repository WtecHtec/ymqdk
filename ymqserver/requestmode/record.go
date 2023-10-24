package requestmode

type QueryRecord struct {
	Month string `form:"month" json:"month" binding:"required"`
}

type CreateRecord struct {
	ArenaId    string `form:"month" json:"arena_id" binding:"required"`
	EmojId     string `form:"month" json:"emoj_id" binding:"required"`
	RecordImg  string `form:"month" json:"record_img" binding:"required"`
	RecordDesc string `form:"month" json:"record_desc" binding:"required"`
}
