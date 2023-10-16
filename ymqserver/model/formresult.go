package model

import "time"

type FormResult struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'fs_id' comment('文案id')"`
	FsDesc     string    `xorm:"varchar(255) notnull  'fs_desc' comment('文案')"`
	FsIconUrl  string    `xorm:"varchar(255) notnull  'fs_icon_url' comment('文案图片')"`
	Enable     bool      `xorm:"Bool notnull 'enable' default 1 comment('是否可用')"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	CreateTime time.Time `xorm:"DateTime notnull created  'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated  'update_time' comment('更新时间')"`
}
