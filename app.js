
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
const port = 80;

AWS.config.update({ region: 'us-east-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/add-product', (req, res) => {
  const { id, name, price } = req.body;
  const params = {
    TableName: 'GadiRozenProducts',
    Item: {
      ProductID: id,
      Name: name,
      Price: Number(price)
    }
  };
  dynamo.put(params, (err, data) => {
    if (err) {
      res.send('Error: ' + JSON.stringify(err));
    } else {
      res.redirect('/');
    }
  });
});

app.get('/products', (req, res) => {
  const params = {
    TableName: 'GadiRozenProducts'
  };
  dynamo.scan(params, (err, data) => {
    if (err) {
      res.send('Error: ' + JSON.stringify(err));
    } else {
      let html = '<h2>Product List</h2><ul>';
      data.Items.forEach(item => {
        html += `<li>${item.ProductID} - ${item.Name} - $${item.Price}</li>`;
      });
      html += '</ul><a href="/">Back</a>';
      res.send(html);
    }
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
