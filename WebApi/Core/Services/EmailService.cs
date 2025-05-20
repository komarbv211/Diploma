using Core.Exceptions;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Core.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            string smtpServer = emailSettings["SmtpServer"];
            string senderEmail = emailSettings["SenderEmail"];
            string senderName = emailSettings["SenderName"];
            string password = emailSettings["Password"];
            if (!int.TryParse(emailSettings["Port"], out int port))
                port = 0;

            if (string.IsNullOrWhiteSpace(smtpServer) ||
                string.IsNullOrWhiteSpace(senderEmail) ||
                string.IsNullOrWhiteSpace(password) ||
                port <= 0)
            {
                var errMsg = "Email settings are not configured properly.";
                Console.Error.WriteLine(errMsg);
                throw new HttpException(errMsg, HttpStatusCode.InternalServerError);
            }

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(senderName ?? senderEmail, senderEmail));
            emailMessage.To.Add(MailboxAddress.Parse(toEmail));
            emailMessage.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = message };
            emailMessage.Body = bodyBuilder.ToMessageBody();

            using var smtpClient = new SmtpClient();

            try
            {
                await smtpClient.ConnectAsync(smtpServer, port, SecureSocketOptions.SslOnConnect);
                await smtpClient.AuthenticateAsync(senderEmail, password);
                await smtpClient.SendAsync(emailMessage);
            }
            catch (SmtpCommandException ex)
            {
                throw new HttpException($"SMTP command error: {ex.Message}", HttpStatusCode.InternalServerError, ex);
            }
            catch (SmtpProtocolException ex)
            {
                throw new HttpException($"SMTP protocol error: {ex.Message}", HttpStatusCode.InternalServerError, ex);
            }
            catch (Exception ex)
            {
                throw new HttpException($"Unexpected error while sending email: {ex.Message}", HttpStatusCode.InternalServerError, ex);
            }
            finally
            {
                await smtpClient.DisconnectAsync(true);
            }
        }
    }
}
