/// <reference types="cypress" />

describe("Property API Integration E2E Tests", () => {
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
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1,
      },
    }).as("getProperties");
  });

  it("should display properties from API", () => {
    cy.visit("/");
    cy.wait("@getProperties");

    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
      "have.length.at.least",
      1
    );
  });

  it("should handle successful API response", () => {
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: {
        properties: [
          {
            id: "test-1",
            name: "Test Property",
            address: "Test Address",
            price: 100000,
            image: "https://example.com/test.jpg",
            idOwner: "test-owner",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1,
      },
    }).as("getSingleProperty");

    cy.visit("/");
    cy.wait("@getSingleProperty");

    cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
      "have.length",
      1
    );
    cy.get("h3").contains("Test Property").should("be.visible");
    cy.get("span").contains("Test Address").should("be.visible");
  });

  it("should handle API search requests", () => {
    cy.intercept("GET", "**/properties/search*", (req) => {
      expect(req.url).to.include("properties/search");
      req.reply({
        statusCode: 200,
        body: {
          properties: [],
          totalCount: 0,
          page: 1,
          pageSize: 12,
          totalPages: 0,
        },
      });
    }).as("getPropertiesSearch");

    cy.visit("/");
    cy.wait("@getPropertiesSearch");

    cy.get('input[placeholder="Search by property name..."]').type("Beautiful");
    cy.get("button").contains("Search").click();

    cy.wait("@getPropertiesSearch");
  });

  it("should handle API filter requests with query parameters", () => {
    cy.intercept("GET", "**/properties/search*", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          properties: [
            {
              id: "filtered-1",
              name: "Filtered Property",
              address: "Filtered Address",
              price: 500000,
              image: "https://example.com/filtered.jpg",
              idOwner: "filtered-owner",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
          ],
          totalCount: 1,
          page: 1,
          pageSize: 12,
          totalPages: 1,
        },
      });
    }).as("getFilteredProperties");

    cy.visit("/");
    cy.wait("@getFilteredProperties");

    cy.get('input[placeholder="Search by property name..."]').type("Filtered");
    cy.get("button").contains("Search").click();

    cy.wait("@getFilteredProperties");
  });

  it("should handle API pagination", () => {
    cy.intercept("GET", "**/properties/search*", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          properties: [
            {
              id: "paginated-1",
              name: "Paginated Property",
              address: "Paginated Address",
              price: 300000,
              image: "https://example.com/paginated.jpg",
              idOwner: "paginated-owner",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
          ],
          totalCount: 25,
          page: 1,
          pageSize: 12,
          totalPages: 3,
        },
      });
    }).as("getPaginatedProperties");

    cy.visit("/");
    cy.wait("@getPaginatedProperties");

    cy.get("header").should("contain", "25 properties found");
  });

  it("should handle API timeout", () => {
    cy.intercept("GET", "**/properties/search*", {
      delay: 2000,
      statusCode: 200,
      body: {
        properties: [],
        totalCount: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
      },
    }).as("getPropertiesTimeout");

    cy.visit("/");

    cy.get(".container", { timeout: 3000 }).should("be.visible");
    cy.wait("@getPropertiesTimeout");
  });

  it("should handle API network error", () => {
    cy.intercept("GET", "**/properties/search*", {
      forceNetworkError: true,
    }).as("getPropertiesNetworkError");

    cy.visit("/");
    cy.wait("@getPropertiesNetworkError");

    cy.get(".text-red-500").should("be.visible");
  });

  it("should handle empty API response", () => {
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 200,
      body: {
        properties: [],
        totalCount: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
      },
    }).as("getEmptyProperties");

    cy.visit("/");
    cy.wait("@getEmptyProperties");

    cy.get("h3").contains("No properties found").should("be.visible");
    cy.get("header").should("contain", "0 properties found");
  });

  it("should handle API rate limiting", () => {
    cy.intercept("GET", "**/properties/search*", {
      statusCode: 429,
      body: { message: "Too Many Requests" },
    }).as("getRateLimitedProperties");

    cy.visit("/");
    cy.wait("@getRateLimitedProperties");

    cy.get(".text-red-500").should("be.visible");
  });

  it("should retry API requests on failure", () => {
    let requestCount = 0;
    cy.intercept("GET", "**/properties/search*", (req) => {
      requestCount++;
      if (requestCount === 1) {
        req.reply({
          statusCode: 500,
          body: { message: "Internal Server Error" },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            properties: [],
            totalCount: 0,
            page: 1,
            pageSize: 12,
            totalPages: 0,
          },
        });
      }
    }).as("getPropertiesWithRetry");

    cy.visit("/");
    cy.wait("@getPropertiesWithRetry");

    cy.get("button").contains("Search").click();
    cy.wait("@getPropertiesWithRetry");
  });
});
