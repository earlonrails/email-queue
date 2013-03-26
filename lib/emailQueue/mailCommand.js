var mailCommand = function(mailClient){
  switch (mailClient) {
    case "mutt":
      return function(body, subject, from, to){
        return "echo '" + body + "' | EMAIL='" + from + "' mutt -s '" + subject + "' -- '" + to + "'";
      };
    break;
    case "mail":
      return function(body, subject, from, to){
        return "echo '" + body + "' | mail -s '" + subject + "' '" + to + "' -f '" + from + "'";
      };
    break;
    case "gnu-mail":
      return function(body, subject, from, to){
        return "echo '" + body + "' | mail -s '" + subject + "' -a 'From:" + from + "' '" + to + "'";
      };
    break;
    default:
      return function(body, subject, from, to){
        console.log("body: " + body + " subject: " + subject + " from: " + from + " to: " + to);
        return "echo '" + body + " subject " + subject + " from " + from + " to " + to + "'";
      };
  }
}

exports.mailCommand = mailCommand;
