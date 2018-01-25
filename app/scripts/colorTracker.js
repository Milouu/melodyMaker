class ColorTracker {
	constructor(width, height) {

		const video = document.createElement('video')
		video.src = 'assets/videos/minions.mp4'

		const $body = document.querySelector('body')
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')

		canvas.width = width
		canvas.height = height

		$body.appendChild(video)
		$body.appendChild(canvas)

		context.drawImage(`../${video.src}`, 0, 0, canvas.width, canvas.height)
	}
}

console.log('coucou Milan')