document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const usernameWrapper = document.getElementById("usernameWrapper");
    const meterContainer = document.getElementById("meterContainer");
    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");
    const toggleText = document.getElementById("toggleText");
    const resetBtn = document.getElementById("resetBtn");
    const passwordInput = document.getElementById("password");
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    let isLoginMode = true;

    // Redirect if already logged in
    auth.onAuthStateChanged(user => {
        if (user) window.location.href = "dashboard.html";
    });

    /* ===========================
       UI TOGGLE LOGIC
    =========================== */
    toggleModeBtn.onclick = () => {
        isLoginMode = !isLoginMode;

        if (isLoginMode) {
            authTitle.innerText = "Welcome Back";
            authSubtitle.innerText = "Please enter your details to login.";
            submitBtn.innerText = "LOG IN";
            toggleText.innerText = "Need an account?";
            toggleModeBtn.innerText = "Create Account";
            usernameWrapper.classList.add("hidden");
            meterContainer.classList.add("hidden");
            usernameWrapper.classList.remove("opacity-100");
        } else {
            authTitle.innerText = "Join Taskify";
            authSubtitle.innerText = "Start organizing your tasks today.";
            submitBtn.innerText = "SIGN UP";
            toggleText.innerText = "Already have an account?";
            toggleModeBtn.innerText = "Log In";
            usernameWrapper.classList.remove("hidden");
            meterContainer.classList.remove("hidden");
            setTimeout(() => usernameWrapper.classList.add("opacity-100"), 10);
        }
    };

    /* ===========================
       VALIDATION LOGIC
    =========================== */
    const getPasswordScore = (pass) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[@$!%*?&]/.test(pass)) score++;
        return score;
    };

    const updateMeter = (width, text, color) => {
        strengthBar.style.width = width + "%";
        strengthBar.style.backgroundColor = color;
        strengthText.innerText = text;
        strengthText.style.color = color;
    };

    passwordInput.addEventListener("input", (e) => {
        if (isLoginMode) return;
        const val = e.target.value;
        const score = getPasswordScore(val);

        if (!val) {
            updateMeter(0, "Min. 8 characters", "#d1d5db");
            return;
        }

        switch (score) {
            case 0:
            case 1: updateMeter(25, "Weak 🚩", "#ef4444"); break;
            case 2: updateMeter(50, "Average 🟠", "#f59e0b"); break;
            case 3: updateMeter(75, "Good 🟢", "#10b981"); break;
            case 4: updateMeter(100, "Strong 💪", "#4f46e5"); break;
        }
    });

    /* ===========================
       SUBMISSION LOGIC
    =========================== */
    const setLoading = (loading) => {
        submitBtn.disabled = loading;
        submitBtn.style.opacity = loading ? "0.7" : "1";
        if (loading) submitBtn.innerText = "AUTHENTICATING...";
        else submitBtn.innerText = isLoginMode ? "LOG IN" : "SIGN UP";
    };

    submitBtn.onclick = async () => {
        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;
        const username = document.getElementById("username").value.trim();

        if (!email || !password) return alert("Please fill in all fields.");

        if (!isLoginMode) {
            if (!username) return alert("Please enter a username.");
            if (getPasswordScore(password) < 4) {
                return alert("Please use a stronger password (Score: 4/4).");
            }
        }

        setLoading(true);

        if (isLoginMode) {
            auth.signInWithEmailAndPassword(email, password)
                .catch(err => {
                    alert("Login Failed: " + err.message);
                    setLoading(false);
                });
        } else {
            try {
                const result = await auth.createUserWithEmailAndPassword(email, password);
                await result.user.updateProfile({ displayName: username });
                alert(`Welcome, ${username}!`);
            } catch (err) {
                alert("Signup Failed: " + err.message);
                setLoading(false);
            }
        }
    };

    resetBtn.onclick = async () => {
        const email = document.getElementById("email").value.trim();
        if (!email) return alert("Enter your email first.");
        try {
            await auth.sendPasswordResetEmail(email);
            alert("Password reset email sent! Check your inbox.");
        } catch (error) { alert(error.message); }
    };
});