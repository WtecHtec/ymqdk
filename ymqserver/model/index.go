package model

import (
	"fmt"
	"ymqserver/datasource"
	"ymqserver/logger"
)

func InitModel() {
	logger.Logger.Info("DataTable init start")
	err := datasource.Engine.Sync2(new(User), new(FeedBack), new(Emoj), new(Arena), new(FormResult), new(Record))
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("DataTable error %v", err))
		return
	}
	logger.Logger.Info("DataTable init success")
}
