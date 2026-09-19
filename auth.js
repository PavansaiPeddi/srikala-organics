
// ===============================
// SRIKALA CUSTOMER AUTHENTICATION
// ===============================


// ===============================
// LOGIN USER
// ===============================

async function loginUser(email, password) {

    const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.error_description ||
            data.msg ||
            data.message ||
            "Login failed"
        );
    }

    localStorage.setItem(
        "srikala_access_token",
        data.access_token
    );

    localStorage.setItem(
        "srikala_user",
        JSON.stringify(data.user)
    );

    return data.user;
}


// ===============================
// SIGN UP USER
// ===============================

async function signupUser(name, email, password) {

    const response = await fetch(
        `${SUPABASE_URL}/auth/v1/signup`,
        {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password,

                data: {
                    full_name: name
                }
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.msg ||
            data.error_description ||
            data.message ||
            "Account creation failed"
        );
    }

    // If Supabase gives access token
    if (data.access_token) {

        localStorage.setItem(
            "srikala_access_token",
            data.access_token
        );

        localStorage.setItem(
            "srikala_user",
            JSON.stringify(data.user)
        );
    }

    return data;
}


// ===============================
// LOGOUT
// ===============================

function logoutUser() {

    localStorage.removeItem(
        "srikala_access_token"
    );

    localStorage.removeItem(
        "srikala_user"
    );

    window.location.href = "index.html";
}


// ===============================
// GET LOGGED-IN USER
// ===============================

function getLoggedInUser() {

    const user =
        localStorage.getItem("srikala_user");

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        return null;
    }
}


// ===============================
// PAGE FUNCTIONS
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ===============================
        // GET ELEMENTS
        // ===============================

        const loginTab =
            document.getElementById("login-tab");

        const signupTab =
            document.getElementById("signup-tab");

        const loginForm =
            document.getElementById("login-form");

        const signupForm =
            document.getElementById("signup-form");


        // ===============================
        // LOGIN / SIGNUP TABS
        // ===============================

        if (
            loginTab &&
            signupTab &&
            loginForm &&
            signupForm
        ) {


            // LOGIN TAB

            loginTab.addEventListener(
                "click",
                function () {

                    loginTab.classList.add("active");

                    signupTab.classList.remove("active");

                    loginForm.style.display = "block";

                    signupForm.style.display = "none";

                }
            );


            // CREATE ACCOUNT TAB

            signupTab.addEventListener(
                "click",
                function () {

                    signupTab.classList.add("active");

                    loginTab.classList.remove("active");

                    loginForm.style.display = "none";

                    signupForm.style.display = "block";

                }
            );

        }


        // ===============================
        // LOGIN
        // ===============================

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const email =
                        document
                            .getElementById("login-email")
                            .value
                            .trim();


                    const password =
                        document
                            .getElementById("login-password")
                            .value;


                    const message =
                        document.getElementById(
                            "auth-message"
                        );


                    try {

                        if (message) {
                            message.textContent =
                                "Logging in...";
                        }


                        await loginUser(
                            email,
                            password
                        );


                        if (message) {
                            message.textContent =
                                "Login successful!";
                        }


                        // LOGIN → ACCOUNT PAGE

                        setTimeout(
                            function () {

                                window.location.href =
                                    "account.html";

                            },
                            700
                        );


                    } catch (error) {

                        console.error(
                            "Login error:",
                            error
                        );


                        if (message) {

                            message.textContent =
                                error.message;

                        }

                    }

                }
            );

        }


        // ===============================
        // CREATE ACCOUNT
        // ===============================

        if (signupForm) {

            signupForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const name =
                        document
                            .getElementById("signup-name")
                            .value
                            .trim();


                    const email =
                        document
                            .getElementById("signup-email")
                            .value
                            .trim();


                    const password =
                        document
                            .getElementById("signup-password")
                            .value;


                    const message =
                        document.getElementById(
                            "auth-message"
                        );


                    try {

                        if (message) {

                            message.textContent =
                                "Creating account...";

                        }


                        const data =
                            await signupUser(
                                name,
                                email,
                                password
                            );


                        // ===============================
                        // CASE 1:
                        // ACCOUNT + SESSION CREATED
                        // ===============================

                        if (data.access_token) {

                            if (message) {

                                message.textContent =
                                    "Account created successfully!";

                            }


                            setTimeout(
                                function () {

                                    window.location.href =
                                        "account.html";

                                },
                                700
                            );

                        }


                        // ===============================
                        // CASE 2:
                        // EMAIL CONFIRMATION REQUIRED
                        // ===============================

                        else {

                            if (message) {

                                message.textContent =
                                    "Account created successfully! Redirecting...";

                            }


                            // IMPORTANT:
                            // Go to next page even though
                            // email confirmation is required.

                            setTimeout(
                                function () {

                                    window.location.href =
                                        "signup-success.html";

                                },
                                700
                            );

                        }

                    } catch (error) {

                        console.error(
                            "Signup error:",
                            error
                        );


                        if (message) {

                            message.textContent =
                                error.message;

                        }

                    }

                }
            );

        }


        // ===============================
        // LOGOUT
        // ===============================

        const logoutButton =
            document.getElementById(
                "logout-btn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutUser
            );

        }

    }
);