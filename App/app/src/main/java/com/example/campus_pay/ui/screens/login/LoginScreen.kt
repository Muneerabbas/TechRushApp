package com.example.campus_pay.ui.screens.login

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.campus_pay.ui.theme.*

// --- Color Theme Definition ---
val BlueGradientStart = Color(0xFF4C5BFF)
val BlueGradientEnd = Color(0xFF673AB7)
val ButtonOrange = Color(0xFFF9A825)
val LightGrayBackground = Color(0xFFF5F5F5)
val IconBlue = Color(0xFF4C5BFF)
val TextOnGradient = Color.White
val FadedTextOnGradient = Color.White.copy(alpha = 0.8f)

// --- CustomTextField with High Contrast ---
@Composable
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = modifier,
        visualTransformation = visualTransformation,
        keyboardOptions = keyboardOptions,
        leadingIcon = leadingIcon,
        trailingIcon = trailingIcon,
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White,
            focusedBorderColor = IconBlue,
            unfocusedBorderColor = Color.LightGray,
            focusedLabelColor = IconBlue,
            unfocusedLabelColor = Color.Gray,
            cursorColor = IconBlue,
            focusedTextColor = Color.Black,
            unfocusedTextColor = Color.Black,
            focusedLeadingIconColor = IconBlue,
            unfocusedLeadingIconColor = Color.Gray,
        )
    )
}

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
    val density = LocalDensity.current

    var isVisible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        isVisible = true
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(LightGrayBackground)
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
            AnimatedVisibility(
                visible = isVisible,
                enter = slideInVertically { with(density) { -40.dp.roundToPx() } } + fadeIn(animationSpec = tween(1000))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.School,
                        contentDescription = "Campus Pay Icon",
                        tint = IconBlue,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Campus Pay",
                        style = MaterialTheme.typography.displayMedium,
                        color = Color.Black,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                }
            }

            AnimatedVisibility(
                visible = isVisible,
                enter = fadeIn(animationSpec = tween(durationMillis = 1000, delayMillis = 200)) + scaleIn(animationSpec = tween(durationMillis = 1000, delayMillis = 200))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .wrapContentHeight()
                        .clip(RoundedCornerShape(32.dp))
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(BlueGradientStart, BlueGradientEnd)
                            )
                        )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        val animationDelay = 500L

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = animationDelay.toInt()))) {
                            CircularProfileImage()
                        }

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = (animationDelay + 150).toInt()))) {
                            CustomTextField(
                                value = uiState.email,
                                onValueChange = { viewModel.updateEmail(it) },
                                label = "Email Address",
                                leadingIcon = { Icon(imageVector = Icons.Default.Person, contentDescription = "Email") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = (animationDelay + 300).toInt()))) {
                            CustomTextField(
                                value = uiState.password,
                                onValueChange = { viewModel.updatePassword(it) },
                                label = "Password",
                                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                trailingIcon = {
                                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                        Icon(
                                            imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                            contentDescription = "Toggle password visibility",
                                            tint = Color.Gray
                                        )
                                    }
                                },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = (animationDelay + 450).toInt()))) {
                            PasswordStrengthIndicator(password = uiState.password)
                        }

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = (animationDelay + 500).toInt()))) {
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
                                            checkedColor = ButtonOrange,
                                            uncheckedColor = FadedTextOnGradient,
                                            checkmarkColor = TextOnGradient
                                        )
                                    )
                                    Text(text = "Remember Me", color = TextOnGradient)
                                }
                                TextButton(onClick = onForgotPassword) {
                                    Text(text = "Forgot Password?", color = TextOnGradient)
                                }
                            }
                        }

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = (animationDelay + 650).toInt()))) {
                            val interactionSource = remember { MutableInteractionSource() }
                            val isPressed by interactionSource.collectIsPressedAsState()
                            val buttonScale by animateFloatAsState(targetValue = if (isPressed) 0.95f else 1f, animationSpec = spring(), label = "ButtonScale")

                            Button(
                                onClick = {
                                    keyboardController?.hide()
                                    // The navigation logic is now handled in AppNavigation
                                    onLoginSuccess()
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp)
                                    .scale(buttonScale),
                                enabled = !uiState.isLoading,
                                shape = RoundedCornerShape(16.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = ButtonOrange, contentColor = Color.White),
                                interactionSource = interactionSource
                            ) {
                                if (uiState.isLoading) {
                                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
                                } else {
                                    Text("Sign In", style = MaterialTheme.typography.labelLarge)
                                }
                            }
                        }

                        AnimatedVisibility(visible = isVisible, enter = fadeIn(tween(delayMillis = (animationDelay + 800).toInt()))) {
                            Row(modifier = Modifier.padding(top = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text("Don't have an account?", color = FadedTextOnGradient)
                                TextButton(onClick = { navController.navigate("register") }) {
                                    Text("Register", color = TextOnGradient, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CircularProfileImage(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .size(100.dp)
            .clip(CircleShape)
            .background(LightGrayBackground),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.Default.Person,
            contentDescription = "Profile Icon",
            modifier = Modifier.size(60.dp),
            tint = IconBlue.copy(alpha = 0.8f)
        )
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
        "Strong" -> Color(0xFF4CAF50)
        "Medium" -> Color(0xFFFFA000)
        "Weak" -> Color(0xFFF44336)
        else -> Color.Transparent
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
                trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
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
            onLoginSuccess = { }
        )
    }
}