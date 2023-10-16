package model

import "time"

type Emoj struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'emo_id' comment('表情id')"`
	EmoDesc    string    `xorm:"varchar(255) notnull  'emo_desc' comment('表情描述')"`
	EmoIconUrl string    `xorm:"varchar(255) notnull  'emo_icon_url' comment('表情图片')"`
	Enable     bool      `xorm:"Bool notnull 'enable' default 1 comment('是否可用')"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	CreateTime time.Time `xorm:"DateTime notnull created  'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated  'update_time' comment('更新时间')"`
}
