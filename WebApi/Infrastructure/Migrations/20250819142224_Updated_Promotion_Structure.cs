using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Updated_Promotion_Structure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_DiscountTypes_DiscountTypeId",
                table: "Promotions");

            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_tblCategories_CategoryId",
                table: "Promotions");

            migrationBuilder.DropTable(
                name: "DiscountTypes");

            migrationBuilder.DropTable(
                name: "PromotionProducts");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_CategoryId",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_DiscountTypeId",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "DiscountTypeId",
                table: "Promotions");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                table: "Products",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "PromotionId",
                table: "Products",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_PromotionId",
                table: "Products",
                column: "PromotionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Promotions_PromotionId",
                table: "Products",
                column: "PromotionId",
                principalTable: "Promotions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Promotions_PromotionId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_PromotionId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "PromotionId",
                table: "Products");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "Promotions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<long>(
                name: "CategoryId",
                table: "Promotions",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "DiscountTypeId",
                table: "Promotions",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "DiscountTypes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PromotionProducts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<long>(type: "bigint", nullable: false),
                    PromotionId = table.Column<long>(type: "bigint", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromotionProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromotionProducts_Promotions_PromotionId",
                        column: x => x.PromotionId,
                        principalTable: "Promotions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_CategoryId",
                table: "Promotions",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_DiscountTypeId",
                table: "Promotions",
                column: "DiscountTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionProducts_ProductId",
                table: "PromotionProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionProducts_PromotionId",
                table: "PromotionProducts",
                column: "PromotionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_DiscountTypes_DiscountTypeId",
                table: "Promotions",
                column: "DiscountTypeId",
                principalTable: "DiscountTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_tblCategories_CategoryId",
                table: "Promotions",
                column: "CategoryId",
                principalTable: "tblCategories",
                principalColumn: "Id");
        }
    }
}
