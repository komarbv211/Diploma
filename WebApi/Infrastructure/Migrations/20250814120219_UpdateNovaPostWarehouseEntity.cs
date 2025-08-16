using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNovaPostWarehouseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeliveryAddress",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CityRef",
                table: "NovaPostWarehouses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "NovaPostWarehouses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastSyncedAt",
                table: "NovaPostWarehouses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "NovaPostWarehouses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegionRef",
                table: "NovaPostWarehouses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WarehouseType",
                table: "NovaPostWarehouses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryAddress",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CityRef",
                table: "NovaPostWarehouses");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "NovaPostWarehouses");

            migrationBuilder.DropColumn(
                name: "LastSyncedAt",
                table: "NovaPostWarehouses");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "NovaPostWarehouses");

            migrationBuilder.DropColumn(
                name: "RegionRef",
                table: "NovaPostWarehouses");

            migrationBuilder.DropColumn(
                name: "WarehouseType",
                table: "NovaPostWarehouses");
        }
    }
}
