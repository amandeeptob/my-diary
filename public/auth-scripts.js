document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
  
    loginBtn.addEventListener("click", () => {
      toggleForms(loginForm, signupForm, loginBtn, signupBtn);
    });
  
    signupBtn.addEventListener("click", () => {
      toggleForms(signupForm, loginForm, signupBtn, loginBtn);
    });
  
    const toggleForms = (showForm, hideForm, activeBtn, inactiveBtn) => {
      showForm.classList.add("active");
      showForm.classList.remove("hidden");
      hideForm.classList.add("hidden");
      hideForm.classList.remove("active");
  
      activeBtn.classList.add("active");
      inactiveBtn.classList.remove("active");
    };
  });
  