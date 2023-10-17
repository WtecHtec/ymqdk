package dao

import (
	"fmt"
	"ymqserver/config"
	"ymqserver/datasource"
	"ymqserver/logger"
	"ymqserver/responsemode"
	// "ymqserver/uitls"
)

// 根据 记录 id 获取记录详情
func GetRecordById(recordId string) (bool, int, []responsemode.RecordResult) {
	datas := make([]responsemode.RecordResult, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select r.record_img, r.record_desc, date_format(r.create_time, '%Y年%m月%%d日 %H:%i') as str_create_date, a.arena_name, a.arena_location from record r join left arena a on r.arena_id = a.arena_id where enable = 1 and  r.record_id = '%v' `, recordId)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetRecordById获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetRecordById获取数据成功")
	return true, config.STATUS_SUE, datas
}

// 根据 日期 获取记录详情
func GetRecordByMonth(strDate string) (bool, int, []responsemode.RecordResult) {
	datas := make([]responsemode.RecordResult, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select r.record_img, r.record_desc, date_format(r.create_time, '%Y年%m月%%d日 %H:%i') as str_create_date, a.arena_name, a.arena_location from record r join left arena a on r.arena_id = a.arena_id where enable = 1 and  DATE_FORMAT(r.create_time,'%Y-%m') = '%v' `, strDate)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetRecordByMonth获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetRecordByMonth获取数据成功")
	return true, config.STATUS_SUE, datas
}
