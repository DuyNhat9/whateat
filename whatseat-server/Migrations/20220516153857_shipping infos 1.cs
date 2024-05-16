using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace whatseat_server.Migrations
{
    public partial class shippinginfos1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_ShippingInfos_DefaultShippingInfoShippingInfoId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_DefaultShippingInfoShippingInfoId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "DefaultShippingInfoShippingInfoId",
                table: "Customers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultShippingInfoShippingInfoId",
                table: "Customers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_DefaultShippingInfoShippingInfoId",
                table: "Customers",
                column: "DefaultShippingInfoShippingInfoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_ShippingInfos_DefaultShippingInfoShippingInfoId",
                table: "Customers",
                column: "DefaultShippingInfoShippingInfoId",
                principalTable: "ShippingInfos",
                principalColumn: "ShippingInfoId");
        }
    }
}
