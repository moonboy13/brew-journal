﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DatabaseConnector.Migrations
{
    [DbContext(typeof(BaseDBContext))]
    partial class SqliteDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0-preview.3.21201.2");

            modelBuilder.Entity("Models.BoilHop", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<TimeSpan>("BoilTime")
                        .HasColumnType("TEXT");

                    b.Property<int?>("HopId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("RecipeId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UOM")
                        .HasColumnType("TEXT");

                    b.Property<double>("Weight")
                        .HasColumnType("REAL");

                    b.HasKey("Id");

                    b.HasIndex("HopId");

                    b.HasIndex("RecipeId");

                    b.ToTable("BoilHop");
                });

            modelBuilder.Entity("Models.DryHop", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<TimeSpan>("AddTime")
                        .HasColumnType("TEXT");

                    b.Property<int?>("HopId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("RecipeId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UOM")
                        .HasColumnType("TEXT");

                    b.Property<double>("Weight")
                        .HasColumnType("REAL");

                    b.HasKey("Id");

                    b.HasIndex("HopId");

                    b.HasIndex("RecipeId");

                    b.ToTable("DryHop");
                });

            modelBuilder.Entity("Models.Hop", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Active")
                        .HasColumnType("INTEGER");

                    b.Property<double>("AlphaAcidContent")
                        .HasColumnType("REAL");

                    b.Property<double>("BetaAcidContent")
                        .HasColumnType("REAL");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Hop");
                });

            modelBuilder.Entity("Models.Malt", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Active")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Brand")
                        .HasColumnType("TEXT");

                    b.Property<bool>("Dry")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Extract")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Type")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Malt");
                });

            modelBuilder.Entity("Models.Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Active")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<int>("CreatorId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("LastBrewed")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<int>("OwnerId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Style")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Updated")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatorId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Recipe");
                });

            modelBuilder.Entity("Models.RecipeMalt", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<double>("Amount")
                        .HasColumnType("REAL");

                    b.Property<int>("MaltId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("RecipeId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UOM")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("MaltId");

                    b.HasIndex("RecipeId");

                    b.ToTable("RecipeMalt");
                });

            modelBuilder.Entity("Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Active")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Admin")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Update")
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("User");
                });

            modelBuilder.Entity("Models.BoilHop", b =>
                {
                    b.HasOne("Models.Hop", "Hop")
                        .WithMany()
                        .HasForeignKey("HopId");

                    b.HasOne("Models.Recipe", "Recipe")
                        .WithMany("BoilHops")
                        .HasForeignKey("RecipeId");

                    b.Navigation("Hop");

                    b.Navigation("Recipe");
                });

            modelBuilder.Entity("Models.DryHop", b =>
                {
                    b.HasOne("Models.Hop", "Hop")
                        .WithMany()
                        .HasForeignKey("HopId");

                    b.HasOne("Models.Recipe", "Recipe")
                        .WithMany("DryHops")
                        .HasForeignKey("RecipeId");

                    b.Navigation("Hop");

                    b.Navigation("Recipe");
                });

            modelBuilder.Entity("Models.Recipe", b =>
                {
                    b.HasOne("Models.User", "Creator")
                        .WithMany("CreatedRecipes")
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.User", "Owner")
                        .WithMany("Recipes")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Creator");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Models.RecipeMalt", b =>
                {
                    b.HasOne("Models.Malt", "Malt")
                        .WithMany()
                        .HasForeignKey("MaltId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Recipe", "Recipe")
                        .WithMany("Malts")
                        .HasForeignKey("RecipeId");

                    b.Navigation("Malt");

                    b.Navigation("Recipe");
                });

            modelBuilder.Entity("Models.Recipe", b =>
                {
                    b.Navigation("BoilHops");

                    b.Navigation("DryHops");

                    b.Navigation("Malts");
                });

            modelBuilder.Entity("Models.User", b =>
                {
                    b.Navigation("CreatedRecipes");

                    b.Navigation("Recipes");
                });
#pragma warning restore 612, 618
        }
    }
}
