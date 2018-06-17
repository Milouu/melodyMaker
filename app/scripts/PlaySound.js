class PlaySound
{
    constructor()
    {
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
                sound4: 
                [
                    new Audio(this.path + 'drumKit/cymbal/cymbal-1.wav'),
                    new Audio(this.path + 'drumKit/cymbal/cymbal-2.wav'),
                    new Audio(this.path + 'drumKit/cymbal/cymbal-3.wav'),
                    new Audio(this.path + 'drumKit/cymbal/cymbal-4.wav'),
                    new Audio(this.path + 'drumKit/cymbal/cymbal-5.wav'),
                ], 
            }
        }
        else if(instrument == 'violin')
        {
            sounds = 
            {
                sound1: 
                [
                    new Audio(this.path + 'violin/violin-1.wav')
                ], 
                sound2: 
                [
                    new Audio(this.path + 'violin/violin-2.wav')
                ], 
                sound3: 
                [
                    new Audio(this.path + 'violin/violin-3.wav')
                ], 
                sound4: 
                [
                    new Audio(this.path + 'violin/violin-4.wav')
                ], 
            }
        }
        else if(instrument == 'guitar')
        {
            sounds = 
            {
                sound1: 
                [
                    new Audio(this.path + 'moonGuitar/moonGuitar-1.wav')

                ], 
                sound2: 
                [
                    new Audio(this.path + 'moonGuitar/moonGuitar-2.wav')
                ], 
                sound3: 
                [
                    new Audio(this.path + 'moonGuitar/moonGuitar-3.wav')
                ], 
                sound4: 
                [
                    new Audio(this.path + 'moonGuitar/moonGuitar-4.wav')
                ], 
            }
        }

        this.sounds = sounds
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
    playTrack(track, bpm)
    {   
        const sound1Delay = (track.sounds.sound1[this.counts[0]] * track.bpm) / bpm 
        const sound2Delay = (track.sounds.sound2[this.counts[1]] * track.bpm) / bpm
        const sound3Delay = (track.sounds.sound3[this.counts[2]] * track.bpm) / bpm
        const sound4Delay = (track.sounds.sound4[this.counts[3]] * track.bpm) / bpm

        if(this.beginDate - this.timeSpent + sound1Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * this.sounds.sound1.length)

            this.sounds.sound1[random].currentTime = 0
            this.sounds.sound1[random].play()
            this.counts[0]++
        }
        else if(this.beginDate - this.timeSpent + sound2Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * this.sounds.sound2.length)
            this.sounds.sound2[random].currentTime = 0
            this.sounds.sound2[random].play()
            this.counts[1]++
        }
        else if(this.beginDate - this.timeSpent + sound3Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * this.sounds.sound3.length)
            this.sounds.sound3[random].currentTime = 0
            this.sounds.sound3[random].play()
            this.counts[2]++
        }
        else if(this.beginDate - this.timeSpent + sound4Delay <= Date.now())
        {
            const random = Math.floor(Math.random() * this.sounds.sound4.length)
            this.sounds.sound4[random].currentTime = 0
            this.sounds.sound4[random].play()
            this.counts[3]++
        }

        this.animationFrame = window.requestAnimationFrame(this.playTrack.bind(this, track, bpm, this.counts))

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
    mute()
    {
        for(const sound in this.sounds)
        {
            for(const audio of this.sounds[sound])
            {
                audio.volume = 0
            }

        }
    }
    unMute()
    {
        for(const sound in this.sounds)
        {
            for(const audio of this.sounds[sound])
            {
                audio.volume = 1
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