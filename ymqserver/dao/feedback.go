package dao

import (
	"fmt"
	"strconv"
	"time"
	"ymqserver/config"
	"ymqserver/datasource"
	"ymqserver/logger"
	"ymqserver/model"
	"ymqserver/uitls"
)

func CreateFeedBack(openId string, desc string, score string) (bool, int) {
	feebBack := &model.FeedBack{
		Id:       uitls.GetUUID(),
		CreateId: openId,
		FbDesc:   desc,
		FbScore:  score,
	}
	has, value := datasource.GetRedisByString(openId)
	if has == true {
		if value == "2" {
			return false, config.STATUS_RE
		}
	} else if has == false && value == "empty" {
		ok := datasource.SetRedisByString(openId, 1, 24*time.Hour)
		if ok == false {
			return false, config.STATUS_ERROR
		}
	} else {
		return false, config.STATUS_ERROR
	}
	_, ok := datasource.Engine.Insert(*feebBack)
	if ok != nil {
		logger.Logger.Error(fmt.Sprintf("反馈失败 %v", ok))
		return false, config.STATUS_ERROR
	}
	count, _ := strconv.Atoi(value)
	datasource.SetRedisByString(openId, count+1, 24*time.Hour)
	return true, config.STATUS_SUE
}
