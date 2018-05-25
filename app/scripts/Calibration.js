class Calibration
{
  constructor()
  {
    this.addStick = document.querySelector('.pickedColors__addStick')
    // this.color1 = document.querySelector('.pickedColors__color1')
    // this.color2 = document.querySelector('.pickedColors__color2')
    // this.trashcan1 = this.color1.querySelector('.pickedColors__trashcan')
    // this.trashcan2 = this.color2.querySelector('.pickedColors__trashcan')
    this.video = document.querySelector('.calibration')
    
    this.eyeDropper = document.querySelector('.eyeDropper')
    this.eyeDropperCursor = document.querySelector('.eyeDropper__greyRing')
    
    console.log(this.video)

    this.colors = document.querySelectorAll('.pickedColors__color')
    this.colorsHitbox = document.querySelector('.pickedColors__hitbox')
    this.trashcans = document.querySelectorAll('.pickedColors__trashcan')

    this.mouse = { x: 0, y: 0 }

    this.addStick.addEventListener('click', () => 
    { 
      this.addColor() 
      this.flash(this.addStick)
    })
    
    // Trashcan events
    for(const trashcan of this.trashcans)
    {
      // Launch removeColor() on click
      trashcan.addEventListener('click', () => { this.removeColor(trashcan) })

      // Set eyeDropper style when mouseneter and mouseleave on trashcan
      // trashcan.addEventListener('mouseenter', () => 
      // { 
      //   this.eyeDropperCursor.classList.add('eyeDropper--delete')
      //   trashcan.addEventListener('mouseleave', () => 
      //   {
      //     this.eyeDropperCursor.classList.remove('eyeDropper--delete')
      //   })
      // })
    }

    // Set eyeDropper style when mouseneter and mouseleave on color cards.
    for(const color of this.colors)
    {
      color.addEventListener('mouseenter', () => 
      {
        this.eyeDropperCursor.classList.add('eyeDropper--delete')

        color.addEventListener('mouseleave', () => 
        {
          this.eyeDropperCursor.classList.remove('eyeDropper--delete')
        })
      })
      // color.addEventListener('click', () => 
      // {
      //   this.flash(color)
      // })
    }

    // Set eyeDropper style between colors
    this.colorsHitbox.addEventListener('mouseenter', () => 
    {
      console.log('ENTERRRRR')
      this.eyeDropperCursor.classList.add('eyeDropper--delete')

      this.colorsHitbox.addEventListener('mouseleave', () => 
      {
        this.eyeDropperCursor.classList.remove('eyeDropper--delete')
      })
    })

    this.addStick.addEventListener('mouseenter', () => 
    {
      this.eyeDropperCursor.classList.add('eyeDropper--delete')

      this.addStick.addEventListener('mouseleave', () => 
      {
        this.eyeDropperCursor.classList.remove('eyeDropper--delete')
      })
    })
      
    this.setMouse()

    // this.eyeDropperInit()
  }

  addColor()
  {
    this.eyeDropperInit()
    if(!this.addStick.classList.contains('pickedColors__addStick--oneColor'))
    {
      this.colors[0].classList.add('pickedColors__color--active')
      this.addStick.classList.add('pickedColors__addStick--oneColor')
    }
    else if(this.addStick.classList.contains('pickedColors__addStick--oneColor') && this.colors[1].classList.contains('pickedColors__color--secondIsFirst'))
    {
      this.colors[0].classList.add('pickedColors__color--active')
    }
    else
    {
      this.colors[1].classList.add('pickedColors__color--active')
      this.addStick.classList.add('pickedColors__addStick--twoColor')
    }
  }

  removeColor(trashcan)
  {
    console.log(this.colors[1].classList.contains('pickedColors__color--active'))
    if(trashcan === this.trashcans[0])
    {
      this.colors[0].classList.remove('pickedColors__color--active')
    
      if(this.colors[1].classList.contains('pickedColors__color--active') && !this.colors[1].classList.contains('pickedColors__color--secondIsFirst'))
      {
        this.addStick.classList.remove('pickedColors__addStick--twoColor')
        this.colors[0].classList.add('pickedColors__color--firstIsSecond')
        this.colors[1].classList.add('pickedColors__color--secondIsFirst')
      }
      else if(this.colors[1].classList.contains('pickedColors__color--active') && this.colors[1].classList.contains('pickedColors__color--secondIsFirst'))
      {
        this.addStick.classList.remove('pickedColors__addStick--twoColor')
      }
      else
      {
        this.addStick.classList.remove('pickedColors__addStick--oneColor')
      }
    }
    else if(trashcan === this.trashcans[1])
    {
      this.colors[1].classList.remove('pickedColors__color--active')

      if(this.colors[1].classList.contains('pickedColors__color--secondIsFirst') && !this.colors[0].classList.contains('pickedColors__color--active'))
      {
        this.addStick.classList.remove('pickedColors__addStick--oneColor')
        this.colors[0].classList.remove('pickedColors__color--firstIsSecond')
        this.colors[1].classList.remove('pickedColors__color--secondIsFirst')
      } 
      else if(this.colors[1].classList.contains('pickedColors__color--secondIsFirst') && this.colors[0].classList.contains('pickedColors__color--active'))
      {
        this.addStick.classList.remove('pickedColors__addStick--twoColor')
        this.colors[0].classList.remove('pickedColors__color--firstIsSecond')
        this.colors[1].classList.remove('pickedColors__color--secondIsFirst')
      } 
      else
      {
        this.addStick.classList.remove('pickedColors__addStick--twoColor')
      }    
    }
  }

  setMouse()
  {
    window.addEventListener('mousemove', (event) => 
    {
      this.mouse.x = event.clientX
      this.mouse.y = event.clientY
      
      this.eyeDropperMove()
    })
  }
  eyeDropperInit()
  {
    const body = document.querySelector('body')

    body.classList.add('cursor--undisplay')
    // body.style.cursor = 'none'
    
    this.eyeDropperCursor.classList.add('eyeDropper--transparent')
    this.eyeDropperMove()

    this.video.addEventListener('mouseenter', () => 
    {
      // console.log('opacity 1')
      // this.eyeDropperCursor.style.opacity = '1'
      this.eyeDropperCursor.classList.remove('eyeDropper--transparent')
      this.eyeDropperCursor.classList.add('eyeDropper--display')
      this.video.addEventListener('mouseleave', () => 
      {
        this.eyeDropperCursor.classList.remove('eyeDropper--display')
        this.eyeDropperCursor.classList.add('eyeDropper--transparent')
        // this.eyeDropperCursor.style.opacity = '0.2'
      })
    })
  }
  eyeDropperMove()
  {
    this.eyeDropper.style.transform = `translate(${this.mouse.x - (this.eyeDropper.offsetWidth / 2)}px, ${this.mouse.y - (this.eyeDropper.offsetHeight / 2)}px) scale(1)`
  }
  eyeDropperRemove()
  {
    eyeDropper.style.opacity = '0'
  }
  flash(container)
  {
      console.log('toggle')
      const $expenders = []
      const $expender = document.createElement('div')

      $expender.classList.add('hoverButton__background')
      $expender.classList.add('hoverButton__background--climb')
      container.appendChild($expender)
      $expenders.push($expender)
      
      for(const $expender of $expenders){ setTimeout(() => { $expender.remove() }, 500) }
  }
}
// new Calibration()