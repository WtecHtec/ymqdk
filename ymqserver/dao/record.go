package dao

import (
	"fmt"
	"strconv"
	"time"
	"ymqserver/config"
	"ymqserver/datasource"
	"ymqserver/logger"
	"ymqserver/model"
	"ymqserver/requestmode"
	"ymqserver/responsemode"
	"ymqserver/uitls"
)

// 根据 记录 id 获取记录详情
func GetRecordById(recordId string) (bool, int, []responsemode.RecordResult) {
	datas := make([]responsemode.RecordResult, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select r.record_img, r.record_desc, date_format(r.create_time, '%Y年%m月%%d日 %H:%i') as str_create_date, a.arena_name, a.arena_location from record r join left arena a on r.arena_id = a.arena_id and a.enable = 1 where r.enable = 1 and  r.record_id = '%v' `, recordId)).Find(&datas)
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
	err := datasource.Engine.SQL(fmt.Sprintf(`select r.record_img, r.record_desc, date_format(r.create_time, '%Y年%m月%%d日 %H:%i') as str_create_date, a.arena_name, a.arena_location from record r join left arena a on r.arena_id = a.arena_id and a.enable = 1 where r.enable = 1 and  DATE_FORMAT(r.create_time,'%Y-%m') = '%v' `, strDate)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetRecordByMonth获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetRecordByMonth获取数据成功")
	return true, config.STATUS_SUE, datas
}

// 插入新的日志
func CreateRecord(openId string, record requestmode.CreateRecord) (bool, int) {
	mRecord := &model.Record{
		Id:        uitls.GetUUID(),
		CreateId:  openId,
		ArenaId:   record.ArenaId,
		EmojId:    record.EmojId,
		RecordImg: record.RecordImg,
	}
	has, value := datasource.GetRedisByString(fmt.Sprintf("record_%v", openId))
	if has == true {
		if value == "2" {
			return false, config.STATUS_RE
		}
	} else if has == false && value == "empty" {
		ok := datasource.SetRedisByString(fmt.Sprintf("record_%v", openId), 1, 24*time.Hour)
		if ok == false {
			return false, config.STATUS_ERROR
		}
	} else {
		return false, config.STATUS_ERROR
	}
	_, ok := datasource.Engine.Insert(*mRecord)
	if ok != nil {
		logger.Logger.Error(fmt.Sprintf("创建记录失败 %v", ok))
		return false, config.STATUS_ERROR
	}
	count, _ := strconv.Atoi(value)
	datasource.SetRedisByString(fmt.Sprintf("record_%v", openId), count+1, 24*time.Hour)
	return true, config.STATUS_SUE
}
