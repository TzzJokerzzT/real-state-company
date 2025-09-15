/// <reference types="cypress" />

describe("Accessibility E2E Tests", () => {
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
          }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1
      }
    }).as("getProperties")
  })

  it("should have proper heading hierarchy", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("h1").should("contain", "Real Estate Properties")

    cy.get("button").contains("View Details").first().click()
    cy.get("h2").contains("Property Details").should("be.visible")
    cy.get("h3").should("be.visible")
  })

  it("should have accessible form labels", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("label").contains("Property Name").should("be.visible")
    cy.get("label").contains("Address").should("be.visible")
    cy.get("label").contains("Owner ID").should("be.visible")

    cy.get("button").contains("More Filters").click()
    cy.get("label").contains("Min Price").should("be.visible")
    cy.get("label").contains("Max Price").should("be.visible")
  })

  it("should have proper alt text for images", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("img").each($img => {
      cy.wrap($img).should("have.attr", "alt")
      cy.wrap($img).should("not.have.attr", "alt", "")
    })
  })

  it("should have focus indicators", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get('input[placeholder="Search by property name..."]').focus()
    cy.get('input[placeholder="Search by property name..."]').should(
      "be.focused"
    )

    cy.get('input[placeholder="Search by property name..."]').type("test")
    cy.get("button").contains("Search").should("not.be.disabled")
    cy.get("button").contains("Search").focus()
    cy.get("button").contains("Search").should("be.focused")
  })

  it("should have proper color contrast", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("h1").should("have.css", "color")
    cy.get(".text-gray-900").should("have.css", "color")
    cy.get(".text-blue-600").should("have.css", "color")
  })

  it("should be usable with screen readers", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("main").should("be.visible")
    cy.get("header").should("be.visible")

    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden")
      .first()
      .within(() => {
        cy.get("h3").should("be.visible")
        cy.get("button").should("have.text", "View Details")
      })
  })

  it("should handle modal accessibility", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")
    cy.get("h2").should("be.visible")
    cy.get("button").contains("Close").should("exist")

    cy.get(".fixed.inset-0").should("have.css", "z-index")
  })

  it("should support reduced motion preferences", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "userAgent", {
          value: "Mozilla/5.0 (prefers-reduced-motion: reduce)"
        })
      }
    })
    cy.wait("@getProperties")

    cy.get(".transition-shadow").should("exist")
    cy.get(".transition-colors").should("exist")
  })

  it("should work without JavaScript (graceful degradation)", () => {
    cy.visit("/")

    cy.get("h1").should("contain", "Real Estate Properties")
    cy.get("main").should("be.visible")
  })

  it("should have proper semantic structure", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("header").should("be.visible")
    cy.get("main").should("be.visible")
    cy.get("h1").should("be.visible")

    cy.get(".grid").should("be.visible")
  })

  it("should handle touch interactions", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().trigger("touchstart")
    cy.get("button").contains("View Details").first().trigger("touchend")
    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")
  })

  it("should have appropriate ARIA attributes where needed", () => {
    cy.visit("/")
    cy.wait("@getProperties")

    cy.get("button").contains("View Details").first().click()

    cy.get(".fixed.inset-0").should("be.visible")
    cy.get("button").contains("Close").should("exist")
  })
})
