package requestmode

type QueryRecord struct {
	Month string `form:"month" json:"month" binding:"required"`
}

type QueryYearRecord struct {
	Year string `form:"year" json:"year" binding:"required"`
}

type QueryIdRecord struct {
	Id string `form:"id" json:"id" binding:"required"`
}

type CreateRecord struct {
	ArenaId    string `form:"arena_id" json:"arena_id" binding:"required"`
	EmojId     string `form:"emoj_id" json:"emoj_id" binding:"required"`
	RecordImg  string `form:"record_img" json:"record_img" binding:"required"`
	RecordDesc string `form:"record_desc" json:"record_desc" binding:"required"`
}
