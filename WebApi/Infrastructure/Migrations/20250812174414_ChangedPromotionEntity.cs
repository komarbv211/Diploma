using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangedPromotionEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "DiscountTypes");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "Promotions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Promotions");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "DiscountTypes",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
