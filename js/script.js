const canvas = document.querySelector('canvas'),
      toolBtns = document.querySelectorAll('.tool'),
      fillcolor = document.querySelector('#fill-color'),
      sizeSlider = document.querySelector('#size-slider'),
      colorBtns = document.querySelectorAll('.colors .option'),
      colorPicker = document.querySelector('#color-picker'),
      clearCanvasBtn = document.querySelector('.clear-canvas'),
      saveImageBtn = document.querySelector('.save-img')


 let ctx = canvas.getContext('2d'),
 isdrawing = false,
 brushWidth = 5,
 selectedTool = 'brush',
 selectedColor = '#000',
 preMouseX,
 preMouseY,
 snapshot


 const setCanvasBackground = () => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor
 }

 window.addEventListener('load', () => {
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
setCanvasBackground()
})

const startDraw = e => {
  isdrawing = true
  preMouseX = e.offsetX
  preMouseY = e.offsetY
  ctx.beginPath()
  ctx.lineWidth = brushWidth
  ctx.strokeStyle = selectedColor
  ctx.fillStyle = selectedColor
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
  console.log(snapshot)
}

const drawRectangle = e => {
fillcolor.checked ? ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY) :
                  ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY)
}

const drawCircle = e => {
  ctx.beginPath()
  const radius = Math.sqrt(Math.pow(preMouseX - e.offsetX, 2)) + Math.pow(preMouseY - e.offsetY, 2)
  ctx.arc(preMouseX, preMouseY, radius, 0, 2* Math.PI)
  fillcolor.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = e => {
  ctx.beginPath()
  ctx.moveTo(preMouseX, preMouseY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY)
  ctx.closePath()
  fillcolor.checked ? ctx.fill() : ctx.stroke()
}


const drawing = e => {
  if(!isdrawing) return
  ctx.putImageData(snapshot, 0, 0)

  switch (selectedTool) {
    case 'brush':
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()
      break
     case 'rectangle':
     drawRectangle(e)
     break
     case 'circle':
      drawCircle(e)
      break
     case 'triangle' :
      drawTriangle(e)
      break
     case 'eraser':
      ctx.strokeStyle = '#fff'
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()
      default:
      break
  }
}

toolBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .active').classList.remove('active')
    btn.classList.add('active')
    selectedTool = btn.id
    console.log(`Selected tools ${selectedTool}`)
  })
})

sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value))

colorBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    document.querySelector(' .options .selected').classList.remove('selected')
    btn.classList.add('selected')
    const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
    selectedColor = bgColor
  } )
})

colorPicker.addEventListener('change', () => {
  colorPicker.parentElement.background = colorPicker.value
  colorPicker.parentElement.click()
})

clearCanvasBtn.addEventListener('click', () => {
ctx.clearRect(0, 0, canvas.width, canvas.height)
setCanvasBackground()
})

saveImageBtn.addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = `ravshan_paint ${Date.now()}.jpg`
  link.href = canvas.toDataURL()
  link.click()
})

const stopDraw = () => {
  isdrawing = false
}

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)