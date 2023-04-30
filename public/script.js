var form = document.getElementById('myForm');
var resultDiv = document.getElementById('ct');
var done = document.getElementById('shortened');

form.addEventListener('submit', function(event) {
  // Prevent the form from submitting and reloading the page
  event.preventDefault();
  
  // Send an AJAX request to the server
  var xhr = new XMLHttpRequest();
    xhr.open('POST', '/shortenURL');
    xhr.setRequestHeader('Content-Type', 'application/json');
    // Set the onload event handler to process the server response
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
                resultDiv.innerText = `http://免费缩短网址非常真实.click/${response.id}`;
            } else if (xhr.status === 429) {
                alert('You are being ratelimited. 🚀')
            } else {
                alert('An error occurred');
            }
        };
    }
    xhr.send(JSON.stringify({ url: document.getElementById('url').value}));
    shortened.classList.remove('hidden');
});

function copyURL() {
    var copyText = document.getElementById("ct");
    navigator.clipboard.writeText(copyText.textContent);
    // set the click to copy text
    var copyt = document.getElementById('ctc');
    copyt.innerText = 'Copied to clipboard! 📋';
    copyt.classList.add('text-green-700');
    copyt.classList.remove('text-gray-500');
}