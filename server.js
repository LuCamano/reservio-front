const express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist/reservio-front/browser'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/reservio-front/browser/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});