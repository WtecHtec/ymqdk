package dao

import (
	"fmt"
	"ymqserver/config"
	"ymqserver/datasource"
	"ymqserver/logger"
	"ymqserver/model"
	// "ymqserver/uitls"
)

// 获取文案数据
func GetFormResults() (bool, int, []model.FormResult) {
	datas := make([]model.FormResult, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select fs_desc, fs_icon_url from form_result where  enable = 1 `)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetFormResults获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetFormResults获取数据成功")
	return true, config.STATUS_SUE, datas
}
