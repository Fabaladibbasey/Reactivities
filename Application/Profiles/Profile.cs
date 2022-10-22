using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public bool Following { get; set; }
        public ICollection<Photo> Photos { get; set; }
        // public ICollection<UserFollowing> Followers { get; set; }
        // public ICollection<UserFollowing> Followings { get; set; }

    }
}