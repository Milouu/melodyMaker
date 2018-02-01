class Oscillator
{
	constructor(trackingColor)
	{
		this.trackingColor = trackingColor
		this.x = this.trackingColor.x
		this.y = this.trackingColor.y

		this.context = new AudioContext()
		this.oscillator = this.context.createOscillator()
		this.oscillator.frequency.value = 440
		this.oscillator.connect(this.context.destination)
	}

	play()
	{
		this.oscillator.start(0)
	}

	update()
	{
		this.oscillator.frequency.value = trackingColor.y
		requestAnimationFrame(this.update.bind(this))
	}
}