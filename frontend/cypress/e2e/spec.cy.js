describe('Login Test', () => {
    it('Navigates through the website, registers, logs in, and logs out', () => {
        cy.visit('http://localhost:5173');

        cy.wait(1000);

        cy.contains('Start NOW!').click();

        cy.url().should('include', '/login');

        cy.get('input[name="email"]').should('be.visible').type('test@test.de');
        cy.get('input[name="password"]').should('be.visible').type('testing123');

        cy.get('#login-button').click();

        cy.url().should('include', '/home');

        cy.get('#logout-button').click();

        cy.url().should('include', '/');
    });
});


describe('Navbar functionality', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.contains('Start NOW!').click();
        cy.url().should('include', '/login');

        cy.get('input[name="email"]').should('be.visible').type('test@test.de');
        cy.get('input[name="password"]').should('be.visible').type('testing123');
        cy.get('#login-button').click();

        cy.url().should('include', '/home');
    });

    it('Checks for presence of links in side menu and closes navbar', () => {
        cy.get('#navbar-button').click();

        cy.get('.fixed.translate-x-0').within(() => {
            cy.contains('Home').should('exist');
            cy.contains('Profile').should('exist');
            // cy.contains('Trending').should('exist');
            cy.contains('Subscriptions').should('exist');
            cy.contains('Liked').should('exist');
            // cy.contains('Library').should('exist');
            cy.contains('History').should('exist');
            cy.contains('Settings').should('exist');
        });

        cy.get('#navbar-button').click();
    });
});

describe('Upload functionality', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.contains('Start NOW!').click();
        cy.url().should('include', '/login');

        cy.get('input[name="email"]').should('be.visible').type('test@test.de');
        cy.get('input[name="password"]').should('be.visible').type('testing123');
        cy.get('#login-button').click();

        cy.url().should('include', '/home');
    });

    it('Uploads a video and cancels', () => {
        cy.get('#upload-button').click();

        cy.get('.bg-black.bg-opacity-50').should('be.visible');

        cy.get('.bg-white.rounded-lg.shadow-lg').within(() => {
            cy.contains('Upload Video').should('exist');
            cy.contains('Video File').should('exist');
            cy.contains('Choose a file').should('exist');
            cy.contains('Title').should('exist');
            cy.contains('Description').should('exist');
            cy.contains('Visibility').should('exist');
            cy.contains('Private').should('exist');
            cy.contains('Public').should('exist');
            // cy.get('input[type="file"]').should('exist'); // Check if file input exists
            // cy.get('input[name="title"]').should('exist'); // Check if title input exists
            // cy.get('input[name="description"]').should('exist'); // Check if description input exists
            // cy.get('input[value="private"]').should('exist'); // Check if private radio button exists
            // cy.get('input[value="public"]').should('exist'); // Check if public radio button exists
            cy.get('button[type="button"]').contains('Cancel').should('exist');
            cy.get('button[type="submit"]').contains('Upload').should('exist');
        });

        cy.get('button[type="button"]').contains('Cancel').click();

        cy.get('.bg-black.bg-opacity-50').should('not.exist');
    });
});
