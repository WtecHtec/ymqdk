package uitls

import (
	"ymqserver/logger"
	"ymqserver/model"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

var Identity_Key = "info"

// 解析token
func PaserToken(token string, authMiddleware *jwt.GinJWTMiddleware) string {
	tk, ok := authMiddleware.ParseTokenString(token)
	if ok != nil {
		logger.Logger.Error("paserToken error")
		return ""
	}
	claims := jwt.ExtractClaimsFromToken(tk)
	return claims[Identity_Key].(string)
}

// 获取 当前用户 openid
func GetLoginOpenId(c *gin.Context) string {
	openId, ok := c.Get(Identity_Key)
	if ok == false {
		return ""
	}
	return openId.(*model.User).OpenId
}
