var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
function draw_circle(x, y, r, c) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
}
function randint(end, begin=0) {
    return Math.floor(Math.random() * (end-begin+1) + begin)
}
// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
class firefly {
    constructor() {
        this.r = 10;
        this.freq_max = 2;
        this.freq_min = 0.2;
        this.duty_ratio = 0.95;
        this.opacity = 0.0;

        this.x = randint(width-this.r, this.r);
        this.y = randint(height-this.r, this.r);

        //this.silence();
        this.flash(randint(this.freq_max * 10, this.freq_min * 10) / 10);
    }
    silence() {
        this.freq = 0;
        this.isFill = false;
        if (typeof this.interval !== 'undefined') {
            clearInterval(this.interval);
        }
    }
    flash(freq) {
        this.freq = freq;
        this.intv = 1000 / freq;
        this.interval = setInterval(
            ((obj, beam_intv) =>
                (() => obj.beam(beam_intv))
            )(this, this.intv * this.duty_ratio)
        , this.intv);
    }
    beam(beam_intv) {
        this.opacity = 0.0;
        var n_frames = 10;
        let breath_interval = setInterval( ((obj, n_frames) => {
            var step = 1.0 / n_frames;
            var linear = 0.0;
            return () => {
                linear += step;
                obj.opacity = Math.sin(linear * Math.PI / 2);
            }
        })(this, n_frames), beam_intv / (n_frames * 2));
        sleep(beam_intv).then( () => clearInterval(breath_interval) );
    }
    draw() {
        var c_yellow = "rgba(255, 255, 0, " + this.opacity + ')';
        var c = (() => {
            var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r*2);
            grd.addColorStop(0, c_yellow);
            grd.addColorStop(1,"rgba(0, 0, 0, 0)");
            return grd;
        })()
        draw_circle(this.x,this.y,this.r, c);
    }
}
var n = 10;
var ffg = Array(n).fill().map(() => new firefly())

// main function
function update_frame(){
    ctx.clearRect(0, 0, width, height);
    for (let ff of ffg) {
        ff.draw()
    }
}
setInterval(update_frame, 20);
