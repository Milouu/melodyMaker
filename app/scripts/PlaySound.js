class PlaySound
{
    constructor()
    {
        this._snare = document.querySelector('.snare')
        this._hiHat = document.querySelector('.hi-hat')
        this.date = null

        this.sounds = {}
        this.count1 = 0
        this.count2 = 0

        this.path = 'assets/sounds/'
        this.once = true

        
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
    play()
    {

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
    playTrack(sounds, track, bpm, counts)
    {   

        this.once ? this.date = Date.now() : false

        this.once = false

        const sound1Delay = (track.delays.delay1[counts[0]] * track.bpm) / bpm 
        const sound2Delay = (track.delays.delay2[counts[1]] * track.bpm) / bpm

        if(this.date + sound1Delay <= Date.now())
        {
            sounds.sound1.currentTime = 0
            sounds.sound1.play()
            counts[0]++
        }
        else if(this.date + sound2Delay <= Date.now())
        {
            sounds.sound2.currentTime = 0
            sounds.sound2.play()
            counts[1]++
        }

        const animationFrame = window.requestAnimationFrame(this.playTrack.bind(this, sounds, track, bpm, counts))

        let totalCount = 0

        for(let count of counts)
        {
            totalCount += count
        }

        if(totalCount == track.delays.delay1.length + track.delays.delay2.length)
        {
            window.cancelAnimationFrame(animationFrame)
            this.once = true
        }
    }
}