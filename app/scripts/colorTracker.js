class ColorTracker {
	constructor(width, height) {

		const video = document.createElement('video')
		video.src = 'assets/videos/minions.mp4'
		video.controls = true
		video.muted = true
		video.autoplay = true

		const $body = document.querySelector('body')
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')

		canvas.width = width
		canvas.height = height

		$body.appendChild(video)
		$body.appendChild(canvas)

		const $video = document.querySelector('video')

		$video.addEventListener('play', () =>
		{
			draw(this, context, width, height)
		}, false)

		const draw = (video, context, width, height) =>
		{
			if($video.paused || $video.ended) return false
			context.drawImage($video, 0, 0, canvas.width, canvas.height)
			setTimeout(draw, 20, $video, context, width, height)
		}
	}
}
