import { otherHttp } from "../../utils/http";

function getWeatherByLocation(key, location) {
	// 22.55329:113.88308
	const url = `https://api.seniverse.com/v3/weather/daily.json?key=${key}&location=${location}&language=zh-Hans&days=1`
	return otherHttp(url)
}

export {
	getWeatherByLocation
}