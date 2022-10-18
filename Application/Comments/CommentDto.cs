namespace Application.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}