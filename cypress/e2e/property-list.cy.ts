/// <reference types="cypress" />

describe("Property List E2E Tests", () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: {
        properties: [
          {
            id: "1",
            name: "Beautiful House",
            address: "123 Main St, City, State",
            price: 500000,
            image: "https://example.com/image1.jpg",
            idOwner: "owner123",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          },
          {
            id: "2",
            name: "Modern Apartment",
            address: "456 Oak Ave, City, State",
            price: 350000,
            image: "https://example.com/image2.jpg",
            idOwner: "owner456",
            createdAt: "2024-01-02T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z"
          },
          {
            id: "3",
            name: "Luxury Villa",
            address: "789 Pine Rd, City, State",
            price: 1200000,
            image: "https://example.com/image3.jpg",
            idOwner: "owner789",
            createdAt: "2024-01-03T00:00:00Z",
            updatedAt: "2024-01-03T00:00:00Z"
          }
        ],
        totalCount: 3,
        page: 1,
        pageSize: 12,
        totalPages: 1
      }
    }).as("getProperties")

    cy.visit("/")
  })

  it("should display the property list page", () => {
    cy.wait("@getProperties")
    cy.get("h1").should("contain", "Real Estate Properties")
    cy.get("main").should("be.visible")
  })

  it("should load and display properties", () => {
    cy.wait("@getProperties")

    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
      "have.length",
      3
    )

    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden")
      .first()
      .within(() => {
        cy.get("h3").should("be.visible")
        cy.get("img").should("be.visible")
        cy.get(".text-green-600").should("be.visible")
      })
  })

  it("should filter properties by name", () => {
    cy.wait("@getProperties")

    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: {
        properties: [
          {
            id: "1",
            name: "Beautiful House",
            address: "123 Main St, City, State",
            price: 500000,
            image: "https://example.com/image1.jpg",
            idOwner: "owner123",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1
      }
    }).as("getFilteredProperties")

    cy.get('input[placeholder="Search by property name..."]').type("Beautiful")
    cy.get("button").contains("Search").click()

    cy.wait("@getFilteredProperties")
    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
      "have.length",
      1
    )
  })

  it("should filter properties by address", () => {
    cy.wait("@getProperties")

    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: {
        properties: [
          {
            id: "1",
            name: "Beautiful House",
            address: "123 Main St, City, State",
            price: 500000,
            image: "https://example.com/image1.jpg",
            idOwner: "owner123",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1
      }
    }).as("getFilteredByAddress")

    cy.get('input[placeholder="Search by address..."]').type("Main St")
    cy.get("button").contains("Search").click()

    cy.wait("@getFilteredByAddress")
  })

  it("should clear filters", () => {
    cy.wait("@getProperties")

    cy.get('input[placeholder="Search by property name..."]').type("Test")
    cy.get("button").contains("Search").click()

    cy.get("button").contains("Clear").click()

    cy.get('input[placeholder="Search by property name..."]').should(
      "have.value",
      ""
    )
  })

  it("should show loading state", () => {
    cy.intercept("GET", "**/properties/search*", {
      delay: 1000,
      statusCode: 200,
      body: {
        properties: [],
        totalCount: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0
      }
    }).as("getPropertiesDelayed")

    cy.visit("/")

    cy.get(".container").should("be.visible")
    cy.get("p").contains("Loading properties...").should("be.visible")

    cy.wait("@getPropertiesDelayed")
    cy.get(".container").should("not.exist")
  })

  it("should handle API errors gracefully", () => {
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 500,
      body: { message: "Internal Server Error" }
    }).as("getPropertiesError")

    cy.visit("/")
    cy.wait("@getPropertiesError")

    cy.get(".text-red-500").should("be.visible")
    cy.get("p").contains("Error loading properties").should("be.visible")
  })

  it("should show no properties state", () => {
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: {
        properties: [],
        totalCount: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0
      }
    }).as("getEmptyProperties")

    cy.visit("/")
    cy.wait("@getEmptyProperties")

    cy.get("h3").contains("No properties found").should("be.visible")
    cy.get("p")
      .contains("Try adjusting your search criteria")
      .should("be.visible")
  })
})
