var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.sendFile('basic.html', {root: './public'});
});

app.use(express.static('public'));

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
