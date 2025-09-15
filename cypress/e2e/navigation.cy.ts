/// <reference types="cypress" />

describe("Navigation E2E Tests", () => {
  beforeEach(() => {
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
          }
        ],
        totalCount: 2,
        page: 1,
        pageSize: 12,
        totalPages: 1
      }
    }).as("getProperties")
  })

  it("should load the main page correctly", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.url().should("eq", Cypress.config().baseUrl + "/")
    cy.get("h1").should("contain", "Real Estate Properties")
    cy.get("main").should("be.visible")
  })

  it("should display header with title and property count", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("header").should("be.visible")
    cy.get("h1").should("contain", "Real Estate Properties")
    cy.get("header").should("contain", "properties found")
  })

  it("should navigate to property details modal and back", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")
    cy.get("h2").contains("Property Details").should("be.visible")

    cy.get("button").contains("Close").click()

    cy.get(".fixed.inset-0").should("not.exist")
    cy.get("main").should("be.visible")
  })

  it("should handle page refresh correctly", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get('input[placeholder="Search by property name..."]').type("Beautiful")
    cy.get("button").contains("Search").click()
    cy.wait("@getProperties")

    cy.reload()
    cy.wait("@getProperties")

    cy.get("h1").should("contain", "Real Estate Properties")
    cy.get("main").should("be.visible")
  })

  it("should maintain filter state after modal interaction", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get('input[placeholder="Search by property name..."]').type("Beautiful")
    cy.get("button").contains("Search").click()
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()
    cy.get("button").contains("Close").click()

    cy.get('input[placeholder="Search by property name..."]').should(
      "have.value",
      "Beautiful"
    )
  })

  it("should handle browser back and forward", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("h1").should("contain", "Real Estate Properties")

    cy.go("back")
    cy.go("forward")

    cy.wait("@getProperties")
    cy.get("h1").should("contain", "Real Estate Properties")
  })

  it("should handle multiple modal interactions", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()
    cy.get(".fixed.inset-0").should("be.visible")
    cy.get("button").contains("Close").click()
    cy.get(".fixed.inset-0").should("not.exist")

    cy.get("button").contains("View Details").last().click()
    cy.get(".fixed.inset-0").should("be.visible")
    cy.get("button").contains("Close").click()
    cy.get(".fixed.inset-0").should("not.exist")
  })
})
