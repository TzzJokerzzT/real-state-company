/// <reference types="cypress" />

describe("Responsive Design E2E Tests", () => {
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
          {
            id: "2",
            name: "Modern Apartment",
            address: "456 Oak Ave, City, State",
            price: 350000,
            image: "https://example.com/image2.jpg",
            idOwner: "owner456",
            createdAt: "2024-01-02T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
          },
        ],
        totalCount: 2,
        page: 1,
        pageSize: 12,
        totalPages: 1,
      },
    }).as("getProperties");
  });

  describe("Desktop Viewport (1280x720)", () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it("should show all filter fields in one row", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3").should(
        "be.visible"
      );
    });

    it("should display modal centered properly", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("button").contains("View Details").first().click();

      cy.get(".fixed.inset-0").should("be.visible");
      cy.get(".max-w-2xl").should("be.visible");
    });
  });

  describe("Tablet Viewport (768x1024)", () => {
    beforeEach(() => {
      cy.viewport(768, 1024);
    });

    it("should display 2-column grid layout", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid").should("have.class", "md:grid-cols-2");
      cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
        "have.length.at.least",
        2
      );
    });

    it("should stack filter fields appropriately", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3").should(
        "be.visible"
      );
    });

    it("should make modal responsive", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("button").contains("View Details").first().click();

      cy.get(".fixed.inset-0").should("be.visible");
      cy.get(".max-w-2xl.w-full").should("be.visible");
    });
  });

  describe("Mobile Viewport (375x667)", () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it("should display single-column grid layout", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid").should("have.class", "grid-cols-1");
      cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
        "have.length.at.least",
        1
      );
    });

    it("should stack all filter fields vertically", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3").should(
        "be.visible"
      );
    });

    it("should make header responsive", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("header").should("be.visible");
      cy.get("h1").should("be.visible");
      cy.get(".max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8").should(
        "be.visible"
      );
    });

    it("should make modal full-screen friendly", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("button").contains("View Details").first().click();

      cy.get(".fixed.inset-0").should("be.visible");
      cy.get(".max-h-\\[90vh\\].overflow-y-auto").should("be.visible");
    });

    it("should handle touch interactions", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("button").contains("View Details").first().should("be.visible");
      cy.get("button").contains("View Details").first().click();

      cy.get(".fixed.inset-0").should("be.visible");

      cy.get("button").contains("Close").click();
      cy.get(".fixed.inset-0").should("not.exist");
    });

    it("should show readable text on small screens", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("h1").should("have.css", "font-size");
      cy.get("h3").should("be.visible");
      cy.get(".text-sm").should("be.visible");
    });
  });

  describe("Large Mobile Viewport (414x896)", () => {
    beforeEach(() => {
      cy.viewport(414, 896);
    });

    it("should maintain single-column layout", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid").should("have.class", "grid-cols-1");
    });

    it("should provide adequate spacing", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".p-6").should("be.visible");
      cy.get(".gap-6").should("be.visible");
    });
  });

  describe("Wide Screen (1920x1080)", () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
    });

    it("should maintain maximum container width", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".max-w-7xl").should("be.visible");
    });

    it("should display 4-column grid with proper spacing", () => {
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid").should("have.class", "xl:grid-cols-4");
      cy.get(".gap-6").should("be.visible");
    });
  });

  describe("Cross-viewport functionality", () => {
    const viewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1280, height: 720 },
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`should maintain functionality on ${name} (${width}x${height})`, () => {
        cy.viewport(width, height);
        cy.visit("/");
        cy.wait("@getProperties");

        cy.get('input[placeholder="Search by property name..."]').type(
          "Beautiful"
        );
        cy.get("button").contains("Search").click();
        cy.wait("@getProperties");

        cy.get("button").contains("View Details").first().click();
        cy.get(".fixed.inset-0").should("be.visible");

        cy.get("button").contains("Close").click();
        cy.get(".fixed.inset-0").should("not.exist");
      });
    });
  });

  describe("Orientation changes", () => {
    it("should handle landscape to portrait on mobile", () => {
      cy.viewport(667, 375); // Landscape
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid").should("be.visible");

      cy.viewport(375, 667); // Portrait
      cy.get(".grid").should("be.visible");
    });

    it("should handle portrait to landscape on tablet", () => {
      cy.viewport(768, 1024); // Portrait
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get(".grid").should("have.class", "md:grid-cols-2");

      cy.viewport(1024, 768); // Landscape
      cy.get(".grid").should("have.class", "lg:grid-cols-3");
    });
  });

  describe("Loading states across viewports", () => {
    it("should show loading spinner properly on all screen sizes", () => {
      const viewports = [
        [375, 667],
        [768, 1024],
        [1280, 720],
      ];

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.intercept("GET", "**/properties/search*", {
          delay: 1000,
          statusCode: 200,
          body: {
            properties: [],
            totalCount: 0,
            page: 1,
            pageSize: 12,
            totalPages: 0,
          },
        }).as("getPropertiesDelayed");        cy.visit("/");
        cy.get(".container").should("be.visible");
        cy.wait("@getPropertiesDelayed");
        cy.get(".container").should("not.exist");
      });
    });
  });

  describe("Text scaling", () => {
    it("should handle increased text size", () => {
      cy.viewport(1280, 720);
      cy.visit("/");
      cy.wait("@getProperties");

      cy.get("html").invoke("css", "font-size", "20px");

      cy.get("h1").should("be.visible");
      cy.get(".bg-white.rounded-lg.shadow-md.overflow-hidden").should(
        "be.visible"
      );
    });
  });
});
