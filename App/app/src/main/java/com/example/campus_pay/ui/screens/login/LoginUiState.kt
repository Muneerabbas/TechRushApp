package com.example.campus_pay.ui.screens.login

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isEmailValid: Boolean = true,
    val errorMessage: String = "",
    val isLoading: Boolean = false,
    val showAlert: Boolean = false,
    val alertMessage: String = "",
    val profileImageUri: String? = null,
    val showBottomSheet: Boolean = false,
    // Registration fields
    val username: String = "",
    val role: String = "Student",
    val college: String = "",
    val confirmPassword: String = ""
)
