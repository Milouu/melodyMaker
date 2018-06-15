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
                    delay3: [],
                    delay4: [],
                },
                bpm: 120
            }, 
            {
                instrument: 'guitar',
                delays: 
                {
                    delay1: [0, 2500],
                    delay2: [1000, 3000],
                    delay3: [],
                    delay4: [],
                },
                bpm: 120
            }, 

        ]
        this.bpm = 120

        this.loop = true

        this.cursorTimeline = new TimelineMax({ paused: true })
        // this.addi = document.querySelector('.dashboard__add')
    }
    add()
    {
        const addButton = document.querySelector('.dashboard__add')
        const instruments = document.querySelector('.instruments')
        const dashboard = document.querySelector('.dashboard')
        const playButton = document.querySelector('.dashboard__play')
        const track = document.querySelector('.dashboard__track')
        console.log(track)
        console.log('WIDTH ' + track.offsetWidth)
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

        this.cursorTimeline.to('.dashboard__cursor', 16 * 60 / this.bpm, {x: track.offsetWidth - cursor.offsetWidth / 2, ease: Power0.easeNone, onComplete: this.cursorReset, onCompleteScope: this, onCompleteParams: [cursor, track] })
        
        playButton.addEventListener('click', () => 
        {
            
            this.cursorTimeline.paused(!this.cursorTimeline.paused())
            
            if(!this.cursorTimeline.paused())
            {
                console.log('coucou')
                this.trackController.updateDate()
                this.trackController.playTrack(this.trackController.initInstrument(this.tracks[0].instrument), this.tracks[0], this.bpm)
            }
            else
            {
                this.trackController.pause()
            }
        })
    }
    cursorReset(cursor, track)
    {
            this.cursorTimeline.set('.dashboard__cursor', {x: - cursor.offsetWidth / 2})
            this.cursorTimeline.to('.dashboard__cursor', 16 * 60 / this.bpm, {x: track.offsetWidth - cursor.offsetWidth / 2, ease: Power0.easeNone, onComplete: this.cursorReset, onCompleteScope: this, onCompleteParams: [cursor, track] })
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
        this.trackController = new PlaySound() 
        console.log(this.trackController)

    }
    ending()
    {
        this.end = true
    }
    endRemove()
    {
        return this.end
    }
}