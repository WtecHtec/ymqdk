package dao

import (
	"fmt"
	"ymqserver/config"
	"ymqserver/datasource"
	"ymqserver/logger"
	"ymqserver/model"
	"ymqserver/uitls"
)

// 获取表情数据
func GetEmojs(noticeId string) (bool, int, []Emoj) {
	datas := make([]MsgList, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select emo_icon_url, emo_desc from emoj where  enable = 1 `)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetEmojs获取收集数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetEmojs获取收集数据成功")
	return true, config.STATUS_SUE, datas
}