# MelodyMaker

A musical experience project. Make your own melodies using color tracking on objects with flasy colors !

## Features

#### Homepage
- Make that video wiggle by hovering ! (powered by jelly.js library)
- Continue by clicking the button for 1s 

#### Calibration
- Click the '+' to be able to pick a color on the video

- Select the color you wish to track. 
> This project depends highly on your environnement : works best with a flasy color that can't be found in your background (ex: a green stabilo is very good).

- Update or delete the selected color by hovering the color card and clicking on the corresponding button.

- Once you're tracked, hover the four rings to see if your color is suitable. If you can do it without problems, the color you tracked is good for the rest of the experience ! 
> The cursor is currently suffering from a slight offset, you have to put on the bottom right of the rings and not on the center. This will be fixed later !

- If your calibration is successful, you can now hover the big button that appeared to access the dashboard, change the color tracked or pick another color.
> You can pick up to 2 color to have 2 sticks, but the tracking only supports one color for now :(

#### Dashboard
- Here, you can see the list of your tracks. 
> If you don't have track or you connect for the first time, the system will put a default track for the example.

- Play/pause all the tracks together by clicking the play/pause button. 

- Mute a track by hovering and clicking the instrument image on a track.

- Delete a track by hovering  and clicking the user image on a track. 

- Change the bpm in the tool bar to change the speed at which the tracks are played.

- Add a track by clicking the '+' and selectionning the instrument you want !

#### Recording 
- Play the drum by hitting in the zones with your stick. 

- Play the violin and the guitar by hovering the zones with your stick.

- Record a new track by clicking the record button in the toolbar.

- Change the bpm in the toolbar to change the speed of record (& metronome during record).

- Listen to the tracks already recorded by clicking the play button. 
> This can help to play a sound going well with the other tracks.

- Validate the record by hovering (or clicking) the big button at the end with your cursor, or record again with the record button.

- Go back to dashboard without recording by clicking melodyMaker in the header.

## Techs used 
- HTML5 / CSS3
- Stylus 
- Javascript 
- Jelly.js