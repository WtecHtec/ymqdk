package router

import (
	"net/http"
	"ymqserver/config"
	"ymqserver/dao"
	"ymqserver/model"
	"ymqserver/uitls"

	"github.com/gin-gonic/gin"
)

func InitAuthFeebBackRouter(r *gin.RouterGroup) {
	r.POST("/createfeedback", authHandleCreateFeedBack)
}
func authHandleCreateFeedBack(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var feebBack model.FeedBack
	if err := c.ShouldBind(&feebBack); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.CreateFeedBack(openId, feebBack.FbDesc, feebBack.FbScore)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE]})
}
