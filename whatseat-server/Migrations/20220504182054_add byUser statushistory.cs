using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace whatseat_server.Migrations
{
    public partial class addbyUserstatushistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ByUser",
                table: "OrderStatusHistories",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ByUser",
                table: "OrderStatusHistories");
        }
    }
}
