package router

import (
	"net/http"
	"ymqserver/config"
	"ymqserver/dao"
	"ymqserver/requestmode"
	"ymqserver/uitls"

	"github.com/gin-gonic/gin"
)

func InitAuthArenaRouter(r *gin.RouterGroup) {
	r.POST("/selectarenalike", authHandleArenaLike)
	r.POST("/getarenanear", authHandleArenaNear)
	r.POST("/getarenaall", authHandleArenaAll)
}
}
func authHandleArenaLike(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var rqArena requestmode.LikeArena
	if err := c.ShouldBind(&rqArena); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetArenaByLike(rqArena.Name, rqArena.ArenaBelong)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

func authHandleArenaNear(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var rqArena requestmode.NearArena
	if err := c.ShouldBind(&rqArena); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetNearbyArena(rqArena.ArenaLongitude, rqArena.ArenaLatitude, rqArena.ArenaBelong)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}


func authHandleArenaAll(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var rqArena requestmode.LikeArena
	if err := c.ShouldBind(&rqArena); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetArenaByAll(rqArena.ArenaBelong)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}