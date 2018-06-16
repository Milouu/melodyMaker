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
    }
    initInstrument(instrument)
    {
        let sounds = {}

        if(instrument == 'drum')
        {
            sounds = 
            {
                sound1: 
                [
                    new Audio(this.path + 'drumKit/bass/bass-2.mp3'),
                    new Audio(this.path + 'drumKit/bass/bass-1.mp3'),
                    new Audio(this.path + 'drumKit/bass/bass-3.mp3'),
                    new Audio(this.path + 'drumKit/bass/bass-4.mp3'),
                    new Audio(this.path + 'drumKit/bass/bass-5.mp3'),
                ], 
                sound2: 
                [
                    new Audio(this.path + 'drumKit/snare/snare-2.mp3'),
                    new Audio(this.path + 'drumKit/snare/snare-1.mp3'),
                    new Audio(this.path + 'drumKit/snare/snare-3.mp3'),
                    new Audio(this.path + 'drumKit/snare/snare-4.mp3'),
                    new Audio(this.path + 'drumKit/snare/snare-5.mp3'),
                ], 
                sound3: 
                [
                    new Audio(this.path + 'drumKit/hiHat/hiHat-1.mp3'),
                    new Audio(this.path + 'drumKit/hiHat/hiHat-2.mp3'),
                    new Audio(this.path + 'drumKit/hiHat/hiHat-3.mp3'),
                    new Audio(this.path + 'drumKit/hiHat/hiHat-4.mp3'),
                    new Audio(this.path + 'drumKit/hiHat/hiHat-5.mp3'),
                ], 
            }
        }
        else if(instrument == 'guitar')
        {
            sounds = 
            {
                sound1: 
                [
                    new Audio(this.path + 'do-majeur.m4a'),
                    new Audio(this.path + 'do-majeur.m4a'),
                    new Audio(this.path + 'do-majeur.m4a'),
                    new Audio(this.path + 'do-majeur.m4a'),
                    new Audio(this.path + 'do-majeur.m4a'),
                ], 
                sound2: 
                [
                    new Audio(this.path + 're-majeur.m4a'),
                    new Audio(this.path + 're-majeur.m4a'),
                    new Audio(this.path + 're-majeur.m4a'),
                    new Audio(this.path + 're-majeur.m4a'),
                    new Audio(this.path + 're-majeur.m4a'),
                ], 
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
        const sound1Delay = (track.sounds.sound1[this.counts[0]] * track.bpm) / bpm 
        const sound2Delay = (track.sounds.sound2[this.counts[1]] * track.bpm) / bpm
        const sound3Delay = (track.sounds.sound3[this.counts[2]] * track.bpm) / bpm

        if(this.beginDate - this.timeSpent + sound1Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * sounds.sound1.length)

            sounds.sound1[random].currentTime = 0
            sounds.sound1[random].play()
            console.log(this.counts)
            this.counts[0]++
        }
        else if(this.beginDate - this.timeSpent + sound2Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * sounds.sound2.length)
            sounds.sound2[random].currentTime = 0
            sounds.sound2[random].play()
            this.counts[1]++
        }
        else if(this.beginDate - this.timeSpent + sound3Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * sounds.sound3.length)
            sounds.sound3[random].currentTime = 0
            sounds.sound3[random].play()
            this.counts[2]++
        }

        this.animationFrame = window.requestAnimationFrame(this.playTrack.bind(this, sounds, track, bpm, this.counts))

        if(Date.now() - (this.beginDate - this.timeSpent) >= (16 * 60000 / bpm )) 
        {
            this.timeSpent = 0
            this.beginDate = Date.now()

            for(let count of this.counts.keys())
            {
                this.counts[count] = 0
            }
        }
    }
    pause()
    {
        window.cancelAnimationFrame(this.animationFrame)

        this.timeSpent += Date.now() - (this.beginDate)
    }
    reset()
    {
        console.log('reset')
        this.timeSpent = 0

        for(let count of this.counts.keys())
        {
            this.counts[count] = 0
        }
    }
}