package dao

import (
	"fmt"
	"ymqserver/config"
	"ymqserver/datasource"
	"ymqserver/logger"
	"ymqserver/model"
	"ymqserver/responsemode"
	// "ymqserver/uitls"
)

// 模糊查询场地数据
func GetArenaByLike(like string, arenaBelong string) (bool, int, []model.Arena) {
	datas := make([]model.Arena, 0)
	sqlStr := fmt.Sprintf(`select arena_id, arena_name, arena_location from arena where  enable = 1 and arena_belong ='%v' `, arenaBelong)
	if like != "" {
		sqlStr = fmt.Sprintf(`select arena_id, arena_name, arena_location from arena where  enable = 1 and arena_name like '%%%v%%' and arena_belong ='%v' `, like, arenaBelong)
		logger.Logger.Info(fmt.Sprintf("GetArenaByLike获取数据 模糊查询 "))
	}
	err := datasource.Engine.SQL(sqlStr).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetArenaByLike获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetArenaByLike获取数据成功")
	return true, config.STATUS_SUE, datas
}

// 查询 附近500m 场地
func GetNearbyArena(arenaLongitude string, arenaLatitude string, arenaBelong string) (bool, int, []model.Arena) {
	datas := make([]model.Arena, 0)
	sqlStr := fmt.Sprintf(`
	SELECT
	arena_id, arena_name, arena_location,
	(st_distance (point (arena_longitude, arena_latitude), point(%v, %v) ) * 111195) as distance
	FROM arena
	WHERE arena_belong = '%v'
	ORDER BY distance
	limit 0, 5;`, arenaLongitude, arenaLatitude, arenaBelong)
	err := datasource.Engine.SQL(sqlStr).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetNearbyArena获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetNearbyArena获取数据成功")
	return true, config.STATUS_SUE, datas
}

// 获取 场地 地图 分布
func GetArenaByAll(arenaBelong string) (bool, int, []responsemode.ArenaResult) {
	datas := make([]responsemode.ArenaResult, 0)
	sqlStr := fmt.Sprintf(`
	select a.arena_id,a.arena_location, a.arena_name, a.arena_longitude, a.arena_latitude 
	from arena a
	where  a.enable = 1 and a.arena_belong = '%v'`, arenaBelong)
	err := datasource.Engine.SQL(sqlStr).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetNearbyArena获取数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetNearbyArena获取数据成功")
	return true, config.STATUS_SUE, datas
}
