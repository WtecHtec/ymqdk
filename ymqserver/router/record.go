package router

import (
	"net/http"
	"ymqserver/config"
	"ymqserver/dao"
	"ymqserver/requestmode"
	"ymqserver/uitls"

	"github.com/gin-gonic/gin"
)

func InitAuthRecordRouter(r *gin.RouterGroup) {
	r.POST("/selectrecordbymonth", authHandleSelectRecordByMonth)
	r.POST("/createrecord", authHandleCreateRecord)
}
func authHandleSelectRecordByMonth(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var rqRecord requestmode.QueryRecord
	if err := c.ShouldBind(&rqRecord); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetRecordByMonth(rqRecord.Month)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

func authHandleCreateRecord(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var record requestmode.CreateRecord
	if err := c.ShouldBind(&record); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.CreateRecord(openId, record)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE]})
}
