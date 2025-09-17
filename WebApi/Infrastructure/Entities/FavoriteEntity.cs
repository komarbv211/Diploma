using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities;

public class FavoriteEntity
{
    [ForeignKey("Product")]
    public long ProductId { get; set; }

    [ForeignKey("User")]
    public long UserId { get; set; }

    public virtual ProductEntity? Product { get; set; }
    public virtual UserEntity? User { get; set; }
}
