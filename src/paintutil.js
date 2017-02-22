
function drawCircle(ctx, x, y, r, c) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI, false)
  //ctx.fillStyle = BACKGROUND_COLOR;
  //ctx.fill();
  ctx.lineWidth = 1
  ctx.strokeStyle = c
  ctx.stroke()
}

function drawText(ctx, x, y, text, c) {
  ctx.fillStyle = c
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, x, y)
}

// Draw a line from 1 to 2 with possible offsets
function drawLine(ctx, x1, y1, x2, y2, offset1, offset2, c) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var h = Math.sqrt(dx*dx+dy*dy)

  if (offset1+offset2 >= h) {
    offset1 = offset2 = h/2
  }

  var o1x =  dx/h * offset1;
  var o1y =  dy/h * offset1;
  var o2x =  -dx/h * offset2;
  var o2y =  -dy/h * offset2;

  ctx.beginPath()
  ctx.strokeStyle = c
  ctx.moveTo(x1+o1x, y1+o1y)
  ctx.lineTo(x2+o2x, y2+o2y)
  ctx.stroke()
}

module.exports = {
  drawCircle: drawCircle,
  drawText: drawText,
  drawLine: drawLine,
};
