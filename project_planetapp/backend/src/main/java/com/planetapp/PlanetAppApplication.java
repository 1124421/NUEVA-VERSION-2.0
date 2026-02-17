package com.planetapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlanetAppApplication {
    
    public static void main(String[] args) {
        ensureDatabaseExists();
        SpringApplication.run(PlanetAppApplication.class, args);
    }

    private static void ensureDatabaseExists() {
        String dbName = "planetapp_db";
        String jdbcUrl = "jdbc:postgresql://localhost:1234/";
        String user = "postgres";
        String password = "123";

        try (java.sql.Connection conn = java.sql.DriverManager.getConnection(jdbcUrl + "postgres", user, password);
             java.sql.Statement stmt = conn.createStatement()) {
            
            java.sql.ResultSet rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = '" + dbName + "'");
            if (!rs.next()) {
                System.out.println("⚠️ Database '" + dbName + "' does not exist. Creating it now...");
                stmt.executeUpdate("CREATE DATABASE " + dbName);
                System.out.println("✅ Database '" + dbName + "' created successfully!");
            } else {
                System.out.println("✅ Database '" + dbName + "' already exists.");
            }
        } catch (java.sql.SQLException e) {
            System.err.println("❌ Error checking/creating database: " + e.getMessage());
            // We don't throw exception here to let Spring Boot try its own connection, 
            // though it will likely fail if DB keeps missing.
        }
    }
}
