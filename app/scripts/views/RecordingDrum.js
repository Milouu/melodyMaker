class RecordingDrum
{
    constructor()
    {   
		this.end = false 
		this.tracksControllers = []
		// this.addi = document.querySelector('.dashboard__add')
		this.cursorAnimation = null
		
		this.drumkit = undefined
		this.cursorTimeline = new TimelineMax({ paused: true })
		this.bpm = 120
    }
    add()
    {
			const timeline = new TimelineMax()
			const playButton = document.querySelector('.dashboard__play')
			const recordButton = document.querySelector('.dashboard__reset')
			const cursor = document.querySelector('.dashboard__cursor')
			const trackDOM = document.querySelector('.toolBar__timeline')
			const inputBpm = document.querySelector('.inputBpm')

			this.animationInit(cursor, trackDOM)

			timeline 
				.staggerFrom('.drumkit', 0.5, {opacity: 0})
				.staggerFrom('.drumkit__img', 0.5, {scale: 0, ease: Power3.easeOut}, 0.1, '-=0.5')
				.from('.toolBar', 0.5, {y: '100%', ease: Power3.easeOut, onComplete: this.instances, onCompleteScope: this}, 0.5)
				.from('.header', 0.5, {y: '-120%', ease: Power3.easeOut}, 0.5)
				.from('.toolBar__timeline', 0.8, {scaleX: 0, transformOrigin: 'left', ease: Power1.easeOut}, 0.5)
				.from('.dashboard__cursor', 0.5, {x: 400, transformOrigin: 'bottom', ease: Power2.easeOut}, '-=0.7')
				.staggerFrom('.toolBar__metric', 0.2, {scaleY: 0, transformOrigin: 'bottom', ease: Power1.easeOut}, 0.1)
		
			this.drumkit = new DrumKit()

			playButton.addEventListener('click', () => 
			{
				this.playPaused()
			})

			recordButton.addEventListener('click', () => 
			{
				this.cursorReverse()
			})

			inputBpm.addEventListener('change', () => {
				const oldBpm = 120
				console.log('OLD BPM ' + oldBpm)
				this.bpm = inputBpm.value
				console.log('NEW BPM ' + this.bpm)
				// this.playPaused()
				this.resetSounds()
				this.cursorReset()
				this.cursorTimeline.timeScale(this.bpm / oldBpm)
			})

			window.addEventListener('keydown', (event) => 
        	{ 
            	if(event.keyCode == 32) 
            	{ 
            	    event.preventDefault()
				
            	    this.playPaused() 
				} 
			})
    }
    remove()
    {
        const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
		timeline
		.to('.drumkit', 2, {opacity: 0})
	}
    
	instances()
	{
		this.tracksControllers = []
        
		this.tracks = this.retrieveRecords()

        for(let index of this.tracks.keys())
        {
            this.tracksControllers.push(new PlaySound())
        }
	}

	animationInit(cursor, track)
    {
		console.log(this.bpm)
		this.cursorAnimation = this.cursorTimeline.to('.dashboard__cursor', 16 * 60 / this.bpm, {x: track.offsetWidth - cursor.offsetWidth / 2, ease: Power0.easeNone, onComplete: this.cursorReset, onCompleteScope: this, onCompleteParams: [cursor, track] })
	}
	
	cursorReset()
    {
        // this.cursorTimeline.set('.dashboard__cursor', {x: - cursor.offsetWidth / 2})
        this.cursorTimeline.pause(0, true)
        this.cursorTimeline.play()
    }
	
	cursorReverse()
	{
		this.cursorTimeline.pause(0, true)
	}
	ending()
	{
		this.end = true
	}
	endRemove()
	{
		return this.end
	}

	setPickedColor(pickedColor)
	{
		this.drumkit.setPickedColor(pickedColor)
	}

	getRecord()
	{
		return this.drumkit.record
	}

	playPaused()
    {
        console.log()
        if(this.cursorTimeline.paused() == true)
        {
            TweenMax.set('.dashboard__pause', { opacity: 1 })
            TweenMax.from('.dashboard__pause', 0.3, { opacity: 0, rotation: -90 })
            // TweenMax.from('.dashboard__pauseBar', 0.3, { rotation: 90 })
            TweenMax.to('.dashboard__playTriangle', 0.3, { rotation: 90, opacity: 0 })
        }
        else
        {
            TweenMax.to('.dashboard__pause', 0.3, { opacity: 0 })
            TweenMax.to('.dashboard__playTriangle', 0.3, { opacity: 1, rotation: 0})
        }
        
        this.cursorTimeline.paused(!this.cursorTimeline.paused())
            
        for(const [index, track] of this.tracksControllers.entries())
        {
            if(!this.cursorTimeline.paused())
            {
                console.log('play')
                track.updateDate()
                track.initInstrument(this.tracks[index].instrument)
                track.playTrack(this.tracks[index], this.bpm)
            }
            else
            {
                track.pause()
            }
        }
	}
	resetSounds()
	{
		for(const [index, track] of this.tracksControllers.entries())
        {
			track.pause()
			track.updateDate()
			track.reset()
        	track.initInstrument(this.tracks[index].instrument)
			track.playTrack(this.tracks[index], this.bpm)
		}
	}

	retrieveRecords()
	{
		return JSON.parse(localStorage.getItem('records'))
    }
	
}