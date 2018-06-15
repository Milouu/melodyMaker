class PlaySound
{
    constructor()
    {
        this._snare = document.querySelector('.snare')
        this._hiHat = document.querySelector('.hi-hat')
        this.beginDate = null

        this.sounds = {}
        this.count1 = 0
        this.count2 = 0

        this.path = 'assets/sounds/'
        this.once = true

        this.animationFrame = null
        this.currentTimeSpent = 0
        this.timeSpent = 0

        this.counts = this.initCount(4)
        
        // this.playTrack(this.initInstrument(this.tracks[0].instrument), this.tracks[0], 100, this.initCount(2))
        // this.playTrack(this.initInstrument(this.tracks[1].instrument), this.tracks[1], 100, this.initCount(2))
    }
    initInstrument(instrument)
    {
        let sounds = {}

        if(instrument == 'drum')
        {
            sounds = 
            {
                sound1: new Audio(this.path + 'blueBirdSnare.mp3'), 
                sound2: new Audio(this.path + 'blueBirdHiHat.mp3'), 
            }
        }
        else if(instrument == 'guitar')
        {
            sounds = 
            {
                sound1: new Audio(this.path + 'do-majeur.m4a'), 
                sound2: new Audio(this.path + 're-majeur.m4a'), 
            }
        }

        return sounds
    }
    updateDate()
    {
        this.beginDate = Date.now()
    }
    initCount(countNumber)
    {
        const counts = []

        for(let i = 0; i < countNumber; i++)
        {
            const count = 0
            counts.push(count)
        }
        return counts
    }
    playTrack(sounds, track, bpm)
    {   
        const sound1Delay = (track.delays.delay1[this.counts[0]] * track.bpm) / bpm 
        const sound2Delay = (track.delays.delay2[this.counts[1]] * track.bpm) / bpm

        if(this.beginDate - this.timeSpent + sound1Delay <= Date.now())
        {
            sounds.sound1.currentTime = 0
            sounds.sound1.play()
            console.log(this.counts)
            this.counts[0]++
        }
        else if(this.beginDate - this.timeSpent + sound2Delay <= Date.now())
        {
            sounds.sound2.currentTime = 0
            sounds.sound2.play()
            this.counts[1]++
        }

        this.animationFrame = window.requestAnimationFrame(this.playTrack.bind(this, sounds, track, bpm, this.counts))

        // let totalCount = 0

        // for(let count of counts)
        // {
        //     totalCount += count
        // }
        // console.log((Date.now() - (this.beginDate - this.timeSpent)))
        if(Date.now() - (this.beginDate - this.timeSpent) >= (16 * 60000 / bpm )) 
        {
            this.timeSpent = 0
            this.beginDate = Date.now()
            // window.cancelAnimationFrame(animationFrame)
            console.log('END')
            // this.beginDate = Date.now()

            for(let count of this.counts.keys())
            {
                this.counts[count] = 0
            }
        }

        // if(totalCount == track.delays.delay1.length + track.delays.delay2.length)
        // {
        //     window.cancelAnimationFrame(animationFrame)
        //     this.once = true
        // }
    }
    pause()
    {
        window.cancelAnimationFrame(this.animationFrame)

        // this.currentTimeSpent += Date.now() - this.beginDate
        this.timeSpent += Date.now() - (this.beginDate)
        console.log('TIMESPENT ' + this.timeSpent)

    }
    reset()
    {
        this.currentTimeSpent = 0
    }
}