const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

app.post('/api/get', (req, res) => {
    const data = req.body
    console.log("Message received from agent with OID: " + data.oid + " and PID: " + data.pid)
    res.json({ ...response, property: data.pid, time: new Date().getTime() })
});

// Not found request response
app.use(function(req, res) {
    console.log('URL not found... ' + req.originalUrl)
    res.status(404).send({error: true, 'url': req.originalUrl + ' not found'});
});

app.listen(5000, () => console.log('Mock server listening on port 5000!'))

const response = {
    value: "100",
    description: "some test property representing battery SoC"
  }