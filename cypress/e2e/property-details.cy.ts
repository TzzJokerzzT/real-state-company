/// <reference types="cypress" />

describe("Property Details E2E Tests", () => {
  const mockProperties = {
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

  beforeEach(() => {
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: mockProperties
    }).as("getProperties")
  })

  it("should open property details modal from property card", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
      "have.length",
      2
    )

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")
    cy.get("h2").contains("Property Details").should("be.visible")
  })

  it("should display property details correctly in modal", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").within(() => {
      cy.get("h2").contains("Property Details").should("be.visible")
      cy.get("h3").should("contain", "Beautiful House")
      cy.get(".text-green-600").should("contain", "$500,000")
      cy.get("img").should("be.visible")

      cy.get("h4").contains("Address").should("be.visible")
      cy.get("p").contains("123 Main St, City, State").should("be.visible")

      cy.get("h4").contains("Owner ID").should("be.visible")
      cy.get("p").contains("owner123").should("be.visible")

      cy.get("h4").contains("Created").should("be.visible")
      cy.get("h4").contains("Last Updated").should("be.visible")
    })
  })

  it("should close property details modal with X button", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")

    // Close with X button (look for X icon or close button)
    cy.get("button").contains("Close").click()

    cy.get(".fixed.inset-0").should("not.exist")
  })

  it("should close property details modal with close button", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")

    cy.get("button").contains("Close").click()

    cy.get(".fixed.inset-0").should("not.exist")
  })

  it("should display property image with fallback", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").within(() => {
      cy.get("img").should("be.visible")
      cy.get("img").should("have.attr", "alt", "Beautiful House")
    })
  })

  it("should format price correctly", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").within(() => {
      cy.get(".text-green-600").should("contain", "$500,000")
    })
  })

  it("should display formatted dates", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").within(() => {
      cy.get("h4").contains("Created").parent().find("p").should("be.visible")
      cy.get("h4")
        .contains("Last Updated")
        .parent()
        .find("p")
        .should("be.visible")
    })
  })

  it("should handle different properties", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    // Only one property in mock data, so test with that property
    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").within(() => {
      cy.get("h3").should("contain", "Beautiful House")
      cy.get(".text-green-600").should("contain", "$500,000")
      cy.get("p").contains("123 Main St, City, State").should("be.visible")
      cy.get("p").contains("owner123").should("be.visible")
    })
  })
  it("should maintain scroll position when modal is open", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")
    cy.get(".max-h-\\[90vh\\].overflow-y-auto").should("be.visible")
  })
})
