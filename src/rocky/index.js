var rocky = require('rocky');

var fonts = ['24px Gothic', '18px Gothic'];

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

function drawTime(ctx, w, d) {
  var time = d.toLocaleTimeString(undefined, { hour: '2-digit' }) + ':' + d.toLocaleTimeString(undefined, { minute: '2-digit' });
  ctx.fillStyle = 'white';
  ctx.font = fonts[0];
  ctx.textAlign = 'center';

  if(parseInt(d.toLocaleTimeString(undefined, { minute: 'numeric' })) > 55){
    console.log("true");
    console.log(parseInt(d.toLocaleTimeString(undefined, { hour: 'numeric' })));
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 125, w);
    } else{
      ctx.fillText(time, w / 2, 110, w);
    }
  }
  else if (parseInt(d.toLocaleTimeString(undefined, { minute: 'numeric' })) < 5){
    console.log("false");
    console.log(parseInt(d.toLocaleTimeString(undefined, { hour: 'numeric' })));

    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 125, w);
    } else{
      ctx.fillText(time, w / 2, 110, w);
    }

  }else {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 25, w);
    } else{
      ctx.fillText(time, w / 2, 20, w);
    }
  }
}


function drawDate(ctx, w, h, d) {
  var date = d.toLocaleDateString(undefined, { day: '2-digit' });

  if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
    ctx.fillStyle = 'white';
    ctx.font = fonts[1];
    ctx.textAlign = 'center';
    console.log("The watch is a chalk device");
    ctx.fillText(date, 120, 79, w);
  } else {
    // Add this to the front of date to show the mothth number (This has not been tested yet)
    // d.toLocaleDateString(undefined, {month: '2-digit'})  + '.' 
    ctx.fillStyle = 'white';
    ctx.font = fonts[1];
    ctx.textAlign = 'center';
    console.log("The watch is not a chalk device");
    ctx.fillText(date, 95, 72, w);
  }

}

function adjustHeight(ctx, yCoordinate) {
  return yCoordinate * (ctx.canvas.unobstructedHeight / ctx.canvas.clientHeight);
}

function drawMarkers(ctx) {
  if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
    // Device is round
    ctx.fillStyle = 'white';
    ctx.fillRect(89.5, 0, 2, 24);
    ctx.fillRect(89, 156, 2, 24);
    ctx.fillRect(156, 91, 24, 2);
    ctx.fillRect(0, 91, 24, 2);
  } else {
    // Device is not round
    ctx.fillStyle = 'white';
    ctx.fillRect(72, 0, 2, 20);
    ctx.fillRect(71, adjustHeight(ctx, 144), 2, 24);
    ctx.fillRect(120, adjustHeight(ctx, 85), 24, 2);
    ctx.fillRect(0, adjustHeight(ctx, 85), 24, 2);
    // }
  }
}

function drawHand(ctx, cx, cy, angle, length, color) {
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  ctx.lineWidth = 4;
  ctx.strokeStyle = color;

  ctx.beginPath();

  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  ctx.stroke();
}

rocky.on('draw', function (event) {
  var ctx = event.context;
  var d = new Date();

  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  drawMarkers(ctx);

  var cx = w / 2;
  var cy = h / 2;

  var maxLength = (Math.min(w, h) - 20) / 2;

  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);

  drawHand(ctx, cx, cy, minuteAngle, maxLength, "white");

  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);

  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "lightblue");
  drawTime(ctx, w, d);
  drawDate(ctx, w, h, d);

  ctx.fillStyle = 'white';
  ctx.rockyFillRadial(cx, cy, 0, 4, 0, 2 * Math.PI);



});

rocky.on('minutechange', function (event) {
  rocky.requestDraw();

});