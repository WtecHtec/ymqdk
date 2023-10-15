
class EventBus {
	constructor() {
		this.data = {}
	}

	on(envetName, fn) {
		if (!envetName || typeof fn !== 'function') return
		if (Array.isArray(this.data[envetName])) {
			this.data[envetName].push(fn)
		}
		this.data[envetName] = [fn]
	}

	emit(envetName, ...arg) {
		if (!this.data[envetName]) return
		this.data[envetName].forEach(fn => {
			fn(...arg)
		})
	}

	off(envetName, fn) {
		if (!this.data[envetName]) return
		this.data[envetName] = this.data[envetName].filter(item => item !== fn)
	}
}

export default EventBus