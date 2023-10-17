package model

import "time"

type Arena struct {
	Id             string    `xorm:"varchar(64) pk notnull unique 'arena_id' comment('场地id')"`
	Name           string    `xorm:"varchar(255) notnull  'arena_name' comment('场地名字')"`
	ArenaLocation  string    `xorm:"varchar(255) notnull  'arena_location' comment('场地地址')"`
	ArenaLongitude string    `xorm:"varchar(255) notnull  'arena_longitude' comment('场地经度')"`
	ArenaLatitude  string    `xorm:"varchar(255) notnull  'arena_latitude' comment('场地维度')"`
	ArenaBelong    string    `xorm:"varchar(64) notnull  'arena_belong' comment('场地所属地区')"`
	Enable         bool      `xorm:"Bool notnull 'enable' default 1 comment('是否可用')"`
	CreateId       string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	CreateTime     time.Time `xorm:"DateTime notnull created  'create_time' comment('创建时间')"`
	UpdateTime     time.Time `xorm:"DateTime notnull updated  'update_time' comment('更新时间')"`
}
