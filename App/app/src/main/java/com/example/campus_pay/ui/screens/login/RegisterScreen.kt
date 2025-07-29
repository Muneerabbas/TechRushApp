package com.example.campus_pay.ui.screens.register

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.campus_pay.ui.screens.login.LoginViewModel
import com.example.campus_pay.ui.theme.*
import kotlinx.coroutines.launch

// --- Color Theme Definition ---
val ButtonOrange = Color(0xFFF9A825)
val LightGrayBackground = Color(0xFFF5F5F5)
val IconBlue = Color(0xFF4C5BFF)

// Define status colors
val SuccessMain = Color(0xFF4CAF50)
val WarningMain = Color(0xFFFFA000)
val ErrorMain = Color(0xFFF44336)

// --- High-Contrast Custom Text Field ---
@Composable
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
    errorMessage: String? = null,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    trailingIcon: @Composable (() -> Unit)? = null
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = modifier,
        isError = isError,
        supportingText = {
            if (isError && errorMessage != null) {
                Text(text = errorMessage, color = MaterialTheme.colorScheme.error)
            }
        },
        visualTransformation = visualTransformation,
        keyboardOptions = keyboardOptions,
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
            unfocusedTextColor = Color.Black
        )
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    navController: NavController,
    onRegisterSuccess: () -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: LoginViewModel = viewModel()
    val uiState by viewModel.uiState
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPassword by remember { mutableStateOf(uiState.confirmPassword) }
    val keyboardController = LocalSoftwareKeyboardController.current
    val scope = rememberCoroutineScope()
    val density = LocalDensity.current

    var isVisible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        isVisible = true
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.PersonAdd,
                            contentDescription = "Create Account Icon",
                            tint = IconBlue
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Create Account",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = LightGrayBackground,
                    titleContentColor = Color.Black,
                    navigationIconContentColor = Color.Black
                )
            )
        },
        containerColor = LightGrayBackground,
        modifier = modifier
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            val baseDelay = 200
            val itemDelay = 100

            item {
                AnimatedVisibility(
                    visible = isVisible,
                    enter = slideInVertically { with(density) { -20.dp.roundToPx() } } + fadeIn(tween(delayMillis = baseDelay))
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Spacer(modifier = Modifier.height(24.dp))
                        CircularProfileImage()
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Add a profile photo (optional)",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.Gray
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }

            item {
                AnimatedVisibility(
                    visible = isVisible,
                    enter = fadeIn(tween(delayMillis = baseDelay + itemDelay * 1))
                ) {
                    Column {
                        CustomTextField(
                            value = uiState.username,
                            onValueChange = { viewModel.updateUsername(it) },
                            label = "Username",
                            isError = uiState.username.isNotEmpty() && uiState.username.length < 3,
                            errorMessage = if (uiState.username.isNotEmpty() && uiState.username.length < 3) "Username is too short" else null,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }

            item {
                AnimatedVisibility(
                    visible = isVisible,
                    enter = fadeIn(tween(delayMillis = baseDelay + itemDelay * 2))
                ) {
                    Column {
                        CustomTextField(
                            value = uiState.email,
                            onValueChange = { viewModel.updateEmail(it) },
                            label = "Email",
                            isError = uiState.email.isNotEmpty() && !uiState.isEmailValid,
                            errorMessage = if (uiState.email.isNotEmpty() && !uiState.isEmailValid) "Please enter a valid email" else null,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }

            item {
                AnimatedVisibility(
                    visible = isVisible,
                    enter = fadeIn(tween(delayMillis = baseDelay + itemDelay * 3))
                ) {
                    Column {
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
                                        contentDescription = "Toggle password visibility",
                                        tint = Color.Gray
                                    )
                                }
                            },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        PasswordStrengthIndicator(password = uiState.password)
                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }

            item {
                AnimatedVisibility(
                    visible = isVisible,
                    enter = fadeIn(tween(delayMillis = baseDelay + itemDelay * 4))
                ) {
                    Column {
                        CustomTextField(
                            value = confirmPassword,
                            onValueChange = {
                                confirmPassword = it
                                viewModel.updateConfirmPassword(it)
                            },
                            label = "Confirm Password",
                            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            isError = confirmPassword.isNotEmpty() && confirmPassword != uiState.password,
                            errorMessage = if (confirmPassword.isNotEmpty() && confirmPassword != uiState.password) "Passwords do not match" else null,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }

            item {
                AnimatedVisibility(
                    visible = isVisible,
                    enter = fadeIn(tween(delayMillis = baseDelay + itemDelay * 5))
                ) {
                    val interactionSource = remember { MutableInteractionSource() }
                    val isPressed by interactionSource.collectIsPressedAsState()
                    val buttonScale by animateFloatAsState(targetValue = if (isPressed) 0.95f else 1f, animationSpec = spring(), label = "ButtonScale")

                    Button(
                        onClick = {
                            keyboardController?.hide()
                            if (viewModel.validateRegistration(confirmPassword)) {
                                scope.launch {
                                    onRegisterSuccess()
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                            .scale(buttonScale),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = ButtonOrange,
                            contentColor = Color.White
                        ),
                        interactionSource = interactionSource
                    ) {
                        Text(
                            text = "Sign Up",
                            style = MaterialTheme.typography.labelLarge
                        )
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
            .background(Color.White)
            .border(
                width = 3.dp,
                color = IconBlue,
                shape = CircleShape
            ),
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
        "Strong" -> SuccessMain
        "Medium" -> WarningMain
        "Weak" -> ErrorMain
        else -> Color.Transparent
    }
    val progress = when (strength) {
        "Strong" -> 1.0f
        "Medium" -> 0.6f
        "Weak" -> 0.3f
        else -> 0.0f
    }

    if (password.isNotEmpty()) {
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(12.dp)),
            color = color,
            trackColor = Color.LightGray
        )
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    Campus_payTheme {
        RegisterScreen(
            navController = rememberNavController(),
            onRegisterSuccess = { }
        )
    }
}