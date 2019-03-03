const config = require('./config.json');

const curl = require('curlrequest');
const SparkPost = require('sparkpost');

// Search curl error message for the following substrings. Status: 0 = server off, 1 = server on
const messages = [
  {
    search: 'reply', // "Server didn't reply anything"
    status: 0
  },
  {
    search: 'Failure in receiving',
    status: 0
  },
  {
    search: 'connect',
    status: 1
  },
];

// Send an email containing `message` to the list of recipients specified in the config file
const send_email = function(message){

  const mail = new SparkPost(config.sparkpost_api_key);

  mail.transmissions.send({
    content: {
      from: config.from_address,
      subject: 'Server status notification',
      html:'<html><body><p>' + message + '</p></body></html>'
    },
    return_path: config.email_return_path,
    recipients: config.emails.map(email => ({address: email})),
  })
  .then(data => {
    // Email was successful
  })
  .catch(err => {
    // Email failed
    console.error(err);
  });
}

// Once the status of a server is determined, handle what to do next
const handle_status = function(hostname, status, curl_message){

  let message = '';

  if(status===1){
    // Server is on, send email
    message = '<p>Host ' + hostname + ' is powered on.</p>';
  }else if(status===0){
    // Server is off, don't do anything
    // message = '<p>Host ' + hostname + ' is NOT powered on.</p>';
  }else{
    // Error, send email
    message = '<p>Error: could not determine whether host ' + hostname + ' is powered on.</p>';
  }

  if(message){
    send_email(message + '<p><b>cURL output is:</b> ' + curl_message + '</p>');
  }

}

module.exports.init = function(){

  config.hosts.forEach(host => {

    curl.request({ url: host, verbose: true }, (err, parts) => {

      if(err){
        
        // Track whether a match was found for the cURL error message
        let matched = 0;

        // Check each message for match
        messages.forEach(item => {
          if(err.indexOf(item.search) > -1){
            matched = 1;
            handle_status(host, item.status, err);
          }  
        });
        
        // No match was found for the cURL error message
        if(matched===0){
          handle_status(host, null, err);
        }

      }else{
        handle_status(host, 1, 'Server responded with headers and data.');
      }

    });
  });
};

require('make-runnable');