namespace chatsystem.Models
{
    public class UpdateProfileModel
    {
        public string Name { get; set; }
     
        public string Password { get; set; }

        public IFormFile? Image { get; set; }

        public string Gender { get; set; }
    }

}
