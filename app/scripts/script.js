// const webcam = new Webcam()

// const canvasVideo = new CanvasVideo(window.innerWidth, window.innerHeight, webcam)
// canvasVideo.draw()

// const eyeDropper = new EyeDropper(canvasVideo)

// const trackingColor = new TrackingColor(canvasVideo, eyeDropper)  

// const drumKit = new DrumKit(trackingColor)

// const oscillator = new Oscillator(trackingColor)

const canvas = new WavesCanvas('content__jelly', 'img')
const trackAnimate = new DOMLoader(['container', 'track', 'loop', 'drum', 'loader'], ['container--animate', 'track--animate', 'loop--animate', 'drum--animate', 'loader--unDisplay'])

// const musicalCanvas = new MusicalCanvas()

