namespace Domain
{
    public class Photo
    {
        public Guid Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        public AppUser AppUser { get; set; }
        public string AppUserId { get; set; }
    }
}