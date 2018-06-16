class DashboardController
{
    constructor()
    {   
        this.end = false 
        this.trackController = null

        this.tracks = 
        [
            {
                instrument: 'drum',
                delays: 
                {
                    delay1: [0, 250, 750, 1000, 1250, 2000, 2250, 2750, 3000, 3250, 4000, 4250, 4750, 5000, 5250, 6000, 6250, 6750, 7000, 7250],
                    delay2: [500, 1500, 2500, 3500, 4500, 5500, 6500, 7500],
                    delay3: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500],
                    delay4: [0, 4000],
                },
                bpm: 120
            }, 
            {
                instrument: 'guitar',
                delays: 
                {
                    delay1: [0, 2500, 6000],
                    delay2: [1000, 3000, 5000, 7000],
                    delay3: [],
                    delay4: [],
                },
                bpm: 120
            },             
        ]
        this.bpm = 60

        this.loop = true

        this.tracksControllers = []

        this.cursorTimeline = new TimelineMax({ paused: true })
        // this.addi = document.querySelector('.dashboard__add')
    }
    add()
    {
        const addButton = document.querySelector('.dashboard__add')
        const instruments = document.querySelector('.instruments')
        const dashboard = document.querySelector('.dashboard')
        const playButton = document.querySelector('.dashboard__play')
        const resetButton = document.querySelector('.dashboard__reset')
        const trackDOM = document.querySelector('.dashboard__track')
        const cursor = document.querySelector('.dashboard__cursor')

        let play = false

        let navMenu = false

        const timeline = new TimelineMax({onStart: this.instances, onStartScope: this})

        timeline 
            .from('.dashboard', 0.5, {scale: 0, ease: Power3.easeOut})
            .from('.dashboard__add', 0.2, {scaleX: 0})
            .from('.dashboard__addPlus', 0.2, {scale: 0}, '-=0.1')
            .from('.dashboard__reset', 0.2, {scale: 0})
            .from('.dashboard__seperator', 0.1, {opacity: 0})
            .from('.dashboard__play', 0.2, {scale: 0})
            .from('.dashboard__trackInstrument', 0.3, {y: -100, opacity: 0}, '-=0')
            .from('.dashboard__track', 0.3, {scaleX: 0, ease: Power1.easeOut})
            .from('.dashboard__userPictureImg', 0.2, {scaleX: 2}, '-=0.1')
            .from('.dashboard__userPicture', 0.2, {x: -100, scaleX: 0}, '-=0.2')
            .from('.dashboard__cursor', 0.3, {x: 600, opacity: 0})
            .staggerFrom('.dashboard__metric', 0.2, {scaleY: 0}, 0.1)

        window.addEventListener('click', (event) => {
            if (addButton.contains(event.target)) {
                // Clicked in buttonToDisplay
                navMenu = true

                TweenMax.to('.dashboard', 0.3, {scale: 1.2, x: '30%', rotationY:'-45', opacity: 1, transformOrigin:'center', cursor: 'pointer'})
                TweenMax.to('.instruments', 0.3, {y: '-50%', scale: 1, opacity: 1, transformOrigin:'center'})
            } 
            else if(instruments.contains(event.target))
            {
                console.log('instrument')
            }
            else {
                // Clicked outside buttonToDisplay and window
                navMenu = false
                dashboard.style.boxShadow = '0px 10px 30px 0px rgba(0, 0, 0, 0.06)'
                TweenMax.to('.dashboard', 0.3, {scale: 1, x: '0%', rotationY:'0', opacity: 1, transformOrigin:'center'})
                TweenMax.to('.instruments', 0.3, {y: '-50%', scale: 0.6, opacity: 0, transformOrigin:'center'})
            }

            dashboard.addEventListener('mouseenter', () => 
            {
                if(navMenu)
                {
                    dashboard.style.boxShadow = '0px 0px 0px 5px #5469FE'
                    dashboard.addEventListener('mouseleave', () => {
                        dashboard.style.boxShadow = '0px 10px 30px 0px rgba(0, 0, 0, 0.06)'
                    })
                }
            })
        })

        this.cursorTimeline.to('.dashboard__cursor', 16 * 60 / this.bpm, {x: trackDOM.offsetWidth - cursor.offsetWidth / 2, ease: Power0.easeNone, onComplete: this.cursorReset, onCompleteScope: this, onCompleteParams: [cursor, trackDOM] })
        
        playButton.addEventListener('click', () => { this.playPaused() })

        resetButton.addEventListener('click', () => { 
            console.log('couco')
            this.cursorTimeline.paused(!this.cursorTimeline.paused())
            for(const track of this.tracksControllers)
            {
                if(this.cursorTimeline.paused() == false)
                {
                    TweenMax.set('.dashboard__pause', { opacity: 1 })
                    TweenMax.from('.dashboard__pause', 0.3, { opacity: 0, rotation: 0 })
                    TweenMax.to('.dashboard__playTriangle', 0.3, { rotation: 90, opacity: 0 })
                }
                else
                {
                    TweenMax.to('.dashboard__pause', 0.3, { opacity: 0, rotation: 0 })
                    TweenMax.to('.dashboard__playTriangle', 0.3, { opacity: 1, rotation: 0})
                }

                console.log(track)
                track.pause()
                track.reset()
                this.cursorReverse()

                // this.cursorReset(cursor, trackDOM)
            }
        })
        window.addEventListener('keydown', (event) => { if(event.keyCode == 32) { this.playPaused() } })
    }
    playPaused()
    {
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
                track.playTrack(track.initInstrument(this.tracks[index].instrument), this.tracks[index], this.bpm)
            }
            else
            {
                track.pause()
            }
        }
    }
    cursorReset(cursor, track)
    {
        this.cursorTimeline.set('.dashboard__cursor', {x: - cursor.offsetWidth / 2})
        this.cursorTimeline.to('.dashboard__cursor', 16 * 60 / this.bpm, {x: track.offsetWidth - cursor.offsetWidth / 2, ease: Power0.easeNone, onComplete: this.cursorReset, onCompleteScope: this, onCompleteParams: [cursor, track] })
    }
    cursorReverse()
    {
        this.cursorTimeline.pause(0, true)
    }
    craftTracks()
    {
        const dashboard = document.querySelector('.dashboard__container')
        dashboard.style.opacity = 0

        for(const track of this.tracks)
        {
            if(track.instrument == 'drum') { this.getTrack('modules/track--drum.html', 'container', '.tracks') }
            else if(track.instrument == 'guitar') { this.getTrack('modules/track--guitar.html', 'container', '.tracks') }
        }
        this.tryCatchTracks(dashboard)
    }
    craftNotes(tracks, tracksDOM)
    {
        for(const [index, track] of tracks.entries())
        {
            console.log('i')
            for(const delay of track.delays.delay1)
            {
                console.log(index)
                const note1 = document.querySelectorAll('.note--1')
                const note = document.createElement('div')
                
                note.classList.add('note', 'note--delay1')
                note1[index].appendChild(note)
                note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`

                window.addEventListener('resize', () => 
                {
                    note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`
                })
            }
            for(const delay of track.delays.delay2)
            {
                const note2 = document.querySelectorAll('.note--2')
                const note = document.createElement('div')

                note.classList.add('note', 'note--delay2')
                note2[index].appendChild(note)
                note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`

                window.addEventListener('resize', () => 
                {
                    note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`
                })
            }
            for(const delay of track.delays.delay3)
            {
                const note3 = document.querySelectorAll('.note--3')
                const note = document.createElement('div')

                note.classList.add('note', 'note--delay3')
                note3[index].appendChild(note)
                note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`

                window.addEventListener('resize', () => 
                {
                    note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`
                })
            }
            for(const delay of track.delays.delay4)
            {
                const note4 = document.querySelectorAll('.note--4')
                const note = document.createElement('div')

                note.classList.add('note', 'note--delay4')
                note4[index].appendChild(note)
                note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`

                window.addEventListener('resize', () => 
                {
                    note.style.transform = `translateX(${(tracksDOM[0].offsetWidth * ((delay * track.bpm) / this.bpm)) / (16 * 60000 / this.bpm)}px)`
                })
            }
        }
    }
    tryCatchTracks(dashboard)
    {
        const tracks = document.querySelectorAll('.dashboard__track')

        if(tracks.length < this.tracks.length)
        {
            setTimeout(() => { this.tryCatchTracks(dashboard) }, 50)
        }
        else
        {
            this.craftNotes(this.tracks, tracks)
            this.add()
            dashboard.style.opacity = 1
        }
    }
    remove()
    {
        const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
        timeline
            .to('.dashboard', 0.3, {scale: 1, x: '60%', rotationY:'-65', opacity: 0, transformOrigin:'center'})
            .to('.instruments', 0.3, {y: '-50%', x: '-50%', rotationY: 45, scale: 0.8, opacity: 0, transformOrigin:'center'}, '-=0.3')
            .to('.header', 0.3, {y: '-120%'}, '-=0.3')
            // .to('.dashboard', 0.3, {scale: 1.2, opacity: 0, transformOrigin:'center'}, '-=0.3')
    }
    instances()
    {
        console.log('intstanceeeee')
        for(let index of this.tracks.keys())
        {
            this.tracksControllers.push(new PlaySound())
        }
    }
    ending()
    {
        this.end = true
    }
    endRemove()
    {
        return this.end
    }
    getTrack(url, from, to)
	{
		// Cache commented for dev
		// const cached = sessionStorage[url]
		if(!from){from="body"} // Default to grabbing body tag
		if(to && to.split){to = document.querySelector(to)} // A string TO turns into an element
		if(!to){to = document.querySelector(from)} // Default re-using the source elm as the target elm
		// if(cached){return to.innerHTML = cached} // Cache responses for instant re-use re-use

		const XHRt = new XMLHttpRequest // New ajax
		XHRt.responseType = 'document'  // Ajax2 context and onload() event
		XHRt.onload = () => { sessionStorage[url] = to.innerHTML += XHRt.response.querySelector(from).innerHTML}
		XHRt.open("GET", url, true)
		XHRt.send()
		return XHRt
	}
}