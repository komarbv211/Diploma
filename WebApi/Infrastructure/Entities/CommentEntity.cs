using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class CommentEntity:BaseEntity<long>
    {
        public long ProductId { get; set; }
        public long UserId { get; set; }
        public string Text { get; set; }

        // Навігаційні властивості
        public ProductEntity? Product { get; set; }
        public UserEntity? User { get; set; }
    }
}
