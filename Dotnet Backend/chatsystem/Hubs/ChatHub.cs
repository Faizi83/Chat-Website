using Microsoft.AspNetCore.SignalR;


namespace chatsystem.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;

     
        public async Task SendMessage(string ruser, string user, string message)
        {
         
            await Clients.All.SendAsync("ReceiveMessage", ruser, user, message);
        }

     
    }
}
