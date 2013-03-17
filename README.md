email-queue
==========

Queue up emails to be sent with a delay using an http post.

Clone & Install

    npm install

Copy & Configure mail command.

    cp lib/emailQueue/mailConfig.json.sample lib/emailQueue/mailConfig.json

Currently mail/mailx and mutt are supported.
Mac usually will have mail installed already. To use mutt:

    brew install mutt

Or on Ubuntu

    sudo apt-get install mutt

Start a server.

    node app.js

Navigate to [localhost:8000/email_list](localhost:8000/email_list) to view.

Send a test email request.

    wget --post-data 'body=foo&from=bar&to=foo&subject=bar&delayTime=10000' -qO - http://localhost:8000/email

Optional
========

Edit the `lib/emailQueue/mailCommand.json` file to use another email client, mutt for example.

    {
      "mailFunction" : "mutt"
    }

Default is to use mail.

To track email history.
Install mongodb:

    brew install mongodb

Then you will need to point the email-queue app to your mongo server. Edit the `lib/emailQueue/mailConfig.json`.
Use the http://docs.mongodb.org/manual/reference/connection-string/ format for your `"databaseUrl"`.
