using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace chatsystem.Models
{
    public class MessageDto
    {
        
        public int Id { get; set; }

     
        public string SenderId { get; set; }

    
        public string ReceiverId { get; set; }

       
        public string MessageText { get; set; }

    
        public DateTime SentTime { get; set; } = DateTime.Now;
    }
}
