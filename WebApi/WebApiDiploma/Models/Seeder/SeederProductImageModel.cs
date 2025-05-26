namespace WebApiDiploma.Models.Seeder
{
    public class SeederProductImageModel
    {
        public string NamePhoto { get; set; }
        //послідовність слідування фото у товарі
        public short Priority { get; set; }
        public long ProductId { get; set; }
    }
}
