const request = require("request");
const config = require("../../config");
module.exports = {
  sendSMS: function (mobile, text, typeOfText, country_code) {
    console.log(mobile, text, typeOfText, country_code)
    mobile = mobile + "".toString().trim();
    // mobile = mobile.slice(-9);
    mobile = country_code + '' + mobile;
    const options = {
      method: "POST",
      url: config.sendSMSUrl,
      headers: {
        "Content-Type": "application/json",
      },
      //format is the download format XLS - 1 (default) PDF - 2 CSV - 3
      body: JSON.stringify({
        campaign: {
          username: config.username,
          password: config.password,
          format: "1",
          sender: config.sender,
          gsm: [`${mobile}`],
          text,
          type: "4",
        },
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log("success response",response.body);
    });
  }
};
