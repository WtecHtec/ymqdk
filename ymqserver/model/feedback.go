package model

import "time"

type FeedBack struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'fb_id' comment('反馈id')"`
	FbDesc     string    `xorm:"varchar(255) notnull  'fb_desc' comment('问题描述')" form:"desc" json:"desc" binding:"required"`
	FbScore    string    `xorm:"varchar(255) notnull  'fb_score' comment('评分')" form:"score" json:"score" binding:"required"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	CreateTime time.Time `xorm:"DateTime notnull created  'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated  'update_time' comment('更新时间')"`
}

// ALTER TABLE feed_back MODIFY fb_desc varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '问题描述';

// ALTER TABLE feed_back CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
