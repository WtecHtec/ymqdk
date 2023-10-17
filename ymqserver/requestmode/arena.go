package requestmode

type LikeArena struct {
	Name        string `form:"name" json:"name"`
	ArenaBelong string ` form:"arena_belong" json:"arena_belong" binding:"required"`
}

type NearArena struct {
	ArenaBelong    string ` form:"arena_belong" json:"arena_belong" binding:"required"`
	ArenaLongitude string ` form:"arena_longitude" json:"arena_longitude" binding:"required"`
	ArenaLatitude  string ` form:"arena_latitude" json:"arena_latitude" binding:"required"`
}
