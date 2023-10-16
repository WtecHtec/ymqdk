package datasource

import (
	"fmt"
	"time"
	"ymqserver/config"
	"ymqserver/logger"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
)

var Engine *xorm.Engine

func InitMysqlXORM() {
	logger.Logger.Info("MySQL start ")
	mysqlConfig := config.BASE_CONFIG.Mysql
	configData := fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8&interpolateParams=true&parseTime=true&loc=Local", mysqlConfig.User, mysqlConfig.Password, mysqlConfig.Host, mysqlConfig.Port, mysqlConfig.DataBase)
	db, err := xorm.NewEngine("mysql", configData)

	if err != nil {
		logger.Logger.Error(fmt.Sprintf("初始化MySQL error 失败 %v:", err))
		return
	}
	err = db.Ping()
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("初始化MySQL error 失败 %v:", err))
		return
	}
	// db.SetMaxOpenConns(50)
	// db.SetMaxIdleConns(50)
	Engine = db
	Engine.TZLocation, _ = time.LoadLocation("Asia/Shanghai")

	sqlHook := logger.GetWriter("./logs/sql.log")
	sqlLoger := xorm.NewSimpleLogger(sqlHook)
	sqlLoger.ShowSQL(true)
	Engine.SetLogger(sqlLoger)
	logger.Logger.Info("MySQL success ")
}
