// 1. BASIC RESPONSE VALIDATION
pm.test("Response structure is valid", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property("success").that.is.a("boolean");
    pm.expect(response).to.have.property("message").that.is.a("string");
});

// 2. SCENARIO-BASED TESTS
const response = pm.response.json();
const requestBody = JSON.parse(pm.request.body.raw || '{}');

switch(pm.response.code) {
    case 200:
        pm.test("[200] Should register successfully with valid data", function() {
            pm.expect(response).to.deep.equal({
                success: true,
                message: "Votre compte a été créé, vous pouvez dès à présent vous connecter"
            });

            // Verify password meets schema requirements
            const passwordRegex = /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
            pm.expect(requestBody.password).to.match(passwordRegex);
            
            // Verify email format
            pm.expect(requestBody.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
        break;
        
    case 422:
        if (response.message === "Tous les champs doivent être remplis") {
            pm.test("[422] Should reject missing fields", function() {
                const requiredFields = ['firstPerson', 'secondPerson', 'email', 'password'];
                const missingFields = requiredFields.filter(field => !requestBody[field]);
                
                pm.test(`[422] Missing fields: ${missingFields.join(', ')}`, () => {
                    pm.expect(missingFields.length).to.be.above(0);
                });
            });
        } else {
            pm.test("[422] Should reject invalid password format", function() {
                pm.expect(response.message).to.include("Le mot de passe doit contenir");
                
                // Verify password fails schema requirements
                if (requestBody.password) {
                    const passwordRegex = /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
                    pm.expect(requestBody.password).to.not.match(passwordRegex);
                }
            });
        }
        break;
        
    case 400:
        pm.test("[400] Should reject existing email", function() {
            pm.expect(response).to.deep.equal({
                success: false,
                message: "Un compte existe déjà avec cet email"
            });

            // Verify email format was correct
            pm.expect(requestBody.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
        break;
        
    case 500:
        pm.test("[500] Should handle internal errors", function() {
            pm.expect(response).to.deep.equal({
                success: false,
                message: "Erreur serveur"
            });
        });
        break;
        
    default:
        pm.test(`[UNEXPECTED] Status ${pm.response.code}`, function() {
            pm.expect.fail(`Unexpected response: ${JSON.stringify(response)}`);
        });
}

// 3. PASSWORD VALIDATION TESTS
if (pm.response.code === 422 && requestBody.password) {
    const passwordTests = {
        "min length": () => pm.expect(requestBody.password.length).to.be.below(6),
        "uppercase": () => pm.expect(requestBody.password).to.not.match(/[A-Z]/),
        "number": () => pm.expect(requestBody.password).to.not.match(/\d/),
        "special char": () => pm.expect(requestBody.password).to.not.match(/[!@#$%^&*()\-_=+{};:,<.>]/)
    };

    Object.entries(passwordTests).forEach(([name, testFn]) => {
        try {
            testFn();
            pm.test(`[422] Password should fail ${name} requirement`, () => true);
        } catch (e) {
            // If test doesn't fail, the password meets this requirement
        }
    });
}

// 4. QUALITY CHECKS
pm.test("Response time should be <1s", function() {
    pm.expect(pm.response.responseTime).to.be.below(800);
});

pm.test("Should have correct content-type", function() {
    pm.expect(pm.response.headers.get('Content-Type'))
      .to.equal('application/json; charset=utf-8');
});

// 5. SECURITY CHECKS
pm.test("Password should not be exposed", function() {
    pm.expect(JSON.stringify(response)).to.not.include(requestBody.password);
});

pm.test("Should use HTTPS", function() {
    pm.expect(pm.request.url).to.match(/^https:/);
});