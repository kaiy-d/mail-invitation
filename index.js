
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/mail', async function (req, res) {

  const mailList = req.body.data;

  let toMailList = '';
  if (mailList.length <= 0) {
    res.status(400).send('Bad Request');
  } else {
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'worldsr.up@gmail.com',
          pass: 'croco0923'
        }
      });

      for (let i = 0; i < mailList.length; i++) {
        toMailList += mailList[i] + ", ";
      }


      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <worldsr.up@gmail.com>',
        to: toMailList,
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>'
      });

      res.status(200).send('Success!');
    } catch (error) {
      res.status(400).send(error);
    }
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));