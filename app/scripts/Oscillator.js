class Oscillator
{
	constructor(trackingColor)
	{
		this.context = new AudioContext()
		this.oscillator = this.context.createOscillator()

		this.gain = this.context.createGain()

		this.oscillator.frequency.value = 440
		this.gain.gain.value = 0.6

		this.oscillator.connect(this.gain)
		this.gain.connect(this.context.destination)
	}

	play()
	{
		this.oscillator.start(0)
	}

	update()
	{
		this.oscillator.frequency.value = trackingColor.y
		this.gain.gain.value = trackingColor.x / window.innerWidth
		
		requestAnimationFrame(this.update.bind(this))
	}

	stop()
	{
		this.oscillator.stop()
	}
}