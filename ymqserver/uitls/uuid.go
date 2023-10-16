package uitls

import (
	"ymqserver/logger"

	uuid "github.com/satori/go.uuid"
)

func GetUUID() string {
	value := uuid.NewV4().String()
	logger.Logger.Info("uuid  SUCCESS")
	return value
}
