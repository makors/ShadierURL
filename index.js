import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import validator from 'validator';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, write, writeFile } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
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
  "click_me",
  "spy",
  "prize",
  "bypass",
  "Bitc0in-Min3r",
  "viagra",
  "crypt0s",
  "g3olocation",
  "cash_prize",
  "installer",
  "ip_hijack",
  "keygen",
  "CRACK_2023",
  "k3ylog",
  "torrent",
  "execute",
  "NFT_Stealer",
  "t0k3n_st3al3r"
]
const fe = [
  ".scr",
  ".exe",
  ".sh",
  ".bat",
  ".zip"
]

const urls = JSON.parse(readFileSync('./domains.json'));

app.post('/shortenURL', (req, res) => {
  var { url } = req.body;
  if (!(validator.isURL(url))) {
    res.status(400).send("Invalid URL.");
    return;
  }
  let shady = "";
  let sha2 = shadyWords;
  for (let i = 0; i < rand(5,7); i++) {
    const listItem = sha2.randoml();
    shady += listItem + '-';
    sha2 = arrayRemove(sha2, listItem);
  }
  if (!(url.startsWith('http'))) {
    url = 'http://' + url;
  }
  const id = shady.slice(0, -1) + fe.randoml();
  urls[id] = url;
  // write url to file
  writeFile('./domains.json', JSON.stringify(urls, null, 2), err => {
    if (err) {console.error(err);}
  })
  res.json({ id });
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const url = urls[id];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).sendFile(__dirname + '/public/404.html');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
