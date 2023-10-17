package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"ymqserver/uitls"
)

func PicVerificat() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		if method == "GET" {
			openId := uitls.GetLoginOpenId(c)
			fmt.Println(openId)
		}
		c.Next()
	}
}
