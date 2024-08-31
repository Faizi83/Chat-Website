using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace chatsystem.Models
{
    public class Register
    {
        [Key]
        public int Id { get; set; }


        public string Name { get; set; }


        public string Email { get; set; }

   
        public string Password { get; set; }

  
        public string Gender { get; set; }

    
        public string Image { get; set; }
    }
}
