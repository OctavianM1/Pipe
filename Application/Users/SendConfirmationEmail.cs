using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class SendConfirmationEmail
  {
    public class Query : IRequest<string>
    {
      public string Email { get; set; }
    }
    public class Handler : IRequestHandler<Query, string>
    {
      private readonly DataContext _context;
      private readonly IJwtGenerator _jwtGenerator;
      private readonly IEmailSender _sender;
      public Handler(DataContext context, IEmailSender sender, IJwtGenerator jwtGenerator)
      {
        _sender = sender;
        _jwtGenerator = jwtGenerator;
        _context = context;
      }

      public async Task<string> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
          throw new RestException(System.Net.HttpStatusCode.NotFound, new { email = $"{request.Email} do not exists" });
        }

        if (user.IsEmailConfirmed == true)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { email = $"{request.Email} is already confirmed" });
        }

        var token = _jwtGenerator.CreateToken(user);

        // await _sender.SendEmailAsync(
        //   request.Email,
        //   "Email verification",
        //   $@"
        //   <div style=""width: 100%; display: block; margin: 50px auto; text-align: center;"">
        //     <h1>Hello, <span style=""color: blue;"">{user.Name}</span></h1>
        //     <h3>Please, confirm your email on <a href=""http://localhost:3000/confirmEmail/{token}"" style=""color: blue;"" >link</a></h3>
        //   </div>          
        //   ");

        await _sender.SendEmailAsync(
          request.Email,
          "Email verification",
          $@"

<table bgcolor=""#f1f4f8"" cellpadding=""0"" cellspacing=""0"" class=""nl-container"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f1f4f8; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top;"" valign=""top"">
<div style=""background-color:transparent;"">
<div class=""block-grid"" style=""min-width: 320px; max-width: 715px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;"">
<div style=""border-collapse: collapse;display: table;width: 100%;background-color:transparent;"">
<div class=""col num12"" style=""min-width: 320px; max-width: 715px; display: table-cell; vertical-align: top; width: 715px;"">
<div class=""col_cont"" style=""width:100% !important;"">
<div style=""border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"">
<div class=""mobile_hide"">
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 30px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div style=""background-color:transparent;"">
<div class=""block-grid"" style=""min-width: 320px; max-width: 715px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #ffffff;"">
<div style=""border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;"">
<div class=""col num12"" style=""min-width: 320px; max-width: 715px; display: table-cell; vertical-align: top; width: 715px;"">
<div class=""col_cont"" style=""width:100% !important;"">
<div style=""border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:1px solid #F3F2F3; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"">
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 15px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div align=""center"" class=""img-container center fixedwidth"" style=""padding-right: 20px;padding-left: 20px;"">
<div style=""font-size:1px;line-height:20px""> </div>
</div>
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 18px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</div>
<div style=""background-color:transparent;"">
<div class=""block-grid"" style=""min-width: 320px; max-width: 715px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #ffffff;"">
<div style=""border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;"">
<div class=""col num12"" style=""min-width: 320px; max-width: 715px; display: table-cell; vertical-align: top; width: 715px;"">
<div class=""col_cont"" style=""width:100% !important;"">
<div style=""border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"">
<div align=""center"" class=""img-container center autowidth"" style=""padding-right: 0px;padding-left: 0px;"">
</div>
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:20px;padding-right:40px;padding-bottom:15px;padding-left:40px;"">
<div style=""line-height: 1.2; font-size: 12px; color: #555555; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;"">
<p style=""font-size: 46px; line-height: 1.2; text-align: center; word-break: break-word; mso-line-height-alt: 55px; margin: 0;""><span style=""font-size: 46px; color: #003188;""><strong>We Appreciate your feedback!</strong></span></p>
</div>
</div>
<div style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.8;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px;"">
<div style=""line-height: 1.8; font-size: 12px; color: #555555; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 22px;"">
<p style=""line-height: 1.8; word-break: break-word; font-size: 16px; mso-line-height-alt: 29px; margin: 0;""><span style=""font-size: 16px;"">         We received a request to send email confirmaiton to <span style=""background-color: #ffffff; color: #0000ff;"">{request.Email}. </span>If this is correct, please confirm by clicking the button below. If you don’t know why you got this email, please tell us straight away so we can fix this for you.</span></p>
</div>
</div>
<div align=""center"" class=""button-container"" style=""padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"">
<a href=""http://localhost:3000/confirmEmail/{token}"" style=""text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;""><span style=""padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;""><span style=""font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"">Confirm</span></span></a>
</div>
<div style=""color:#555555;font-family:Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:20px;padding-right:40px;padding-bottom:10px;padding-left:40px;"">
<div style=""line-height: 1.5; font-size: 12px; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; color: #555555; mso-line-height-alt: 18px;"">
<p style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 16px; mso-line-height-alt: 24px; margin: 0;""><span style=""font-size: 16px; color: #6d89bc;"">Cheers,</span></p>
<p style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 16px; mso-line-height-alt: 24px; margin: 0;""><span style=""font-size: 16px; color: #6d89bc;"">Mîțu Octavian - Pipe</span></p>
<p style=""line-height: 1.5; word-break: break-word; font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; margin: 0;""> </p>
</div>
</div>
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</div>
<div style=""background-color:transparent;"">
<div class=""block-grid"" style=""min-width: 320px; max-width: 715px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #ffffff;"">
<div style=""border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;"">
<div class=""col num12"" style=""min-width: 320px; max-width: 715px; display: table-cell; vertical-align: top; width: 715px;"">
<div class=""col_cont"" style=""width:100% !important;"">
<div style=""border-top:1px solid #E5EAF3; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"">
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 35px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div align=""center"" class=""img-container center fixedwidth"" style=""padding-right: 20px;padding-left: 20px;"">
<div style=""font-size:1px;line-height:15px""> </div>
</div>
<table cellpadding=""0"" cellspacing=""0"" class=""social_icons"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"" valign=""top"">
<table align=""center"" cellpadding=""0"" cellspacing=""0"" class=""social_table"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;"" valign=""top"">
<tbody>
<tr align=""center"" style=""vertical-align: top; display: inline-block; text-align: center;"" valign=""top"">
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 40px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</div>
<div style=""background-color:transparent;"">
<div class=""block-grid"" style=""min-width: 320px; max-width: 715px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;"">
<div style=""border-collapse: collapse;display: table;width: 100%;background-color:transparent;"">
<div class=""col num12"" style=""min-width: 320px; max-width: 715px; display: table-cell; vertical-align: top; width: 715px;"">
<div class=""col_cont"" style=""width:100% !important;"">
<div style=""border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"">
<div class=""mobile_hide"">
<table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td class=""divider_inner"" style=""word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 30px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;"" valign=""top"">
<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class=""divider_content"" role=""presentation"" style=""table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"" valign=""top"" width=""100%"">
<tbody>
<tr style=""vertical-align: top;"" valign=""top"">
<td style=""word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"" valign=""top""><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</td>
</tr>
</tbody>
</table>
          ");

        return $"A confirmation email was sent to {request.Email}";
      }
    }
  }
}