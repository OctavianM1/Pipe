namespace Application.Emails
{
  public static class EmailsMessages
  {
    private static string EmailTemplate(string email, string title, string requestMsg, string incorrectEmailMsg, string redirectUrl, string buttonName)
    {
      return $@"
<div style=""background-color: #ddd; padding: 43px 0;"">
  <div style=""max-width: 800px; padding: 50px 30px; background-color: #fff; margin: 0 auto;"">
    <hr>
      <div
        style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:20px;padding-right:40px;padding-bottom:15px;padding-left:40px;"">
        <div
          style=""line-height: 1.2; font-size: 12px; color: #555555; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;"">
          <p
            style=""font-size: 46px; line-height: 1.2; text-align: center; word-break: break-word; mso-line-height-alt: 55px; margin: 0;"">
            <span style=""font-size: 46px; color: #003188;""><strong>{title}</strong></span></p>
        </div>
      </div>
      <div
        style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.8;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px;"">
        <div
          style=""line-height: 1.8; font-size: 12px; color: #555555; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 22px;"">
          <p style=""line-height: 1.8; word-break: break-word; font-size: 16px; mso-line-height-alt: 29px; margin: 0;"">
            <span style=""font-size: 16px;"">         {requestMsg}
              <span style=""background-color: #ffffff; color: #0000ff;"">{email}. </span>{incorrectEmailMsg}</span></p>
        </div>
      </div>
      <div align=""center"" class=""button-container""
        style=""padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"">
        <a href={redirectUrl}
          style=""text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;""><span
            style=""padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;""><span
              style=""font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"">{buttonName}</span></span></a>
      </div>
      <div
        style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:20px;padding-right:40px;padding-bottom:10px;padding-left:40px;"">
        <div
          style=""line-height: 1.5; font-size: 12px; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; color: #555555; mso-line-height-alt: 18px;"">
          <p
            style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 16px; mso-line-height-alt: 24px; margin: 0;"">
            <span style=""font-size: 16px; color: #6d89bc;"">Cheers,</span></p>
          <p
            style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 16px; mso-line-height-alt: 24px; margin: 0;"">
            <span style=""font-size: 16px; color: #6d89bc;"">Mîțu Octavian - Pipe</span></p>
          <p
            style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; margin: 0;"">
             </p>
        </div>
      </div>
    <hr>
  </div>
</div>
          ";
    }
    public static string ConfirmEmail(string email, string token, string clientSideURL)
    {
      var title = "We Appreciate your feedback!";
      var requestMsg = "We received a request to send email confirmaiton to ";
      var incorrectEmailMsg = "If this is correct, please confirm by clicking the button below. If you don’t know why you got this email, please tell us straight away so we can fix this for you.";
      var redirectMsg = $"{clientSideURL}/confirmEmail/{token}";
      var buttonName = "Confirm";
      return EmailTemplate(email, title, requestMsg, incorrectEmailMsg, redirectMsg, buttonName);
    }
    public static string RecoveryPassword(string email, string token, string clientSideURL)
    {
      var title = "Password recovery!";
      var requestMsg = "We received a request to send password confirmation to ";
      var incorrectEmailMsg = "If this is correct, please restore password by clicking the button below. If you don’t know why you got this email, please tell us straight away so we can fix this for you.";
      var redirectUrl = $"{clientSideURL}/restorePassword/{token}";
      var buttonName = "Restore";
      return EmailTemplate(email, title, requestMsg, incorrectEmailMsg, redirectUrl, buttonName);
    }

    public static string SubscribeEmail()
    {
      return $@"
<div style=""background-color: #ddd; padding: 43px 0;"">
  <div style=""max-width: 800px; padding: 50px 30px; background-color: #fff; margin: 0 auto;"">
    <hr>
      <div
        style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:20px;padding-right:40px;padding-bottom:15px;padding-left:40px;"">
        <div
          style=""line-height: 1.2; font-size: 12px; color: #555555; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;"">
          <p
            style=""font-size: 46px; line-height: 1.2; text-align: center; word-break: break-word; mso-line-height-alt: 55px; margin: 0;"">
            <span style=""font-size: 46px; color: #003188;""><strong>Thank you for subscribing!</strong></span></p>
        </div>
      </div>
      <div
        style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.8;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px;"">
        <div
          style=""line-height: 1.8; font-size: 12px; color: #555555; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 22px;"">
          <p style=""line-height: 1.8; word-break: break-word; font-size: 16px; mso-line-height-alt: 29px; margin: 0;"">
            <span style=""font-size: 16px;"">         We appriciate your feedback and we will send newsletters and we will let you know latest news and exclusive deals straight to your inbox!</span></p>
        </div>
      </div>
      <div
        style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:20px;padding-right:40px;padding-bottom:10px;padding-left:40px;"">
        <div
          style=""line-height: 1.5; font-size: 12px; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; color: #555555; mso-line-height-alt: 18px;"">
          <p
            style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 16px; mso-line-height-alt: 24px; margin: 0;"">
            <span style=""font-size: 16px; color: #6d89bc;"">Cheers,</span></p>
          <p
            style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 16px; mso-line-height-alt: 24px; margin: 0;"">
            <span style=""font-size: 16px; color: #6d89bc;"">Mîțu Octavian - Pipe</span></p>
          <p
            style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; margin: 0;"">
             </p>
        </div>
      </div>
    <hr>
  </div>
</div>
          ";
    }
  }
}