package requestmode

type QueryRecord struct {
	Month string `form:"month" json:"month" binding:"required"`
}

type CreateRecord struct {
}
