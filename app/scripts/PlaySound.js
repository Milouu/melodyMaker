class PlaySound
{
    constructor()
    {
        this._snare = document.querySelector('.snare')
        this._hiHat = document.querySelector('.hi-hat')
        this.date = Date.now()

        this.track = 
        {
            instrument: 'drum',
            sounds: 
            {
                sound1: [0, 500, 1500, 2000, 2500],
                sound2: [1000, 3000],
                sound3: [],
                sound4: [],
            },
            bpm: 120
        } 

        this.tracks = 
        [
            {
                instrument: 'drum',
                sounds: 
                {
                    sound1: [0, 500, 1500, 2000, 2500],
                    sound2: [1000, 3000],
                    sound3: [],
                    sound4: [],
                },
                bpm: 120
            }, 
            {
                instrument: 'drum',
                sounds: 
                {
                    sound1: [],
                    sound2: [0, 500, 1000, 1500, 2000, 2500, 3000],
                    sound3: [],
                    sound4: [],
                },
                bpm: 120
            }, 
        ]

        this.sounds = {}
        this.count1 = 0
        this.count2 = 0

        const path = 'assets/sounds/'

        this.init(this.track.instrument, path)
        this.playTrack(this.tracks[0], 200, this.initCount(2))
        this.playTrack(this.tracks[1], 200, this.initCount(2))
    }
    init(instrument, path)
    {
        if(instrument == 'drum')
        {
            this.sounds = 
            {
                sound1: new Audio(path + 'snare.mp3'), 
                sound2: new Audio(path + 'hi-hat.mp3'), 
            }
        }
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
    playTrack(track, bpm, counts)
    {      
        const sound1Delay = (track.sounds.sound1[counts[0]] * track.bpm) / bpm 
        const sound2Delay = (track.sounds.sound2[counts[1]] * track.bpm) / bpm

        if(this.date + sound1Delay <= Date.now())
        {
            this.sounds.sound1.currentTime = 0
            this.sounds.sound1.play()
            counts[0]++
        }
        else if(this.date + sound2Delay <= Date.now())
        {
            this.sounds.sound2.currentTime = 0
            this.sounds.sound2.play()
            counts[1]++
        }

        const animationFrame = window.requestAnimationFrame(this.playTrack.bind(this,track, bpm, counts))

        let totalCount = 0

        for(let count of counts)
        {
            totalCount += count
        }

        console.log(totalCount)
        if(totalCount == track.sounds.sound1.length + track.sounds.sound2.length)
        {
            window.cancelAnimationFrame(animationFrame)
        }
    }
}