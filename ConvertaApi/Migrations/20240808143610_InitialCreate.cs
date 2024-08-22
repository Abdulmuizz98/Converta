using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConvertaApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pixel",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    AccessToken = table.Column<string>(type: "text", nullable: false),
                    PixelType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pixel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lead",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<string>(type: "text", nullable: true),
                    IsConverted = table.Column<bool>(type: "boolean", nullable: false),
                    Email = table.Column<List<string>>(type: "text[]", nullable: true),
                    Phone = table.Column<List<string>>(type: "text[]", nullable: true),
                    UserAgent = table.Column<List<string>>(type: "text[]", nullable: true),
                    IPAddress = table.Column<List<string>>(type: "text[]", nullable: true),
                    PixelId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lead", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lead_Pixel_PixelId",
                        column: x => x.PixelId,
                        principalTable: "Pixel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MetaEvent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    isRevisit = table.Column<bool>(type: "boolean", nullable: false),
                    Time = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SourceUrl = table.Column<string>(type: "text", nullable: false),
                    ActionSource = table.Column<string>(type: "text", nullable: false),
                    CustomerId = table.Column<string>(type: "text", nullable: true),
                    PixelId = table.Column<string>(type: "text", nullable: false),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MetaEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MetaEvent_Lead_LeadId",
                        column: x => x.LeadId,
                        principalTable: "Lead",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MetaEvent_Pixel_PixelId",
                        column: x => x.PixelId,
                        principalTable: "Pixel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomData",
                columns: table => new
                {
                    MetaEventId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<decimal>(type: "numeric", nullable: true),
                    Currency = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomData", x => x.MetaEventId);
                    table.ForeignKey(
                        name: "FK_CustomData_MetaEvent_MetaEventId",
                        column: x => x.MetaEventId,
                        principalTable: "MetaEvent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserData",
                columns: table => new
                {
                    MetaEventId = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<List<string>>(type: "text[]", nullable: true),
                    Phone = table.Column<List<string>>(type: "text[]", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    IPAddress = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserData", x => x.MetaEventId);
                    table.ForeignKey(
                        name: "FK_UserData_MetaEvent_MetaEventId",
                        column: x => x.MetaEventId,
                        principalTable: "MetaEvent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lead_PixelId",
                table: "Lead",
                column: "PixelId");

            migrationBuilder.CreateIndex(
                name: "IX_MetaEvent_LeadId",
                table: "MetaEvent",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_MetaEvent_PixelId",
                table: "MetaEvent",
                column: "PixelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomData");

            migrationBuilder.DropTable(
                name: "UserData");

            migrationBuilder.DropTable(
                name: "MetaEvent");

            migrationBuilder.DropTable(
                name: "Lead");

            migrationBuilder.DropTable(
                name: "Pixel");
        }
    }
}
