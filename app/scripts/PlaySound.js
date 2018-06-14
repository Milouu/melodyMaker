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
        } 
        ]

        this.sounds = {}
        this.count1 = 0
        this.count2 = 0

        const path = 'assets/sounds/'

        this.init(this.track.instrument, path)
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
    play(bpm)
    {      
        const sound1Delay = (this.track.sounds.sound1[this.count1] * this.track.bpm) / bpm 
        const sound2Delay = (this.track.sounds.sound2[this.count2] * this.track.bpm) / bpm

        console.log(bpm)
        if(this.date + sound1Delay <= Date.now())
        {
            this.sounds.sound1.currentTime = 0
            this.sounds.sound1.play()
            this.count1++
        }
        else if(this.date + sound2Delay <= Date.now())
        {
            this.sounds.sound2.currentTime = 0
            this.sounds.sound2.play()
            this.count2++
        }

        const animationFrame = window.requestAnimationFrame(this.play.bind(this, bpm))

        if(this.count1 + this.count2 == this.track.sounds.sound1.length + this.track.sounds.sound2.length)
        {
            window.cancelAnimationFrame(animationFrame)
        }
    }
}