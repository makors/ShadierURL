import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 250, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(limiter)

Array.prototype.randoml = function () {
  return this[Math.floor((Math.random()*this.length))];
}

function rand(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

var shadyWords = [
  "b0tnet",
  "RAT",
  "ransomWar3",
  "encrypt0r",
  "Tr0jan",
  "DESTROYR",
  "hijacker",
  "rootkit",
  "bootSector",
  "worm",
  "redLine",
  "stealer",
  "ip_stealer",
  "xxxMovies",
  "Macro",
  "click_me"
]
const fe = [
  ".scr",
  ".exe",
  ".sh",
  ".bat"
]
const urls = {};

app.post('/shortenURL', (req, res) => {
  let shady = "";
  let sha2 = shadyWords;
  for (let i = 0; i < rand(5,7); i++) {
    const listItem = sha2.randoml();
    shady += listItem + '-';
    sha2 = arrayRemove(sha2, listItem);
  }
  var { url } = req.body;
  if (!(url.startsWith('http'))) {
    url = 'http://' + url;
  }
  const id = shady.slice(0, -1) + fe.randoml();
  urls[id] = url;
  res.json({ id });
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const url = urls[id];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
