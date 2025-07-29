package com.example.campus_pay.ui.screens.login

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.campus_pay.ui.components.CustomTextField
import com.example.campus_pay.ui.components.ProfileImageSection
import com.example.campus_pay.ui.theme.*

@Composable
fun LoginScreen(
    navController: NavController,
    onLoginSuccess: () -> Unit,
    onForgotPassword: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val viewModel: LoginViewModel = viewModel()
    val uiState by viewModel.uiState
    var passwordVisible by remember { mutableStateOf(false) }
    var rememberMe by remember { mutableStateOf(false) }
    val keyboardController = LocalSoftwareKeyboardController.current

    var isVisible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        isVisible = true
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Campus Pay Title
            Text(
                text = "Campus Pay",
                style = MaterialTheme.typography.displayMedium,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            AnimatedVisibility(
                visible = isVisible,
                enter = fadeIn(animationSpec = tween(800)) + scaleIn(initialScale = 0.8f, animationSpec = tween(800)),
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .wrapContentHeight(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Profile Image (assuming this component exists)
                        // ProfileImageSection(viewModel = viewModel, isEditable = true)

                        // Email Field
                        CustomTextField(
                            value = uiState.email,
                            onValueChange = { viewModel.updateEmail(it) },
                            label = "Email Address",
                            isError = uiState.email.isNotEmpty() && !uiState.isEmailValid,
                            errorMessage = if (uiState.email.isNotEmpty() && !uiState.isEmailValid) "Please enter a valid email" else null,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            modifier = Modifier.fillMaxWidth()
                        )

                        // Password Field with Toggle
                        CustomTextField(
                            value = uiState.password,
                            onValueChange = { viewModel.updatePassword(it) },
                            label = "Password",
                            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            isError = uiState.password.isNotEmpty() && uiState.password.length < 6,
                            errorMessage = if (uiState.password.isNotEmpty() && uiState.password.length < 6) "Password must be at least 6 characters" else null,
                            trailingIcon = {
                                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                    Icon(
                                        imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                        contentDescription = if (passwordVisible) "Hide password" else "Show password",
                                        tint = MaterialTheme.colorScheme.primary
                                    )
                                }
                            },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            modifier = Modifier.fillMaxWidth()
                        )

                        // Password Strength Indicator
                        PasswordStrengthIndicator(password = uiState.password)

                        // Remember Me & Forgot Password
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Checkbox(
                                    checked = rememberMe,
                                    onCheckedChange = { rememberMe = it },
                                    colors = CheckboxDefaults.colors(
                                        checkedColor = MaterialTheme.colorScheme.primary,
                                        uncheckedColor = MaterialTheme.colorScheme.outline
                                    )
                                )
                                Text(
                                    text = "Remember Me",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurface,
                                )
                            }
                            TextButton(onClick = onForgotPassword) {
                                Text(
                                    text = "Forgot Password?",
                                    color = MaterialTheme.colorScheme.primary,
                                    style = MaterialTheme.typography.labelLarge
                                )
                            }
                        }

                        // Login Button with Animation
                        val interactionSource = remember { MutableInteractionSource() }
                        val isPressed by interactionSource.collectIsPressedAsState()
                        val buttonScale by animateFloatAsState(
                            targetValue = if (isPressed) 0.95f else 1f,
                            animationSpec = spring(),
                            label = "ButtonScale"
                        )

                        Button(
                            onClick = {
                                keyboardController?.hide()
                                viewModel.login(onLoginSuccess)
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                                .scale(buttonScale),
                            enabled = !uiState.isLoading,
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = MaterialTheme.colorScheme.onPrimary
                            ),
                            interactionSource = interactionSource
                        ) {
                            if (uiState.isLoading) {
                                CircularProgressIndicator(
                                    color = MaterialTheme.colorScheme.onPrimary,
                                    modifier = Modifier.size(24.dp),
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Text(
                                    text = "Sign In",
                                    style = MaterialTheme.typography.labelLarge
                                )
                            }
                        }

                        // Register Link
                        Row(
                            modifier = Modifier.padding(top = 16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Don't have an account?",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            TextButton(onClick = {
                                navController.navigate("register") { popUpTo("login") { inclusive = false } }
                            }) {
                                Text(
                                    text = "Register",
                                    color = MaterialTheme.colorScheme.primary,
                                    style = MaterialTheme.typography.labelLarge
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PasswordStrengthIndicator(password: String) {
    val strength = when {
        password.length >= 12 && password.any { it.isDigit() } && password.any { it.isUpperCase() } -> "Strong"
        password.length >= 8 -> "Medium"
        password.isNotEmpty() -> "Weak"
        else -> ""
    }
    val color = when (strength) {
        "Strong" -> SuccessMain
        "Medium" -> WarningMain
        "Weak" -> ErrorMain
        else -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
    }
    val progress = when (strength) {
        "Strong" -> 1.0f
        "Medium" -> 0.6f
        "Weak" -> 0.3f
        else -> 0.0f
    }

    if (password.isNotEmpty()) {
        Column(modifier = Modifier.padding(horizontal = 4.dp, vertical = 4.dp)) {
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(12.dp)),
                color = color,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    Campus_payTheme {
        LoginScreen(
            navController = rememberNavController(),
            onLoginSuccess = { println("Login successful") }
        )
    }
}