package model

import "time"

type Record struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'record_id' comment('id')"`
	ArenaId    string    `xorm:"varchar(64) notnull  'arena_id' comment('场地id')"`
	EmojId     string    `xorm:"varchar(64) notnull  'emoj_id' comment('场地id')"`
	RecordImg  string    `xorm:"varchar(64) notnull  'record_img' comment('图片')"`
	RecordDesc string    `xorm:"varchar(255) notnull  'record_desc' comment('文字')"`
	Enable     bool      `xorm:"Bool notnull 'enable' default 1 comment('是否可用')"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	CreateTime time.Time `xorm:"DateTime notnull created  'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated  'update_time' comment('更新时间')"`
}
